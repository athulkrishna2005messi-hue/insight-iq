type Alert = { alertId: string; ruleDefinition: any; lastTriggeredAt: string | null };

async function fetchAlerts(companyId: string): Promise<{ items: Alert[] }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/alerts/${companyId}`, { cache: "no-store", headers: { "x-company-id": companyId, "x-role": "admin" } });
  if (!res.ok) throw new Error("Failed to load alerts");
  return res.json();
}

export default async function AlertsPage({ params }: { params: { companyId: string } }) {
  const data = await fetchAlerts(params.companyId);
  return (
    <main style={{ padding: 24 }}>
      <h1>Alerts — {params.companyId}</h1>
      <form action={`/api/alerts/${params.companyId}`} method="post" style={{ margin: "12px 0" }}>
        <input name="ruleDefinition" defaultValue='{"type":"risk_gt","threshold":0.7}' style={{ width: 380 }} />
        <button type="submit" style={{ marginLeft: 8 }}>Create Alert</button>
      </form>
      <form action={`/api/alerts/${params.companyId}/trigger`} method="post" style={{ margin: "12px 0" }}>
        <button type="submit">Test Trigger</button>
      </form>
      <ul>
        {data.items.map((a) => (
          <li key={a.alertId}>rule: {JSON.stringify(a.ruleDefinition)} — last: {a.lastTriggeredAt ?? "never"}</li>
        ))}
      </ul>
    </main>
  );
}


