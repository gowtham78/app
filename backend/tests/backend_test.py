"""
Backend API tests for Suntek Designs.
Covers: root health, enquiries POST validation, honeypot, persistence,
and GET /api/enquiries listing.
"""
import os
import re
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
# Fallback: read from frontend .env if env var not passed in
if not BASE_URL:
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL"):
                    BASE_URL = line.strip().split("=", 1)[1].strip().rstrip("/")
                    break
    except Exception:
        pass

API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- health ----------
class TestHealth:
    def test_root_health(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert "message" in data
        assert isinstance(data["message"], str) and len(data["message"]) > 0


# ---------- enquiries ----------
def _valid_payload(suffix=""):
    return {
        "full_name": f"TEST_User{suffix}",
        "email": f"test_user{suffix}@example.com",
        "phone": "+65 9123 4567",
        "property_type": "HDB",
        "project_type": "New Renovation",
        "estimated_budget": "S$40,001 – 60,000",
        "preferred_start_date": "2026-03-01",
        "message": "This is a TEST enquiry submitted by pytest.",
    }


class TestEnquiries:
    def test_create_valid_enquiry_persists(self, api_client):
        # count before
        r_before = api_client.get(f"{API}/enquiries")
        assert r_before.status_code == 200
        before_ids = {e["id"] for e in r_before.json()}

        payload = _valid_payload("_valid1")
        r = api_client.post(f"{API}/enquiries", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("success") is True
        assert isinstance(data.get("id"), str) and len(data["id"]) > 0
        assert "message" in data
        assert "email_sent" in data
        new_id = data["id"]

        # persistence via GET
        r_after = api_client.get(f"{API}/enquiries")
        assert r_after.status_code == 200
        rows = r_after.json()
        matched = [e for e in rows if e["id"] == new_id]
        assert len(matched) == 1, "Enquiry was not persisted"
        e = matched[0]
        assert e["full_name"] == payload["full_name"]
        assert e["email"] == payload["email"]
        assert e["phone"] == payload["phone"]
        assert e["property_type"] == payload["property_type"]
        assert new_id not in before_ids

    def test_invalid_email_422(self, api_client):
        p = _valid_payload("_bademail")
        p["email"] = "not-an-email"
        r = api_client.post(f"{API}/enquiries", json=p)
        assert r.status_code == 422, r.text

    def test_missing_full_name_422(self, api_client):
        p = _valid_payload("_noname")
        p.pop("full_name")
        r = api_client.post(f"{API}/enquiries", json=p)
        assert r.status_code == 422, r.text

    def test_invalid_phone_422(self, api_client):
        p = _valid_payload("_badphone")
        p["phone"] = "abc"
        r = api_client.post(f"{API}/enquiries", json=p)
        assert r.status_code == 422, r.text

    def test_honeypot_silently_dropped(self, api_client):
        r_before = api_client.get(f"{API}/enquiries")
        assert r_before.status_code == 200
        count_before = len(r_before.json())

        p = _valid_payload("_spam")
        p["website"] = "http://spam.example"
        r = api_client.post(f"{API}/enquiries", json=p)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("success") is True
        # Should NOT return an id (silent drop); code returns just success+message
        assert "id" not in data or not data.get("id")

        r_after = api_client.get(f"{API}/enquiries")
        assert r_after.status_code == 200
        count_after = len(r_after.json())
        assert count_after == count_before, "Honeypot enquiry was persisted!"

    def test_email_delivery_flag_present(self, api_client):
        """Enquiry must persist regardless of Resend outcome; email_sent flag reported."""
        p = _valid_payload("_email")
        r = api_client.post(f"{API}/enquiries", json=p)
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data.get("email_sent"), bool)
        # Persisted regardless
        rows = api_client.get(f"{API}/enquiries").json()
        assert any(e["id"] == data["id"] for e in rows)

    def test_get_enquiries_shape(self, api_client):
        r = api_client.get(f"{API}/enquiries")
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        if rows:
            e = rows[0]
            for k in ("id", "full_name", "email", "phone", "created_at"):
                assert k in e, f"Missing key {k}"
            assert "_id" not in e  # Mongo ObjectId must be excluded
