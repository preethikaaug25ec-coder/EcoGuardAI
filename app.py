import hmac
import os
import secrets
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path

from flask import (
    Flask,
    abort,
    flash,
    jsonify,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from werkzeug.exceptions import RequestEntityTooLarge
from werkzeug.utils import secure_filename

from database import (
    deactivate_location,
    get_complaint,
    get_complaint_summary,
    get_complaints,
    get_location,
    get_location_summary,
    get_locations,
    get_notification_summary,
    get_notifications,
    get_recurring_complaints,
    init_db,
    insert_complaint,
    insert_location,
    insert_notification,
    mark_all_notifications_read,
    mark_notification_read,
    seed_default_locations,
    update_complaint_status,
    update_location,
)


COMPLAINT_CATEGORIES = (
    "Overflowing waste",
    "Illegal dumping",
    "Missed collection",
    "Mixed or unsorted waste",
    "Hazardous waste",
    "Other",
)
COMPLAINT_STATUSES = ("Pending", "In Progress", "Resolved")
MAX_PHOTO_SIZE = 5 * 1024 * 1024
PHOTO_SIGNATURES = {
    ".jpg": ("image/jpeg", lambda data: data.startswith(b"\xff\xd8\xff")),
    ".jpeg": ("image/jpeg", lambda data: data.startswith(b"\xff\xd8\xff")),
    ".png": ("image/png", lambda data: data.startswith(b"\x89PNG\r\n\x1a\n")),
    ".webp": (
        "image/webp",
        lambda data: len(data) >= 12
        and data.startswith(b"RIFF")
        and data[8:12] == b"WEBP",
    ),
}


def calculate_risk(street):
    """Calculate a transparent, rule-based demonstration risk score."""

    score = 0

    if street["waste"] >= 100:
        score += 40
    elif street["waste"] >= 70:
        score += 25

    if street["organic"] >= 60:
        score += 30
    elif street["organic"] >= 35:
        score += 15

    if street["delay"] >= 2:
        score += 30
    elif street["delay"] == 1:
        score += 15

    score = min(score, 100)

    if score >= 70:
        level = "High"
    elif score >= 40:
        level = "Medium"
    else:
        level = "Low"

    return score, level


def add_risk_details(street):
    """Return a copy of a street record with calculated risk details."""

    result = street.copy()
    result["risk_score"], result["risk_level"] = calculate_risk(result)
    return result


def get_recommendations(street, risk_level):
    """Generate simple recommendations from the selected conditions."""

    recommendations = []

    if risk_level == "High":
        recommendations.append(
            "Prioritise collection and inspect the street as soon as possible."
        )
    elif risk_level == "Medium":
        recommendations.append(
            "Plan collection soon and monitor waste accumulation."
        )
    else:
        recommendations.append(
            "Continue the regular collection schedule and monitor conditions."
        )

    if street["organic"] >= 60:
        recommendations.append(
            "Prioritise safe collection and appropriate processing of organic waste."
        )

    if street["delay"] >= 2:
        recommendations.append(
            "Review the collection delay and consider rescheduling the pickup."
        )

    if street["waste"] >= 100:
        recommendations.append(
            "Consider allocating additional collection capacity."
        )

    return recommendations


def location_to_street(location):
    waste = float(location.get("estimated_total_waste_kg_per_day") or 0)
    organic = float(location.get("organic_waste_percentage") or 0)
    delay = int(location.get("collection_frequency_days") or 0)
    return {
        "id": location.get("location_id"),
        "street": location.get("name") or "Unnamed location",
        "waste": waste,
        "organic": organic,
        "delay": delay,
        "latitude": location.get("latitude"),
        "longitude": location.get("longitude"),
        "last_collection_date": location.get("last_collection_at")
        or location.get("last_collection_date"),
        "status": location.get("status") or "Active",
        "is_active": bool(location.get("is_active", 1)),
        "notes": location.get("notes"),
        "ward_or_zone": location.get("ward_or_zone") or location.get("zone"),
    }


def get_location_records(database_path, include_inactive=False):
    rows = get_locations(database_path, include_inactive=include_inactive)
    return [location_to_street(row) for row in rows]


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.environ.get("SECRET_KEY") or secrets.token_hex(32),
        DATABASE=os.environ.get(
            "DATABASE_PATH",
            os.path.join(app.instance_path, "ecoguard.sqlite3"),
        ),
        UPLOAD_FOLDER=os.path.join(app.instance_path, "uploads"),
        MAX_CONTENT_LENGTH=MAX_PHOTO_SIZE + 256 * 1024,
        MAX_PHOTO_SIZE=MAX_PHOTO_SIZE,
        ADMIN_USERNAME="123",
        ADMIN_PASSWORD="123",
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=os.environ.get("SESSION_COOKIE_SECURE", "").lower()
        in ("1", "true", "yes"),
    )
    if test_config:
        app.config.update(test_config)

    Path(app.instance_path).mkdir(parents=True, exist_ok=True)
    init_db(app.config["DATABASE"])
    seed_default_locations(app.config["DATABASE"])

    def build_hotspot_zones():
        complaints = get_complaints(app.config["DATABASE"], limit=None)
        street_counts = {}
        for complaint in complaints:
            street_name = complaint.get("street", "").strip()
            if street_name:
                street_counts[street_name] = street_counts.get(street_name, 0) + 1

        zone_rows = []
        for item in get_location_records(app.config["DATABASE"], include_inactive=False):
            score, level = calculate_risk(item)
            street_name = item["street"]
            open_complaints = sum(
                1
                for complaint in complaints
                if complaint.get("street", "").lower() == street_name.lower()
                and complaint.get("status") != "Resolved"
            )
            recommended_actions = get_recommendations(item, level)
            zone_rows.append(
                {
                    "id": item["id"],
                    "street": street_name,
                    "risk_score": score,
                    "risk_level": level,
                    "waste": item["waste"],
                    "organic": item["organic"],
                    "delay": item["delay"],
                    "open_complaints": open_complaints,
                    "complaint_count": street_counts.get(street_name, 0),
                    "last_collection_date": item.get("last_collection_date"),
                    "recommended_action": recommended_actions[0] if recommended_actions else "Monitor conditions closely.",
                    "recommendations": recommended_actions,
                    "coords": {
                        "lat": item.get("latitude") if item.get("latitude") is not None else 13.0827,
                        "lng": item.get("longitude") if item.get("longitude") is not None else 80.2707,
                    },
                }
            )
        return sorted(zone_rows, key=lambda row: row["risk_score"], reverse=True)

    def build_priority_zones():
        hotspot_zones = build_hotspot_zones()
        priority_rows = []
        for zone in hotspot_zones:
            score = min(100, zone["risk_score"] + (zone["open_complaints"] * 6) + max(0, zone["delay"] - 1) * 8)
            reasons = []
            if zone["risk_level"] == "High":
                reasons.append("High rule-based risk score from waste load and delay.")
            if zone["open_complaints"]:
                reasons.append(f"{zone['open_complaints']} unresolved complaint(s) in the zone.")
            if zone["delay"] >= 2:
                reasons.append("Collection delay exceeds the preferred schedule.")
            if zone["organic"] >= 60:
                reasons.append("Organic waste volume is high and requires special handling.")
            if not reasons:
                reasons.append("Conditions remain within the standard collection plan.")
            priority_rows.append(
                {
                    "street": zone["street"],
                    "risk_score": score,
                    "risk_level": zone["risk_level"],
                    "open_complaints": zone["open_complaints"],
                    "delay": zone["delay"],
                    "reasons": reasons,
                    "recommended_action": zone["recommended_action"],
                }
            )
        return sorted(priority_rows, key=lambda row: row["risk_score"], reverse=True)

    def sync_demo_notifications(database_path):
        hotspots = build_hotspot_zones()
        for zone in hotspots:
            if zone["risk_level"] == "High":
                insert_notification(
                    database_path,
                    event_type="high_risk_zone",
                    title=f"High-risk zone: {zone['street']}",
                    message=(
                        f"{zone['street']} is now high risk. "
                        f"Recommended action: {zone['recommended_action']}"
                    ),
                    related_zone=zone["street"],
                    notification_level="urgent",
                    recipient="admin",
                    event_key=f"risk:{zone['street']}",
                )
            if zone["delay"] >= 2:
                insert_notification(
                    database_path,
                    event_type="collection_overdue",
                    title=f"Collection overdue for {zone['street']}",
                    message=(
                        f"Waste collection for {zone['street']} is {zone['delay']} days overdue. "
                        "Review neighbourhood scheduling and dispatch resources."
                    ),
                    related_zone=zone["street"],
                    notification_level="warning",
                    recipient="admin",
                    event_key=f"overdue:{zone['street']}",
                )
        recurring = get_recurring_complaints(database_path)
        for item in recurring[:3]:
            insert_notification(
                database_path,
                event_type="recurring_complaint",
                title=f"Recurring issues near {item['street']}",
                message=(
                    f"{item['street']} has {item['complaint_count']} complaints recorded and may need "
                    "follow-up collection planning."
                ),
                related_zone=item["street"],
                notification_level="info",
                recipient="admin",
                event_key=f"recurring:{item['street']}",
            )

    def dashboard_context():
        sync_demo_notifications(app.config["DATABASE"])
        location_rows = get_location_records(app.config["DATABASE"], include_inactive=False)
        streets = [add_risk_details(item) for item in location_rows]
        total_waste = sum(item["waste"] for item in streets)
        total_organic = sum(item["organic"] for item in streets)
        high_risk_count = sum(item["risk_level"] == "High" for item in streets)
        medium_risk_count = sum(item["risk_level"] == "Medium" for item in streets)
        low_risk_count = sum(item["risk_level"] == "Low" for item in streets)
        complaint_summary = get_complaint_summary(app.config["DATABASE"])
        recent_complaints = get_complaints(app.config["DATABASE"], limit=10)
        recurring_complaints = get_recurring_complaints(app.config["DATABASE"])
        hotspot_zones = build_hotspot_zones()
        priority_zones = build_priority_zones()
        notifications = get_notifications(app.config["DATABASE"], limit=8)
        notification_summary = get_notification_summary(app.config["DATABASE"])
        return {
            "streets": streets,
            "hotspot_zones": hotspot_zones,
            "priority_zones": priority_zones,
            "total_waste": total_waste,
            "total_organic": total_organic,
            "high_risk_count": high_risk_count,
            "medium_risk_count": medium_risk_count,
            "low_risk_count": low_risk_count,
            "complaint_summary": complaint_summary,
            "recent_complaints": recent_complaints,
            "recurring_complaints": recurring_complaints,
            "notifications": notifications,
            "notification_summary": notification_summary,
        }

    def csrf_token():
        token = session.get("csrf_token")
        if not token:
            token = secrets.token_urlsafe(32)
            session["csrf_token"] = token
        return token

    def valid_csrf_token():
        token = request.form.get("csrf_token", "")
        expected = session.get("csrf_token", "")
        return bool(expected) and hmac.compare_digest(
            token.encode("utf-8"), expected.encode("utf-8")
        )

    def admin_is_configured():
        username = app.config.get("ADMIN_USERNAME", "")
        password = app.config.get("ADMIN_PASSWORD", "")
        return bool(username and password)

    def require_admin():
        if not admin_is_configured():
            abort(
                503,
                description="Administrator credentials are not configured.",
            )
        if session.get("is_admin") is not True:
            return redirect(url_for("admin_login"))
        return None

    def validate_photo(photo, complaint_id):
        if not photo or not photo.filename:
            return None

        extension = Path(secure_filename(photo.filename)).suffix.lower()
        signature = PHOTO_SIGNATURES.get(extension)
        if not signature:
            raise ValueError("Photo must be a JPEG, PNG, or WebP image.")

        photo_bytes = photo.stream.read(app.config["MAX_PHOTO_SIZE"] + 1)
        photo.stream.seek(0)
        if len(photo_bytes) > app.config["MAX_PHOTO_SIZE"]:
            raise ValueError("Photo must be 5 MB or smaller.")

        expected_mimetype, signature_check = signature
        if photo.mimetype != expected_mimetype or not signature_check(photo_bytes):
            raise ValueError("The uploaded file does not match a supported photo type.")

        upload_folder = Path(app.config["UPLOAD_FOLDER"])
        upload_folder.mkdir(parents=True, exist_ok=True)
        safe_name = secure_filename(f"{complaint_id}{extension}")
        photo.save(upload_folder / safe_name)
        return safe_name

    def validate_location_payload(data, allow_existing_name=None):
        name = (data.get("name", "") or "").strip()
        if not 2 <= len(name) <= 120:
            raise ValueError("Location name must be between 2 and 120 characters.")
        location_type = (data.get("location_type", "") or "").strip() or "other"
        valid_types = {"junction", "street", "ward", "market", "residential area", "other"}
        if location_type.lower() not in {item.lower() for item in valid_types}:
            raise ValueError("Please choose a valid location type.")
        ward_or_zone = (data.get("ward_or_zone", "") or "").strip()
        if not ward_or_zone:
            raise ValueError("Ward or zone is required.")
        try:
            waste = float(data.get("estimated_total_waste_kg_per_day", 0) or 0)
            organic = float(data.get("organic_waste_percentage", 0) or 0)
            collection_frequency = int(data.get("collection_frequency_days", 0) or 0)
        except (TypeError, ValueError):
            raise ValueError("Waste, organic content, and collection frequency must be valid numbers.")
        if waste < 0:
            raise ValueError("Estimated total waste cannot be negative.")
        if not 0 <= organic <= 100:
            raise ValueError("Organic waste percentage must be between 0 and 100.")
        if collection_frequency <= 0:
            raise ValueError("Collection frequency must be a positive number of days.")

        latitude = data.get("latitude", "")
        longitude = data.get("longitude", "")
        if latitude not in (None, "") or longitude not in (None, ""):
            try:
                latitude_value = float(latitude) if latitude not in (None, "") else None
                longitude_value = float(longitude) if longitude not in (None, "") else None
            except (TypeError, ValueError):
                raise ValueError("Latitude and longitude must be numeric values.")
            if latitude_value is None or longitude_value is None:
                raise ValueError("Latitude and longitude must be provided together.")
            if not -90 <= latitude_value <= 90 or not -180 <= longitude_value <= 180:
                raise ValueError("Coordinates are outside the valid Earth range.")
        else:
            latitude_value = None
            longitude_value = None

        fill_level = data.get("fill_level_percentage", "")
        if fill_level not in (None, ""):
            try:
                fill_level_value = float(fill_level)
            except ValueError as exc:
                raise ValueError("Fill level percentage must be numeric.") from exc
            if not 0 <= fill_level_value <= 100:
                raise ValueError("Fill level percentage must be between 0 and 100.")
        else:
            fill_level_value = None

        segregation = data.get("segregation_efficiency_percentage", "")
        if segregation not in (None, ""):
            try:
                segregation_value = float(segregation)
            except ValueError as exc:
                raise ValueError("Segregation efficiency must be numeric.") from exc
            if not 0 <= segregation_value <= 100:
                raise ValueError("Segregation efficiency must be between 0 and 100.")
        else:
            segregation_value = None

        last_collection_at = (data.get("last_collection_at", "") or "").strip()
        if last_collection_at:
            try:
                datetime.fromisoformat(last_collection_at.replace("Z", "+00:00"))
            except ValueError as exc:
                raise ValueError("Last collection date must be a valid ISO date or timestamp.") from exc

        overflow_history = (data.get("overflow_history", "") or "").strip() or None
        notes = (data.get("notes", "") or "").strip() or None
        if notes is not None and len(notes) > 500:
            raise ValueError("Notes must be 500 characters or fewer.")
        return {
            "name": name,
            "location_type": location_type,
            "ward_or_zone": ward_or_zone,
            "estimated_total_waste_kg_per_day": waste,
            "organic_waste_percentage": organic,
            "collection_frequency_days": collection_frequency,
            "latitude": latitude_value,
            "longitude": longitude_value,
            "last_collection_at": last_collection_at or None,
            "fill_level_percentage": fill_level_value,
            "overflow_history": overflow_history,
            "segregation_efficiency_percentage": segregation_value,
            "notes": notes,
        }

    def render_page(template, active_page, title_key, subtitle_key, **extra_context):
        context = dashboard_context()
        page_titles = {
            "dashboardTitle": "Smart Waste Dashboard",
            "analyticsTitle": "Analytics and explainable estimates",
            "riskPageTitle": "Street-level risk monitoring",
            "complaintsHeading": "Citizen complaints",
            "trackHeading": "Track a complaint",
            "simulatorHeading": "What-If Simulator",
            "adminLoginTitle": "Administrator sign in",
            "adminPageTitle": "Complaint administration",
        }
        page_subtitles = {
            "dashboardSubtitle": "Monitor conditions, compare street-level risk, and explore interventions.",
            "analyticsDescription": "Compare illustrative waste inputs and inspect transparent rule-based risk estimates.",
            "riskPageDescription": "Review transparent demonstration scores and suggested collection actions.",
            "complaintsSubtitle": "Report local waste concerns and review recent community reports.",
            "trackSubtitle": "Enter the complaint ID you received after submitting a report.",
            "simulatorSubtitle": "Change street conditions and see how the rule-based risk score responds.",
            "adminLoginDescription": "Sign in with the administrator credentials configured for this installation.",
            "adminPageDescription": "Review citizen reports and update their status.",
        }
        context.update(
            active_page=active_page,
            page_title=page_titles[title_key],
            page_heading_key=title_key,
            page_subtitle_key=subtitle_key,
            page_subtitle=page_subtitles[subtitle_key],
            tracking_id="",
            tracked_complaint=None,
            tracking_error=False,
            submitted_id=None,
            csrf_token=csrf_token(),
        )
        context.update(extra_context)
        return render_template(template, **context)

    @app.errorhandler(RequestEntityTooLarge)
    def handle_upload_too_large(_error):
        flash("The uploaded request is too large. Photos must be 5 MB or smaller.", "error")
        return render_page(
            "complaints.html", "complaints", "complaintsHeading", "complaintsSubtitle"
        ), 413

    @app.route("/")
    def dashboard():
        return render_page(
            "index.html", "overview", "dashboardTitle", "dashboardSubtitle"
        )

    @app.route("/analytics")
    def analytics():
        return render_page(
            "analytics.html",
            "analytics",
            "analyticsTitle",
            "analyticsDescription",
        )

    @app.route("/risk")
    def risk_monitor():
        return render_page(
            "risk.html",
            "risk",
            "riskPageTitle",
            "riskPageDescription",
        )

    @app.route("/complaints", methods=["GET"])
    def complaints_page():
        return render_page(
            "complaints.html", "complaints", "complaintsHeading", "complaintsSubtitle"
        )

    @app.route("/municipality/locations", methods=["GET", "POST"])
    def municipality_locations_page():
        redirect_response = require_admin()
        if redirect_response:
            return redirect_response
        if request.method == "POST":
            if not valid_csrf_token():
                abort(400, description="Invalid security token. Reload the page and try again.")
            action = request.form.get("action", "add")
            if action == "edit":
                location_id = request.form.get("location_id", type=int)
                if not location_id:
                    flash("A valid location ID is required to edit a record.", "error")
                    return redirect(url_for("municipality_locations_page"))
                location = get_location(app.config["DATABASE"], location_id)
                if not location:
                    flash("That location could not be found.", "error")
                    return redirect(url_for("municipality_locations_page"))
                form_data = {
                    "name": request.form.get("name", "").strip(),
                    "location_type": request.form.get("location_type", "").strip(),
                    "ward_or_zone": request.form.get("ward_or_zone", "").strip(),
                    "estimated_total_waste_kg_per_day": request.form.get("estimated_total_waste_kg_per_day", "").strip(),
                    "organic_waste_percentage": request.form.get("organic_waste_percentage", "").strip(),
                    "collection_frequency_days": request.form.get("collection_frequency_days", "").strip(),
                    "latitude": request.form.get("latitude", "").strip(),
                    "longitude": request.form.get("longitude", "").strip(),
                    "last_collection_at": request.form.get("last_collection_at", "").strip(),
                    "fill_level_percentage": request.form.get("fill_level_percentage", "").strip(),
                    "overflow_history": request.form.get("overflow_history", "").strip(),
                    "segregation_efficiency_percentage": request.form.get("segregation_efficiency_percentage", "").strip(),
                    "notes": request.form.get("notes", "").strip(),
                }
                try:
                    normalized = validate_location_payload(form_data, allow_existing_name=location.get("name"))
                    if normalized.get("name") and normalized["name"].lower() != location.get("name", "").lower():
                        existing = get_locations(app.config["DATABASE"], include_inactive=True, search=normalized["name"])
                        if existing and any(item["location_id"] != location_id for item in existing):
                            raise ValueError("A location with a similar name already exists.")
                    update_location(app.config["DATABASE"], location_id, **normalized)
                    flash("Location updated successfully.", "success")
                except ValueError as error:
                    flash(str(error), "error")
                return redirect(url_for("municipality_locations_page"))
            name = request.form.get("name", "").strip()
            location_type = request.form.get("location_type", "").strip()
            ward_or_zone = request.form.get("ward_or_zone", "").strip()
            form_values = {
                "name": name,
                "location_type": location_type,
                "ward_or_zone": ward_or_zone,
                "estimated_total_waste_kg_per_day": request.form.get("estimated_total_waste_kg_per_day", "").strip(),
                "organic_waste_percentage": request.form.get("organic_waste_percentage", "").strip(),
                "collection_frequency_days": request.form.get("collection_frequency_days", "").strip(),
                "latitude": request.form.get("latitude", "").strip(),
                "longitude": request.form.get("longitude", "").strip(),
                "last_collection_at": request.form.get("last_collection_at", "").strip(),
                "fill_level_percentage": request.form.get("fill_level_percentage", "").strip(),
                "overflow_history": request.form.get("overflow_history", "").strip(),
                "segregation_efficiency_percentage": request.form.get("segregation_efficiency_percentage", "").strip(),
                "notes": request.form.get("notes", "").strip(),
            }
            try:
                normalized = validate_location_payload(form_values)
                insert_location(
                    app.config["DATABASE"],
                    name=normalized["name"],
                    location_type=normalized["location_type"],
                    ward_or_zone=normalized["ward_or_zone"],
                    estimated_total_waste_kg_per_day=normalized["estimated_total_waste_kg_per_day"],
                    organic_waste_percentage=normalized["organic_waste_percentage"],
                    collection_frequency_days=normalized["collection_frequency_days"],
                    latitude=normalized.get("latitude"),
                    longitude=normalized.get("longitude"),
                    last_collection_at=normalized.get("last_collection_at"),
                    fill_level_percentage=normalized.get("fill_level_percentage"),
                    overflow_history=normalized.get("overflow_history"),
                    segregation_efficiency_percentage=normalized.get("segregation_efficiency_percentage"),
                    notes=normalized.get("notes"),
                    is_active=True,
                )
                flash("Location added successfully.", "success")
            except ValueError as error:
                flash(str(error), "error")
            return redirect(url_for("municipality_locations_page"))

        search_term = request.args.get("q", "").strip()
        status_filter = request.args.get("status", "all").strip()
        locations = get_locations(app.config["DATABASE"], include_inactive=True, search=search_term or None)
        if status_filter != "all":
            locations = [loc for loc in locations if loc.get("status") == status_filter]
        summary = get_location_summary(app.config["DATABASE"])
        return render_template(
            "municipality_locations.html",
            locations=locations,
            summary=summary,
            csrf_token=csrf_token(),
            active_page="municipality",
            page_title="Municipality management",
            page_heading_key="municipalityTitle",
            page_subtitle_key="municipalityDescription",
            page_subtitle="Add, review, and maintain collection locations across the city.",
            notifications=get_notifications(app.config["DATABASE"], limit=6),
            notification_summary=get_notification_summary(app.config["DATABASE"]),
            location_types=("junction", "street", "ward", "market", "residential area", "other"),
            search_term=search_term,
            status_filter=status_filter,
        )

    @app.route("/municipality/locations/<int:location_id>")
    def municipality_location_detail(location_id):
        redirect_response = require_admin()
        if redirect_response:
            return redirect_response
        location = get_location(app.config["DATABASE"], location_id)
        if not location:
            abort(404, description="Location not found.")
        related_complaints = [
            complaint
            for complaint in get_complaints(app.config["DATABASE"], limit=None)
            if complaint.get("street", "").lower() == str(location.get("name", "")).lower()
        ]
        return render_template(
            "location_detail.html",
            location=location,
            related_complaints=related_complaints,
            risk=calculate_risk(location_to_street(location)),
            active_page="municipality",
            page_title="Location detail",
            page_heading_key="locationDetailTitle",
            page_subtitle_key="locationDetailDescription",
            page_subtitle="Review current risk, complaints, and operational notes.",
            notifications=get_notifications(app.config["DATABASE"], limit=6),
            notification_summary=get_notification_summary(app.config["DATABASE"]),
        )

    @app.route("/municipality/locations/<int:location_id>/deactivate", methods=["POST"])
    def municipality_location_deactivate(location_id):
        redirect_response = require_admin()
        if redirect_response:
            return redirect_response
        if not valid_csrf_token():
            abort(400, description="Invalid security token. Reload the page and try again.")
        location = get_location(app.config["DATABASE"], location_id)
        if not location:
            abort(404, description="Location not found.")
        if deactivate_location(app.config["DATABASE"], location_id):
            flash(f"{location['name']} has been deactivated without deleting its historical records.", "success")
        else:
            flash("The location could not be deactivated.", "error")
        return redirect(url_for("municipality_locations_page"))

    @app.route("/simulator")
    def simulator_page():
        return render_page(
            "simulator.html", "simulator", "simulatorHeading", "simulatorSubtitle"
        )

    @app.route("/track")
    def track_complaint():
        complaint_id = request.args.get("complaint_id", "").strip().upper()
        submitted_id = request.args.get("submitted", "").strip().upper()
        complaint = (
            get_complaint(app.config["DATABASE"], complaint_id)
            if complaint_id
            else None
        )
        return render_page(
            "tracking.html",
            "tracking",
            "trackHeading",
            "trackSubtitle",
            tracking_id=complaint_id,
            tracked_complaint=complaint,
            tracking_error=bool(complaint_id and not complaint),
            submitted_id=submitted_id,
        )

    @app.route("/complaints", methods=["POST"])
    def submit_complaint():
        if not valid_csrf_token():
            abort(400, description="Invalid security token. Reload the page and try again.")

        name = request.form.get("citizen_name", "").strip()
        street = request.form.get("street", "").strip()
        category = request.form.get("category", "").strip()
        description = request.form.get("description", "").strip()
        photo = request.files.get("photo")

        validation_error = None
        if not 2 <= len(name) <= 100:
            validation_error = "Name must be between 2 and 100 characters."
        elif not 2 <= len(street) <= 120:
            validation_error = "Street must be between 2 and 120 characters."
        elif category not in COMPLAINT_CATEGORIES:
            validation_error = "Please select a valid waste problem category."
        elif not 10 <= len(description) <= 2000:
            validation_error = "Description must be between 10 and 2000 characters."

        complaint_id = f"EG-{uuid.uuid4().hex.upper()}"
        photo_filename = None
        if validation_error is None:
            try:
                photo_filename = validate_photo(photo, complaint_id)
            except ValueError as error:
                validation_error = str(error)
            except OSError:
                app.logger.exception("Could not store complaint photo")
                validation_error = "The photo could not be stored. Please try again."

        if validation_error:
            flash(validation_error, "error")
            return redirect(url_for("complaints_page") + "#complaints")

        try:
            insert_complaint(
                app.config["DATABASE"],
                complaint_id=complaint_id,
                citizen_name=name,
                street=street,
                category=category,
                description=description,
                photo_filename=photo_filename,
            )
            insert_notification(
                app.config["DATABASE"],
                event_type="complaint_submitted",
                title="New citizen complaint received",
                message=(
                    f"A new complaint for {street} was submitted and is now awaiting review."
                ),
                related_complaint_id=complaint_id,
                related_zone=street,
                notification_level="warning",
                recipient="admin",
                event_key=f"complaint:{complaint_id}",
            )
        except sqlite3.Error:
            if photo_filename:
                (Path(app.config["UPLOAD_FOLDER"]) / photo_filename).unlink(
                    missing_ok=True
                )
            app.logger.exception("Could not save complaint %s", complaint_id)
            flash("The complaint could not be saved. Please try again.", "error")
            return redirect(url_for("complaints_page") + "#complaints")

        return redirect(
            url_for(
                "track_complaint",
                complaint_id=complaint_id,
                submitted=complaint_id,
            )
            + "#tracking"
        )

    @app.route("/api/complaints/<complaint_id>")
    def complaint_tracking_api(complaint_id):
        complaint = get_complaint(app.config["DATABASE"], complaint_id.strip().upper())
        if not complaint:
            return jsonify({"error": "No complaint was found with that ID."}), 404
        complaint.pop("photo_filename", None)
        return jsonify(complaint)

    @app.route("/admin/login", methods=["GET", "POST"])
    def admin_login():
        if not admin_is_configured():
            abort(503, description="Set ADMIN_USERNAME and ADMIN_PASSWORD to enable admin access.")

        if session.get("is_admin") is True:
            return redirect(url_for("admin_dashboard"))

        if request.method == "POST":
            if not valid_csrf_token():
                abort(400, description="Invalid security token. Reload the page and try again.")
            username = request.form.get("username", "")
            password = request.form.get("password", "")
            username_ok = hmac.compare_digest(
                username.encode("utf-8"),
                str(app.config["ADMIN_USERNAME"]).encode("utf-8"),
            )
            password_ok = hmac.compare_digest(
                password.encode("utf-8"),
                str(app.config["ADMIN_PASSWORD"]).encode("utf-8"),
            )
            if username_ok and password_ok:
                session.clear()
                session["is_admin"] = True
                csrf_token()
                return redirect(url_for("admin_dashboard"))
            flash("Administrator username or password is incorrect.", "error")

        return render_page(
            "admin_login.html",
            "admin",
            "adminLoginTitle",
            "adminLoginDescription",
            csrf_token=csrf_token(),
        )

    @app.route("/admin", methods=["GET"])
    def admin_dashboard():
        redirect_response = require_admin()
        if redirect_response:
            return redirect_response
        return render_template(
            "admin.html",
            complaints=get_complaints(app.config["DATABASE"], limit=None),
            statuses=COMPLAINT_STATUSES,
            csrf_token=csrf_token(),
            active_page="admin",
            page_title="adminPageTitle",
            page_heading_key="adminPageTitle",
            page_subtitle_key="adminPageDescription",
            page_subtitle="Review citizen reports and update their status.",
            notifications=get_notifications(app.config["DATABASE"], limit=10),
            notification_summary=get_notification_summary(app.config["DATABASE"]),
        )

    @app.route("/admin/complaints/<complaint_id>/status", methods=["POST"])
    def update_status(complaint_id):
        redirect_response = require_admin()
        if redirect_response:
            return redirect_response
        if not valid_csrf_token():
            abort(400, description="Invalid security token. Reload the page and try again.")

        new_status = request.form.get("status", "")
        if new_status not in COMPLAINT_STATUSES:
            abort(400, description="Please choose a valid complaint status.")
        complaint = get_complaint(app.config["DATABASE"], complaint_id.strip().upper())
        if not complaint:
            abort(404, description="Complaint ID was not found.")
        if not update_complaint_status(
            app.config["DATABASE"], complaint_id.strip().upper(), new_status
        ):
            abort(404, description="Complaint ID was not found.")

        insert_notification(
            app.config["DATABASE"],
            event_type="complaint_status_change",
            title=f"Complaint {complaint_id.upper()} updated",
            message=(
                f"Complaint for {complaint['street']} is now marked as {new_status}."
            ),
            related_complaint_id=complaint_id.upper(),
            related_zone=complaint["street"],
            notification_level="info" if new_status == "Resolved" else "warning",
            recipient="admin",
            event_key=f"status:{complaint_id.upper()}:{new_status}",
        )

        flash(f"Complaint {complaint_id.upper()} updated to {new_status}.", "success")
        return redirect(url_for("admin_dashboard"))

    @app.route("/admin/logout", methods=["POST"])
    def admin_logout():
        redirect_response = require_admin()
        if redirect_response:
            return redirect_response
        if not valid_csrf_token():
            abort(400, description="Invalid security token. Reload the page and try again.")
        session.clear()
        return redirect(url_for("admin_login"))

    @app.route("/api/notifications")
    def notifications_api():
        if session.get("is_admin") is not True:
            return jsonify({"error": "Authentication required."}), 401
        notifications = get_notifications(app.config["DATABASE"], limit=20)
        return jsonify({"notifications": notifications, "unread": sum(1 for item in notifications if not item["is_read"])})

    @app.route("/api/notifications/<int:notification_id>/read", methods=["POST"])
    def mark_notification_api(notification_id):
        if session.get("is_admin") is not True:
            return jsonify({"error": "Authentication required."}), 401
        status = mark_notification_read(app.config["DATABASE"], notification_id)
        return jsonify({"success": status})

    @app.route("/api/notifications/read-all", methods=["POST"])
    def mark_all_notifications_api():
        if session.get("is_admin") is not True:
            return jsonify({"error": "Authentication required."}), 401
        count = mark_all_notifications_read(app.config["DATABASE"], recipient="admin")
        return jsonify({"success": True, "count": count})

    @app.route("/api/simulate", methods=["POST"])
    def simulate():
        """Calculate a what-if risk score without changing saved demo data."""

        data = request.get_json(silent=True) or {}
        street_name = str(data.get("street", "")).strip()
        if not street_name:
            return jsonify({"error": "Please select a street."}), 400

        location = next(
            (
                item
                for item in get_locations(app.config["DATABASE"], include_inactive=False)
                if item.get("name", "").lower() == street_name.lower()
            ),
            None,
        )
        if location:
            data["waste"] = data.get("waste", location.get("estimated_total_waste_kg_per_day", 0))
            data["organic"] = data.get("organic", location.get("organic_waste_percentage", 0))
            data["delay"] = data.get("delay", location.get("collection_frequency_days", 0))

        try:
            waste = int(data.get("waste", 0))
            organic = int(data.get("organic", 0))
            delay = int(data.get("delay", 0))
        except (TypeError, ValueError):
            return jsonify({"error": "Please enter valid whole numbers."}), 400

        if not 0 <= waste <= 1000:
            return jsonify({"error": "Waste quantity must be between 0 and 1000."}), 400
        if not 0 <= organic <= waste:
            return jsonify({
                "error": "Organic waste must be between 0 and total waste."
            }), 400
        if not 0 <= delay <= 30:
            return jsonify({
                "error": "Collection delay must be between 0 and 30 days."
            }), 400

        scenario = {
            "street": street_name,
            "waste": waste,
            "organic": organic,
            "delay": delay,
        }
        score, level = calculate_risk(scenario)
        original = location_to_street(location) if location else None
        if original:
            original_score, original_level = calculate_risk(original)
        else:
            original_score, original_level = None, None

        if original_score is not None and abs(score - original_score) >= 20:
            insert_notification(
                app.config["DATABASE"],
                event_type="simulation_risk_change",
                title=f"Risk scenario changed for {street_name}",
                message=(
                    f"The simulated risk for {street_name} increased from {original_score} to {score}, "
                    "requiring a priority review."
                    if score > original_score
                    else f"The simulated risk for {street_name} dropped from {original_score} to {score}."
                ),
                related_zone=street_name,
                notification_level="warning",
                recipient="admin",
                event_key=f"simulation:{street_name}:{waste}:{organic}:{delay}",
            )

        return jsonify({
            "street": street_name,
            "waste": waste,
            "organic": organic,
            "delay": delay,
            "risk_score": score,
            "risk_level": level,
            "original_score": original_score,
            "original_level": original_level,
            "recommendations": get_recommendations(scenario, level),
            "note": (
                "Illustrative rule-based score. It is not a measured methane "
                "concentration or a validated environmental prediction."
            ),
        })

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG", "").lower() in ("1", "true", "yes"))
