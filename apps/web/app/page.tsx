import Link from "next/link";

export default function Home() {
  const exampleCompanyId = "demo-company";
  return (
    <main style={{ padding: 24 }}>
      <h1>InsightHub</h1>
      <p>Welcome. Jump to dashboard for a demo company.</p>
      <Link href={`/dashboard/${exampleCompanyId}`}>Go to Dashboard</Link>
    </main>
  );
}


