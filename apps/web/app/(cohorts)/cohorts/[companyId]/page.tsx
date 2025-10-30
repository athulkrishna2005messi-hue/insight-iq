type Cohort = { cohortId: string; name: string; createdAt: string };

async function fetchCohorts(companyId: string): Promise<{ items: Cohort[] }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/cohorts/${companyId}`, { cache: "no-store", headers: { "x-company-id": companyId } });
  if (!res.ok) throw new Error("Failed to load cohorts");
  return res.json();
}

export default async function CohortsPage({ params }: { params: { companyId: string } }) {
  const data = await fetchCohorts(params.companyId);
  return (
    <main style={{ padding: 24 }}>
      <h1>Cohorts — {params.companyId}</h1>
      <form action={`/api/cohorts/${params.companyId}`} method="post" style={{ margin: "12px 0" }}>
        <input name="name" placeholder="New cohort name" required />
        <input name="filterDefinition" placeholder='{"joinDateGte":"2024-01-01"}' style={{ marginLeft: 8, width: 360 }} />
        <button type="submit" style={{ marginLeft: 8 }}>Create</button>
      </form>
      <ul>
        {data.items.map((c) => (
          <li key={c.cohortId}>{c.name} — {new Date(c.createdAt).toLocaleString()}</li>
        ))}
      </ul>
    </main>
  );
}


