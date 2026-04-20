"""Rioma Bakes backend API tests."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "http://localhost:8000").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# Root
def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"


# Products
class TestProducts:
    def test_list_products_seed(self, session):
        r = session.get(f"{API}/products")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 8
        # No _id leakage
        for p in data:
            assert "_id" not in p
            assert "id" in p and "name" in p and "category" in p

    def test_filter_featured(self, session):
        r = session.get(f"{API}/products", params={"featured": "true"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        assert all(p["featured"] is True for p in data)

    def test_filter_category(self, session):
        r = session.get(f"{API}/products", params={"category": "cakes"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        assert all(p["category"] == "cakes" for p in data)

    def test_get_single_product(self, session):
        r = session.get(f"{API}/products")
        pid = r.json()[0]["id"]
        r2 = session.get(f"{API}/products/{pid}")
        assert r2.status_code == 200
        assert r2.json()["id"] == pid

    def test_get_product_404(self, session):
        r = session.get(f"{API}/products/{uuid.uuid4()}")
        assert r.status_code == 404


# Orders
class TestOrders:
    def test_create_order(self, session):
        products = session.get(f"{API}/products").json()
        p = products[0]
        payload = {
            "customer_name": "TEST_Customer",
            "email": "test@example.com",
            "phone": "+91 9999999999",
            "address": "123 Test Lane",
            "city": "Mumbai",
            "notes": "ring bell",
            "items": [{
                "product_id": p["id"],
                "name": p["name"],
                "price": p["price"],
                "image_url": p["image_url"],
                "quantity": 2,
            }],
            "total": p["price"] * 2,
        }
        r = session.post(f"{API}/orders", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["customer_name"] == "TEST_Customer"
        assert data["total"] == p["price"] * 2
        assert "id" in data
        assert "_id" not in data
        assert data["status"] == "pending"

    def test_list_orders(self, session):
        r = session.get(f"{API}/orders")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        for o in data:
            assert "_id" not in o


# Custom orders
class TestCustomOrders:
    def test_create_custom_order_no_image(self, session):
        payload = {
            "customer_name": "TEST_BrideTBC",
            "email": "bride@example.com",
            "phone": "+91 9876543210",
            "occasion": "Wedding",
            "theme": "Pastel Floral",
            "flavour": "Vanilla & Raspberry",
            "servings": 120,
            "event_date": "2026-03-14",
            "budget": "1500",
            "description": "Three tier hand-painted cake",
        }
        r = session.post(f"{API}/custom-orders", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["occasion"] == "Wedding"
        assert data["status"] == "new"
        assert "_id" not in data

    def test_create_custom_order_with_image(self, session):
        tiny = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="
        payload = {
            "customer_name": "TEST_Birthday",
            "email": "bday@example.com",
            "phone": "+91 9876501234",
            "occasion": "Birthday",
            "theme": "Rainbow",
            "flavour": "Chocolate",
            "servings": 20,
            "event_date": "2026-02-10",
            "budget": "200",
            "description": "Rainbow tower",
            "reference_image": tiny,
        }
        r = session.post(f"{API}/custom-orders", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["reference_image"].startswith("data:image/")

    def test_list_custom_orders(self, session):
        r = session.get(f"{API}/custom-orders")
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# Contact
def test_contact_create(session):
    payload = {
        "name": "TEST_Visitor",
        "email": "visitor@example.com",
        "phone": "+91 9999988888",
        "subject": "Enquiry",
        "message": "Hi, do you deliver in Mumbai?",
    }
    r = session.post(f"{API}/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["subject"] == "Enquiry"
    assert "id" in data
    assert "_id" not in data


# Stats
def test_stats(session):
    r = session.get(f"{API}/stats")
    assert r.status_code == 200
    d = r.json()
    for k in ("orders_delivered", "happy_customers", "custom_creations", "years_baking"):
        assert k in d
        assert isinstance(d[k], int)


# Chat
def test_chat(session):
    payload = {"session_id": f"test-{uuid.uuid4()}", "message": "Hi! What cakes do you recommend for a birthday?"}
    r = session.post(f"{API}/chat", json=payload, timeout=60)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["session_id"] == payload["session_id"]
    assert isinstance(d["reply"], str)
    assert len(d["reply"]) > 0
