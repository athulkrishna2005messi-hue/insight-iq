from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
import math

app = FastAPI(title="InsightHub ML Service")


@app.get("/health")
def health():
    return {"status": "ok"}


class ScoreItem(BaseModel):
    memberId: str
    features: Dict[str, float]


class ScoreRequest(BaseModel):
    items: List[ScoreItem]


@app.post("/score")
def score(req: ScoreRequest):
    results: List[Dict[str, Any]] = []
    # Simple logistic on a few normalized features as a placeholder
    for item in req.items:
        f = item.features
        last_active_days = f.get("lastActiveDaysAgo", 0.0)
        engagement = f.get("engagementScore", 0.0)
        ltv = f.get("lifetimeValue", 0.0)
        # weights chosen arbitrarily for demo
        z = 0.5 * (last_active_days / 30.0) - 1.2 * engagement - 0.3 * (ltv / 500.0)
        risk = 1.0 / (1.0 + math.exp(-z))
        # reasons based on signed contributions
        reasons = []
        if last_active_days > 7:
            reasons.append("inactive_recently")
        if engagement < 0.3:
            reasons.append("low_engagement")
        if ltv < 100:
            reasons.append("low_ltv")
        results.append({"memberId": item.memberId, "riskScore": float(risk), "reasons": reasons[:3]})
    return results


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


