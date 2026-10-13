import io
import os
import re
import tempfile
import unittest
from pathlib import Path

from app import create_app
from database import get_complaint, get_complaint_summary


class ComplaintFeatureTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.database_path = os.path.join(self.temp_dir.name, "complaints.sqlite3")
        self.upload_path = os.path.join(self.temp_dir.name, "private-uploads")
        self.app = create_app({
            "TESTING": True,
            "SECRET_KEY": "test-only-secret",
            "DATABASE": self.database_path,
            "UPLOAD_FOLDER": self.upload_path,
            "ADMIN_USERNAME": "test-admin",
            "ADMIN_PASSWORD": "test-password",
        })
        self.client = self.app.test_client()

    def submit(self, **overrides):
        payload = {
            "citizen_name": "Asha Citizen",
            "street": "Anna Nagar",
            "category": "Overflowing waste",
            "description": "Waste has been piling up near the bus stop.",
            "csrf_token": self.csrf_token(self.client.get("/complaints")),
        }
        payload.update(overrides)
        return self.client.post("/complaints", data=payload)

    def complaint_id_from(self, response):
        match = re.search(r"complaint_id=(EG-[A-F0-9]{32})", response.headers["Location"])
        self.assertIsNotNone(match)
        return match.group(1)

    def csrf_token(self, response):
        match = re.search(
            r'name="csrf_token" value="([^"]+)"',
            response.get_data(as_text=True),
        )
        self.assertIsNotNone(match)
        return match.group(1)

    def login_admin(self):
        login_page = self.client.get("/admin/login")
        token = self.csrf_token(login_page)
        return self.client.post(
            "/admin/login",
            data={
                "csrf_token": token,
                "username": "test-admin",
                "password": "test-password",
            },
        )

    def test_submission_creates_unique_pending_complaint(self):
        response = self.submit()
        self.assertEqual(response.status_code, 302)
        complaint_id = self.complaint_id_from(response)
        record = get_complaint(self.database_path, complaint_id)

        self.assertEqual(record["status"], "Pending")
        self.assertEqual(record["street"], "Anna Nagar")
        self.assertEqual(record["category"], "Overflowing waste")
        self.assertEqual(len(complaint_id), 35)
        self.assertEqual(self.client.get(response.headers["Location"]).status_code, 200)

        second_response = self.submit()
        self.assertNotEqual(complaint_id, self.complaint_id_from(second_response))

    def test_submission_remains_trackable_after_app_reinitialization(self):
        complaint_id = self.complaint_id_from(self.submit())
        restarted_app = create_app({
            "TESTING": True,
            "SECRET_KEY": "test-only-secret",
            "DATABASE": self.database_path,
            "UPLOAD_FOLDER": self.upload_path,
            "ADMIN_USERNAME": "test-admin",
            "ADMIN_PASSWORD": "test-password",
        })
        response = restarted_app.test_client().get(
            f"/track?complaint_id={complaint_id}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn(complaint_id.encode(), response.data)

    def test_backend_rejects_missing_and_invalid_fields(self):
        invalid_submissions = (
            ({"citizen_name": " "}, b"Name must be between"),
            ({"category": "not-a-category"}, b"valid waste problem category"),
            ({"description": "short"}, b"Description must be between"),
        )
        for values, message in invalid_submissions:
            response = self.submit(**values)
            self.assertEqual(response.status_code, 302)
            dashboard = self.client.get(response.headers["Location"])
            self.assertIn(message, dashboard.data)
        self.assertEqual(get_complaint_summary(self.database_path)["total"], 0)

    def test_complaint_submission_rejects_missing_csrf_token(self):
        response = self.client.post(
            "/complaints",
            data={
                "citizen_name": "Asha Citizen",
                "street": "Anna Nagar",
                "category": "Overflowing waste",
                "description": "Waste has been piling up near the bus stop.",
            },
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(get_complaint_summary(self.database_path)["total"], 0)

    def test_photo_type_validation_and_safe_filename(self):
        rejected = self.submit(
            photo=(io.BytesIO(b"not an image"), "unsafe.txt", "text/plain")
        )
        self.assertEqual(rejected.status_code, 302)
        self.assertEqual(get_complaint_summary(self.database_path)["total"], 0)

        accepted = self.submit(
            photo=(
                io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"test-content"),
                "../../unsafe.png",
                "image/png",
            )
        )
        complaint_id = self.complaint_id_from(accepted)
        record = get_complaint(self.database_path, complaint_id)
        self.assertEqual(record["photo_filename"], f"{complaint_id}.png")
        self.assertTrue(os.path.isfile(os.path.join(self.upload_path, record["photo_filename"])))

    def test_photo_size_limit_is_enforced(self):
        response = self.submit(
            photo=(
                io.BytesIO(b"\x89PNG\r\n\x1a\n" + b"x" * (5 * 1024 * 1024)),
                "large.png",
                "image/png",
            )
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(get_complaint_summary(self.database_path)["total"], 0)

    def test_tracking_displays_record_and_reports_invalid_id(self):
        complaint_id = self.complaint_id_from(self.submit())
        found = self.client.get(f"/track?complaint_id={complaint_id.lower()}")
        self.assertEqual(found.status_code, 200)
        self.assertIn(complaint_id.encode(), found.data)
        self.assertIn(b"Pending", found.data)

        missing = self.client.get("/track?complaint_id=EG-" + "0" * 32)
        self.assertIn(b"complaint ID", missing.data)
        self.assertIn(b"try again", missing.data)
        api_missing = self.client.get("/api/complaints/EG-" + "0" * 32)
        self.assertEqual(api_missing.status_code, 404)

    def test_public_dashboard_reflects_new_reports_and_recurring_streets(self):
        self.submit()
        self.submit(citizen_name="Another Citizen", description="A second report at this location.")
        response = self.client.get("/")
        self.assertIn(b"2", response.data)
        self.assertIn(b"Anna Nagar", response.data)
        complaints_page = self.client.get("/complaints")
        self.assertIn(b"Recurring complaint streets", complaints_page.data)
        self.assertIn(b"2 ", complaints_page.data)

    def test_each_platform_page_has_shared_shell_and_active_navigation(self):
        pages = (
            ("/", b'href="/" aria-current="page"', b"wasteChart"),
            ("/analytics", b'href="/analytics" aria-current="page"', b"riskChart"),
            ("/risk", b'href="/risk" aria-current="page"', b"streetTableBody"),
            ("/complaints", b'href="/complaints" aria-current="page"', b"complaintForm"),
            ("/track", b'href="/track" aria-current="page"', b"trackComplaintId"),
            ("/simulator", b'href="/simulator" aria-current="page"', b"wasteRange"),
        )
        for path, active_link, page_content in pages:
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 200)
                self.assertIn(b"ecoguard.css", response.data)
                self.assertIn(b"ecoguard.js", response.data)
                self.assertIn(active_link, response.data)
                self.assertIn(page_content, response.data)

        static_script = self.client.get("/static/js/ecoguard.js")
        self.assertEqual(static_script.status_code, 200)
        static_script.close()
        static_styles = self.client.get("/static/css/ecoguard.css")
        self.assertEqual(static_styles.status_code, 200)
        static_styles.close()

    def test_municipality_location_management_is_admin_only_and_writes_to_database(self):
        protected = self.client.get("/municipality/locations")
        self.assertEqual(protected.status_code, 302)

        self.login_admin()
        token = self.csrf_token(self.client.get("/municipality/locations"))
        response = self.client.post(
            "/municipality/locations",
            data={
                "csrf_token": token,
                "name": "Anna Nagar Junction",
                "location_type": "junction",
                "ward_or_zone": "Ward 12",
                "estimated_total_waste_kg_per_day": "250",
                "organic_waste_percentage": "65",
                "collection_frequency_days": "2",
                "latitude": "13.02",
                "longitude": "80.23",
            },
            follow_redirects=True,
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Anna Nagar Junction", response.data)

        location_page = self.client.get("/municipality/locations")
        self.assertIn(b"Anna Nagar Junction", location_page.data)
        self.assertIn(b'data-i18n="municipalityTitle"', location_page.data)
        self.assertIn(b"v=20261013-municipality-i18n-complete", location_page.data)

        search_response = self.client.get(
            "/municipality/locations?q=Anna+Nagar+Junction&status=Active"
        )
        self.assertEqual(search_response.status_code, 200)
        self.assertIn(b"Anna Nagar Junction", search_response.data)
        detail_match = re.search(
            rb'href="(/municipality/locations/\d+)"[^>]* data-i18n="detailAction"',
            search_response.data,
        )
        self.assertIsNotNone(detail_match)
        detail_response = self.client.get(detail_match.group(1).decode())
        self.assertEqual(detail_response.status_code, 200)
        self.assertIn(b'data-i18n="locationInformation"', detail_response.data)
        self.assertIn(b"Anna Nagar Junction", detail_response.data)

        translations = self.client.get("/static/js/ecoguard.js")
        self.assertIn("municipalityTitle: \"நகராட்சி மேலாண்மை\"".encode(), translations.data)
        self.assertIn("municipalityTitle: \"नगरपालिका प्रबंधन\"".encode(), translations.data)
        translations.close()

        simulation = self.client.post(
            "/api/simulate",
            json={"street": "Anna Nagar Junction", "waste": 250, "organic": 65, "delay": 2},
        )
        self.assertEqual(simulation.status_code, 200)
        self.assertEqual(simulation.json["risk_score"], 100)

        deactivate_page = self.client.get("/municipality/locations")
        deactivate_token = self.csrf_token(deactivate_page)
        location_id = int(detail_match.group(1).decode().rsplit("/", 1)[1])
        deactivated = self.client.post(
            f"/municipality/locations/{location_id}/deactivate",
            data={"csrf_token": deactivate_token},
            follow_redirects=True,
        )
        self.assertEqual(deactivated.status_code, 200)
        self.assertIn(b"Anna Nagar Junction has been deactivated", deactivated.data)

    def test_municipality_templates_have_translations_for_all_supported_languages(self):
        script = Path(self.app.static_folder, "js", "ecoguard.js").read_text(
            encoding="utf-8"
        )
        translation_start = script.index("const translations = {")
        locale_blocks = {}
        for language, next_language in (("en", "ta"), ("ta", "hi")):
            start = script.index(f"        {language}: {{", translation_start)
            end = script.index(f"\n        }},\n        {next_language}: {{", start)
            locale_blocks[language] = script[start:end]
        start = script.index("        hi: {", translation_start)
        end = script.index("\n        }\n    };", start)
        locale_blocks["hi"] = script[start:end]

        templates = "".join(
            Path(self.app.template_folder, name).read_text(encoding="utf-8")
            for name in ("base.html", "municipality_locations.html", "location_detail.html")
        )
        required_keys = set(
            re.findall(r'data-i18n(?:-[a-z]+)?="([A-Za-z][A-Za-z0-9]*)"', templates)
        )
        required_keys.update({
            "municipalityTitle",
            "municipalityDescription",
            "locationTypeJunction",
            "locationTypeStreet",
            "locationTypeWard",
            "locationTypeMarket",
            "locationTypeResidential",
            "locationTypeOther",
            "locationNameValidation",
            "locationTypeValidation",
            "wardRequiredValidation",
            "locationNumbersValidation",
            "wasteNegativeValidation",
            "organicRangeValidation",
            "collectionFrequencyValidation",
            "coordinatesNumericValidation",
            "coordinatesPairValidation",
            "coordinatesRangeValidation",
            "fillNumericValidation",
            "fillRangeValidation",
            "segregationNumericValidation",
            "segregationRangeValidation",
            "collectionDateValidation",
            "notesLengthValidation",
            "duplicateLocation",
            "locationAdded",
            "locationUpdated",
            "locationDeactivated",
            "locationDeactivateFailed",
        })
        for language, block in locale_blocks.items():
            with self.subTest(language=language):
                keys = set(
                    re.findall(
                        r"(?:^|,)\s*([A-Za-z][A-Za-z0-9]*):",
                        block,
                        re.MULTILINE,
                    )
                )
                self.assertEqual(required_keys - keys, set())

    def test_requested_default_credentials_open_municipality_management(self):
        app = create_app({
            "TESTING": True,
            "SECRET_KEY": "test-only-secret",
            "DATABASE": os.path.join(self.temp_dir.name, "default-admin.sqlite3"),
            "UPLOAD_FOLDER": os.path.join(self.temp_dir.name, "default-admin-uploads"),
        })
        client = app.test_client()
        login_page = client.get("/admin/login")
        token = self.csrf_token(login_page)

        login = client.post(
            "/admin/login",
            data={
                "csrf_token": token,
                "username": "123",
                "password": "123",
            },
        )
        self.assertEqual(login.status_code, 302)
        self.assertEqual(login.headers["Location"], "/admin")
        self.assertEqual(client.get("/municipality/locations").status_code, 200)

    def test_unauthenticated_citizen_cannot_change_status(self):
        complaint_id = self.complaint_id_from(self.submit())
        response = self.client.post(
            f"/admin/complaints/{complaint_id}/status",
            data={"status": "Resolved"},
        )
        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login", response.headers["Location"])
        self.assertEqual(get_complaint(self.database_path, complaint_id)["status"], "Pending")

    def test_admin_access_stays_disabled_without_environment_credentials(self):
        unconfigured_app = create_app({
            "TESTING": True,
            "SECRET_KEY": "test-only-secret",
            "DATABASE": os.path.join(self.temp_dir.name, "unconfigured.sqlite3"),
            "UPLOAD_FOLDER": os.path.join(self.temp_dir.name, "unconfigured-uploads"),
            "ADMIN_USERNAME": None,
            "ADMIN_PASSWORD": None,
        })
        response = unconfigured_app.test_client().get("/admin/login")
        self.assertEqual(response.status_code, 503)

    def test_authorised_admin_can_update_status_with_csrf_token(self):
        complaint_id = self.complaint_id_from(self.submit())
        self.assertEqual(self.login_admin().status_code, 302)
        admin_page = self.client.get("/admin")
        self.assertEqual(admin_page.status_code, 200)
        token = self.csrf_token(admin_page)

        response = self.client.post(
            f"/admin/complaints/{complaint_id}/status",
            data={"csrf_token": token, "status": "In Progress"},
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(
            get_complaint(self.database_path, complaint_id)["status"],
            "In Progress",
        )
        summary = get_complaint_summary(self.database_path)
        self.assertEqual(summary["pending"], 0)
        self.assertEqual(summary["resolved"], 0)

        token = self.csrf_token(self.client.get("/admin"))
        self.client.post(
            f"/admin/complaints/{complaint_id}/status",
            data={"csrf_token": token, "status": "Resolved"},
        )
        self.assertEqual(get_complaint_summary(self.database_path)["resolved"], 1)

    def test_admin_rejects_invalid_status_and_invalid_csrf(self):
        complaint_id = self.complaint_id_from(self.submit())
        self.login_admin()
        invalid_status = self.client.post(
            f"/admin/complaints/{complaint_id}/status",
            data={"csrf_token": self.csrf_token(self.client.get("/admin")), "status": "Closed"},
        )
        self.assertEqual(invalid_status.status_code, 400)

        invalid_csrf = self.client.post(
            f"/admin/complaints/{complaint_id}/status",
            data={"csrf_token": "wrong", "status": "Resolved"},
        )
        self.assertEqual(invalid_csrf.status_code, 400)
        self.assertEqual(get_complaint(self.database_path, complaint_id)["status"], "Pending")

    def test_existing_simulator_route_still_works(self):
        response = self.client.post(
            "/api/simulate",
            json={"street": "Anna Nagar", "waste": 85, "organic": 65, "delay": 2},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["risk_score"], 85)
        self.assertIn("not a measured methane", response.json["note"])


if __name__ == "__main__":
    unittest.main()
