type Member = {
  memberId: string;
  email: string;
  displayName: string;
  riskScore: number;
};

async function fetchMembers(companyId: string, q?: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const url = new URL(`${baseUrl}/api/members/${companyId}`);
  if (q) url.searchParams.set("q", q);
  const res = await fetch(url, { cache: "no-store", headers: { "x-company-id": companyId } });
  if (!res.ok) throw new Error("Failed to load members");
  return res.json() as Promise<{ items: Member[]; total: number }>;
}

async function fetchSettings(companyId: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/settings/${companyId}`, { cache: "no-store", headers: { "x-company-id": companyId } });
  if (!res.ok) return { anonymize: false } as { anonymize: boolean };
  return res.json() as Promise<{ anonymize: boolean }>;
}

export default async function MembersPage({ searchParams, params }: { searchParams?: { q?: string }; params: { companyId: string } }) {
  const q = searchParams?.q;
  const [data, settings] = await Promise.all([fetchMembers(params.companyId, q), fetchSettings(params.companyId)]);
  return (
    <main style={{ padding: 24 }}>
      <h1>Members — {params.companyId}</h1>
      <form method="get" style={{ margin: "12px 0" }}>
        <input name="q" defaultValue={q} placeholder="Search members" />
        <button type="submit" style={{ marginLeft: 8 }}>Search</button>
      </form>
      <ul>
        {data.items.map((m) => {
          const displayName = settings.anonymize ? `${m.displayName[0]}***` : m.displayName;
          const email = settings.anonymize ? "***@***" : m.email;
          return (
            <li key={m.memberId}>
              <a href={`/members/${params.companyId}/${m.memberId}`}>{displayName}</a> — {email} — risk {m.riskScore.toFixed(2)}
            </li>
          );
        })}
      </ul>
    </main>
  );
}


