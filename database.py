import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path


@contextmanager
def connection(database_path):
    database_path = Path(database_path)
    database_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(database_path), timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db(database_path):
    with connection(database_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS complaints (
                complaint_id TEXT PRIMARY KEY,
                citizen_name TEXT NOT NULL,
                street TEXT NOT NULL,
                category TEXT NOT NULL,
                description TEXT NOT NULL,
                photo_filename TEXT,
                status TEXT NOT NULL DEFAULT 'Pending'
                    CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
                submitted_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_complaints_submitted_at
            ON complaints (submitted_at DESC)
            """
        )
        conn.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_complaints_street
            ON complaints (street COLLATE NOCASE)
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS notifications (
                notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_type TEXT NOT NULL,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                related_complaint_id TEXT,
                related_zone TEXT,
                notification_level TEXT NOT NULL DEFAULT 'info'
                    CHECK (notification_level IN ('info', 'warning', 'urgent')),
                recipient TEXT NOT NULL DEFAULT 'admin',
                is_read INTEGER NOT NULL DEFAULT 0,
                event_key TEXT UNIQUE,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_notifications_unread
            ON notifications (is_read, created_at DESC)
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS locations (
                location_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                location_name TEXT,
                location_type TEXT NOT NULL DEFAULT 'junction',
                type TEXT,
                ward_or_zone TEXT,
                ward TEXT,
                zone TEXT,
                estimated_total_waste_kg_per_day REAL NOT NULL DEFAULT 0,
                organic_waste_percentage REAL NOT NULL DEFAULT 0,
                collection_frequency_days INTEGER NOT NULL DEFAULT 1,
                latitude REAL,
                longitude REAL,
                last_collection_at TEXT,
                last_collection_date TEXT,
                fill_level_percentage REAL,
                overflow_history TEXT,
                segregation_efficiency_percentage REAL,
                is_active INTEGER NOT NULL DEFAULT 1,
                status TEXT NOT NULL DEFAULT 'Active'
                    CHECK (status IN ('Active', 'Inactive')),
                notes TEXT,
                data_source TEXT NOT NULL DEFAULT 'demo',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE UNIQUE INDEX IF NOT EXISTS idx_locations_name_unique
            ON locations (LOWER(name))
            """
        )
        conn.execute(
            """
            CREATE INDEX IF NOT EXISTS idx_locations_active
            ON locations (is_active, status, name COLLATE NOCASE)
            """
        )


def seed_default_locations(database_path):
    default_locations = [
        {
            "name": "Anna Nagar",
            "location_type": "junction",
            "ward_or_zone": "Ward 12",
            "estimated_total_waste_kg_per_day": 85,
            "organic_waste_percentage": 65,
            "collection_frequency_days": 2,
            "latitude": 13.0856,
            "longitude": 80.2107,
            "last_collection_at": "2026-10-08T08:30:00+00:00",
            "fill_level_percentage": 68,
            "segregation_efficiency_percentage": 60,
            "status": "Active",
            "is_active": 1,
            "data_source": "demo",
            "notes": "Sample municipal location seeded for demonstration.",
        },
        {
            "name": "Market Road",
            "location_type": "market",
            "ward_or_zone": "Ward 5",
            "estimated_total_waste_kg_per_day": 120,
            "organic_waste_percentage": 75,
            "collection_frequency_days": 3,
            "latitude": 13.0904,
            "longitude": 80.2307,
            "last_collection_at": "2026-09-30T06:00:00+00:00",
            "fill_level_percentage": 82,
            "segregation_efficiency_percentage": 55,
            "status": "Active",
            "is_active": 1,
            "data_source": "demo",
            "notes": "Commercial street with high organic load.",
        },
        {
            "name": "Lake View Street",
            "location_type": "street",
            "ward_or_zone": "Ward 8",
            "estimated_total_waste_kg_per_day": 40,
            "organic_waste_percentage": 25,
            "collection_frequency_days": 1,
            "latitude": 13.0672,
            "longitude": 80.2495,
            "last_collection_at": "2026-10-12T07:15:00+00:00",
            "fill_level_percentage": 32,
            "segregation_efficiency_percentage": 70,
            "status": "Active",
            "is_active": 1,
            "data_source": "demo",
            "notes": "Lower-risk residential route.",
        },
        {
            "name": "Temple Road",
            "location_type": "street",
            "ward_or_zone": "Ward 4",
            "estimated_total_waste_kg_per_day": 95,
            "organic_waste_percentage": 60,
            "collection_frequency_days": 1,
            "latitude": 13.0782,
            "longitude": 80.2571,
            "last_collection_at": "2026-10-04T09:00:00+00:00",
            "fill_level_percentage": 74,
            "segregation_efficiency_percentage": 62,
            "status": "Active",
            "is_active": 1,
            "data_source": "demo",
            "notes": "Religious district with seasonal surges.",
        },
    ]
    with connection(database_path) as conn:
        for record in default_locations:
            timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
            row = conn.execute(
                """
                SELECT location_id FROM locations WHERE LOWER(name) = LOWER(?)
                """,
                (record["name"],),
            ).fetchone()
            if row is not None:
                continue
            conn.execute(
                """
                INSERT INTO locations (
                    name, location_name, location_type, type, ward_or_zone, ward, zone,
                    estimated_total_waste_kg_per_day, organic_waste_percentage,
                    collection_frequency_days, latitude, longitude, last_collection_at,
                    last_collection_date, fill_level_percentage, overflow_history,
                    segregation_efficiency_percentage, is_active, status, notes,
                    data_source, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    record["name"],
                    record["name"],
                    record["location_type"],
                    record["location_type"],
                    record["ward_or_zone"],
                    record["ward_or_zone"],
                    record["ward_or_zone"],
                    record["estimated_total_waste_kg_per_day"],
                    record["organic_waste_percentage"],
                    record["collection_frequency_days"],
                    record.get("latitude"),
                    record.get("longitude"),
                    record.get("last_collection_at"),
                    record.get("last_collection_at"),
                    record.get("fill_level_percentage"),
                    None,
                    record.get("segregation_efficiency_percentage"),
                    record.get("is_active", 1),
                    record.get("status", "Active"),
                    record.get("notes"),
                    record.get("data_source", "demo"),
                    timestamp,
                    timestamp,
                ),
            )
    return True


def insert_location(
    database_path,
    name,
    location_type,
    ward_or_zone,
    estimated_total_waste_kg_per_day,
    organic_waste_percentage,
    collection_frequency_days,
    latitude=None,
    longitude=None,
    last_collection_at=None,
    fill_level_percentage=None,
    overflow_history=None,
    segregation_efficiency_percentage=None,
    is_active=True,
    notes=None,
    data_source="municipality",
):
    location_name = (name or "").strip()
    if not location_name:
        raise ValueError("Location name is required.")
    timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with connection(database_path) as conn:
        existing = conn.execute(
            "SELECT location_id FROM locations WHERE LOWER(name) = LOWER(?)",
            (location_name,),
        ).fetchone()
        if existing is not None:
            raise ValueError(f"A location similar to '{location_name}' already exists.")
        cursor = conn.execute(
            """
            INSERT INTO locations (
                name, location_name, location_type, type, ward_or_zone, ward, zone,
                estimated_total_waste_kg_per_day, organic_waste_percentage,
                collection_frequency_days, latitude, longitude, last_collection_at,
                last_collection_date, fill_level_percentage, overflow_history,
                segregation_efficiency_percentage, is_active, status,
                notes, data_source, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                location_name,
                location_name,
                location_type,
                location_type,
                ward_or_zone,
                ward_or_zone,
                ward_or_zone,
                estimated_total_waste_kg_per_day,
                organic_waste_percentage,
                collection_frequency_days,
                latitude,
                longitude,
                last_collection_at,
                last_collection_at,
                fill_level_percentage,
                overflow_history,
                segregation_efficiency_percentage,
                1 if is_active else 0,
                "Active" if is_active else "Inactive",
                notes,
                data_source,
                timestamp,
                timestamp,
            ),
        )
    return cursor.lastrowid


def get_locations(database_path, include_inactive=False, limit=None, search=None):
    with connection(database_path) as conn:
        query = "SELECT * FROM locations"
        params = []
        where_clauses = []
        if not include_inactive:
            where_clauses.append("is_active = 1")
        if search:
            where_clauses.append("LOWER(name) LIKE LOWER(?)")
            params.append(f"%{search}%")
        if where_clauses:
            query += " WHERE " + " AND ".join(where_clauses)
        query += " ORDER BY name COLLATE NOCASE"
        if limit is not None:
            query += " LIMIT ?"
            params.append(limit)
        rows = conn.execute(query, params).fetchall()
    return [dict(row) for row in rows]


def get_location(database_path, location_id):
    with connection(database_path) as conn:
        row = conn.execute("SELECT * FROM locations WHERE location_id = ?", (location_id,)).fetchone()
    return dict(row) if row else None


def get_location_summary(database_path):
    with connection(database_path) as conn:
        row = conn.execute(
            """
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(is_active = 1), 0) AS active,
                COALESCE(SUM(CASE WHEN estimated_total_waste_kg_per_day >= 100 OR organic_waste_percentage >= 60 THEN 1 ELSE 0 END), 0) AS high_risk,
                COALESCE(SUM(CASE WHEN collection_frequency_days >= 2 OR fill_level_percentage >= 70 THEN 1 ELSE 0 END), 0) AS needs_attention
            FROM locations
            """
        ).fetchone()
    return dict(row)


def update_location(database_path, location_id, **kwargs):
    updates = []
    params = []
    for field, value in kwargs.items():
        if value is None:
            continue
        updates.append(f"{field} = ?")
        params.append(value)
    if not updates:
        return False
    params.extend([
        datetime.now(timezone.utc).isoformat(timespec="seconds"),
        location_id,
    ])
    with connection(database_path) as conn:
        cursor = conn.execute(
            f"UPDATE locations SET {', '.join(updates)}, updated_at = ? WHERE location_id = ?",
            params,
        )
    return cursor.rowcount == 1


def deactivate_location(database_path, location_id):
    with connection(database_path) as conn:
        cursor = conn.execute(
            "UPDATE locations SET is_active = 0, status = 'Inactive', updated_at = ? WHERE location_id = ?",
            (datetime.now(timezone.utc).isoformat(timespec="seconds"), location_id),
        )
    return cursor.rowcount == 1


def insert_notification(
    database_path,
    event_type,
    title,
    message,
    related_complaint_id=None,
    related_zone=None,
    notification_level="info",
    recipient="admin",
    event_key=None,
):
    created_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with connection(database_path) as conn:
        conn.execute(
            """
            INSERT INTO notifications (
                event_type, title, message, related_complaint_id, related_zone,
                notification_level, recipient, is_read, event_key, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
            ON CONFLICT(event_key) DO UPDATE SET
                title = excluded.title,
                message = excluded.message,
                related_complaint_id = excluded.related_complaint_id,
                related_zone = excluded.related_zone,
                notification_level = excluded.notification_level,
                recipient = excluded.recipient,
                created_at = excluded.created_at,
                is_read = 0
            """,
            (
                event_type,
                title,
                message,
                related_complaint_id,
                related_zone,
                notification_level,
                recipient,
                event_key or f"{event_type}:{related_zone or 'all'}:{related_complaint_id or 'none'}",
                created_at,
            ),
        )
    return True


def get_notifications(database_path, limit=10, unread_only=False):
    with connection(database_path) as conn:
        query = """
            SELECT notification_id, event_type, title, message,
                   related_complaint_id, related_zone, notification_level,
                   recipient, is_read, created_at
            FROM notifications
        """
        params = []
        if unread_only:
            query += " WHERE is_read = 0"
        query += " ORDER BY created_at DESC, notification_id DESC"
        if limit is not None:
            query += " LIMIT ?"
            params.append(limit)
        rows = conn.execute(query, params).fetchall()
    return [dict(row) for row in rows]


def get_notification_summary(database_path):
    with connection(database_path) as conn:
        row = conn.execute(
            """
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(is_read = 0), 0) AS unread
            FROM notifications
            """
        ).fetchone()
    return dict(row)


def mark_notification_read(database_path, notification_id):
    with connection(database_path) as conn:
        cursor = conn.execute(
            "UPDATE notifications SET is_read = 1 WHERE notification_id = ?",
            (notification_id,),
        )
    return cursor.rowcount == 1


def mark_all_notifications_read(database_path, recipient="admin"):
    with connection(database_path) as conn:
        cursor = conn.execute(
            "UPDATE notifications SET is_read = 1 WHERE recipient = ?",
            (recipient,),
        )
    return cursor.rowcount


def insert_complaint(
    database_path,
    complaint_id,
    citizen_name,
    street,
    category,
    description,
    photo_filename=None,
):
    submitted_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    with connection(database_path) as conn:
        conn.execute(
            """
            INSERT INTO complaints (
                complaint_id, citizen_name, street, category, description,
                photo_filename, submitted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                complaint_id,
                citizen_name,
                street,
                category,
                description,
                photo_filename,
                submitted_at,
            ),
        )
    return complaint_id


def get_complaint(database_path, complaint_id):
    with connection(database_path) as conn:
        row = conn.execute(
            "SELECT * FROM complaints WHERE complaint_id = ?",
            (complaint_id,),
        ).fetchone()
    return dict(row) if row else None


def get_complaints(database_path, limit=10):
    with connection(database_path) as conn:
        query = """
            SELECT complaint_id, citizen_name, street, category, description,
                   photo_filename, status, submitted_at
            FROM complaints
            ORDER BY submitted_at DESC, complaint_id DESC
        """
        if limit is not None:
            query += " LIMIT ?"
            rows = conn.execute(query, (limit,)).fetchall()
        else:
            rows = conn.execute(query).fetchall()
    return [dict(row) for row in rows]


def get_complaint_summary(database_path):
    with connection(database_path) as conn:
        row = conn.execute(
            """
            SELECT
                COUNT(*) AS total,
                COALESCE(SUM(status = 'Pending'), 0) AS pending,
                COALESCE(SUM(status = 'Resolved'), 0) AS resolved
            FROM complaints
            """
        ).fetchone()
    return dict(row)


def get_recurring_complaints(database_path):
    with connection(database_path) as conn:
        rows = conn.execute(
            """
            SELECT street, COUNT(*) AS complaint_count
            FROM complaints
            GROUP BY street COLLATE NOCASE
            HAVING COUNT(*) >= 2
            ORDER BY complaint_count DESC, street COLLATE NOCASE
            """
        ).fetchall()
    return [dict(row) for row in rows]


def update_complaint_status(database_path, complaint_id, status):
    with connection(database_path) as conn:
        cursor = conn.execute(
            "UPDATE complaints SET status = ? WHERE complaint_id = ?",
            (status, complaint_id),
        )
    return cursor.rowcount == 1