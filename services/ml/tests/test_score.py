from fastapi.testclient import TestClient
from services.ml.main import app


def test_health():
    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_score_endpoint():
    client = TestClient(app)
    payload = {
        "items": [
            {"memberId": "m1", "features": {"lastActiveDaysAgo": 2, "engagementScore": 0.4, "lifetimeValue": 120}},
            {"memberId": "m2", "features": {"lastActiveDaysAgo": 20, "engagementScore": 0.1, "lifetimeValue": 50}},
        ]
    }
    r = client.post("/score", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 2
    assert "riskScore" in data[0]


