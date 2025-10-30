type Member = {
  memberId: string;
  companyId: string;
  email: string;
  displayName: string;
  joinDate: string;
  lastActiveAt: string;
  lifetimeValue: number;
  planIds: string[];
  engagementScore: number;
  riskScore: number;
};

async function fetchMember(companyId: string, memberId: string): Promise<Member> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/members/${companyId}/${memberId}`, {
    cache: "no-store",
    headers: { "x-company-id": companyId }
  });
  if (res.status === 404) throw new Error("Not Found");
  if (!res.ok) throw new Error("Failed to load member");
  return res.json();
}

export default async function MemberDetail({ params }: { params: { companyId: string; memberId: string } }) {
  const m = await fetchMember(params.companyId, params.memberId);
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const eventsRes = await fetch(`${baseUrl}/api/members/${params.companyId}/${params.memberId}/events`, {
    cache: "no-store",
    headers: { "x-company-id": params.companyId }
  });
  const events = eventsRes.ok ? ((await eventsRes.json()) as { items: Array<{ type: string; occurredAt: string; metadata: any }> }).items : [];
  const settingsRes = await fetch(`${baseUrl}/api/settings/${params.companyId}`, { cache: "no-store", headers: { "x-company-id": params.companyId } });
  const settings = settingsRes.ok ? ((await settingsRes.json()) as { anonymize: boolean }) : { anonymize: false };
  const displayName = settings.anonymize ? `${m.displayName[0]}***` : m.displayName;
  const email = settings.anonymize ? "***@***" : m.email;
  return (
    <main style={{ padding: 24 }}>
      <h1>{displayName}</h1>
      <p>{email}</p>
      <p>Joined: {new Date(m.joinDate).toLocaleDateString()}</p>
      <p>Last active: {new Date(m.lastActiveAt).toLocaleString()}</p>
      <p>Plans: {m.planIds.join(", ")}</p>
      <p>Lifetime value: ${m.lifetimeValue.toFixed(2)}</p>
      <p>Engagement: {m.engagementScore.toFixed(2)}</p>
      <p>Risk: {m.riskScore.toFixed(2)}</p>
      <section style={{ marginTop: 24 }}>
        <h2>Recent events</h2>
        {events.length === 0 ? (
          <p>No recent events</p>
        ) : (
          <ul>
            {events.map((e, idx) => (
              <li key={idx}>{new Date(e.occurredAt).toLocaleString()} — {e.type}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}


