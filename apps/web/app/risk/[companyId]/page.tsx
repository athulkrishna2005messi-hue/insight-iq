type RiskItem = { memberId: string; displayName: string; email: string; riskScore: number; reasons: string[] };

async function fetchRisk(companyId: string): Promise<{ items: RiskItem[]; fallback?: boolean }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/risk/${companyId}`, { cache: "no-store", headers: { "x-company-id": companyId } });
  if (!res.ok) throw new Error("Failed to load risk list");
  return res.json();
}

async function fetchSettings(companyId: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/settings/${companyId}`, { cache: "no-store", headers: { "x-company-id": companyId } });
  if (!res.ok) return { anonymize: false } as { anonymize: boolean };
  return res.json() as Promise<{ anonymize: boolean }>;
}

export default async function RiskPage({ params }: { params: { companyId: string } }) {
  const [data, settings] = await Promise.all([fetchRisk(params.companyId), fetchSettings(params.companyId)]);
  return (
    <main style={{ padding: 24 }}>
      <h1>At-risk members — {params.companyId}</h1>
      {data.fallback ? <p style={{ color: '#a67c00' }}>ML service unavailable — using heuristic fallback</p> : null}
      <ol>
        {data.items.slice(0, 50).map((m) => {
          const displayName = settings.anonymize ? `${m.displayName[0]}***` : m.displayName;
          const email = settings.anonymize ? "***@***" : m.email;
          return (
            <li key={m.memberId}>
              <a href={`/members/${params.companyId}/${m.memberId}`}>{displayName}</a> — {email} — risk {m.riskScore.toFixed(3)}
              {m.reasons?.length ? <span> — reasons: {m.reasons.join(', ')}</span> : null}
            </li>
          );
        })}
      </ol>
    </main>
  );
}


