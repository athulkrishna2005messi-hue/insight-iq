type ScoreItem = { memberId: string; features: Record<string, number> };

function getMlBaseUrl() {
  return process.env.ML_BASE_URL || "http://localhost:8000";
}

export async function scoreRisk(items: ScoreItem[]) {
  const res = await fetch(`${getMlBaseUrl()}/score`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ items })
  });
  if (!res.ok) throw new Error("ML score failed");
  return (await res.json()) as Array<{ memberId: string; riskScore: number; reasons: string[] }>;
}


