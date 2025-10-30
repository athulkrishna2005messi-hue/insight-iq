async function fetchSettings(companyId: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/settings/${companyId}`, { cache: "no-store", headers: { "x-company-id": companyId, "x-role": "admin" } });
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json() as Promise<{ anonymize: boolean }>;
}


export default async function SettingsPage({ params }: { params: { companyId: string } }) {
  const s = await fetchSettings(params.companyId);
  return (
    <main style={{ padding: 24 }}>
      <h1>Settings — {params.companyId}</h1>
      <form
        action={`/api/settings/${params.companyId}`}
        method="post"
        style={{ marginTop: 12 }}
      >
        <label>
          <input type="checkbox" name="anonymize" defaultChecked={s.anonymize} />
          <span style={{ marginLeft: 8 }}>Anonymize member identities</span>
        </label>
        <button type="submit" style={{ marginLeft: 12 }}>Save</button>
      </form>
    </main>
  );
}


