type DashboardData = {
  kpis: {
    activeMembers: number;
    new7d: number;
    churn7d: number;
    mrr: number;
    arpu: number;
    minutes: number;
  };
  series: { date: string; active: number; revenue: number; engagement: number }[];
};

async function fetchDashboard(companyId: string): Promise<DashboardData> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/dashboard/${companyId}`, {
    cache: "no-store",
    headers: { "x-company-id": companyId }
  });
  if (!res.ok) throw new Error("Failed to load dashboard");
  return res.json();
}

export default async function DashboardPage({ params }: { params: { companyId: string } }) {
  const data = await fetchDashboard(params.companyId);
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard — {params.companyId}</h1>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div>Active: {data.kpis.activeMembers}</div>
        <div>New 7d: {data.kpis.new7d}</div>
        <div>Churn 7d: {data.kpis.churn7d}</div>
        <div>MRR: ${data.kpis.mrr.toFixed(2)}</div>
        <div>ARPU: ${data.kpis.arpu.toFixed(2)}</div>
        <div>Minutes: {data.kpis.minutes}</div>
      </section>
      <section style={{ marginTop: 24 }}>
        <h2>Time series (sample)</h2>
        <ul>
          {data.series.slice(0, 7).map((p) => (
            <li key={p.date}>{p.date}: active {p.active}, revenue {p.revenue}, engagement {p.engagement}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}


