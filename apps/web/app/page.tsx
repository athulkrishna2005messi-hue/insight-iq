import Link from "next/link";

export default function Home() {
  const exampleCompanyId = "demo-company";
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to Insight iQ</h1>
        <p className="mt-4 text-gray-600">Explore insights and analytics for your members.</p>
        <Link
          href={`/dashboard/${exampleCompanyId}`}
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
