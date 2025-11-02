import Link from "next/link";
import { mockCompany } from "@/lib/mock/datasource";

export default function Home() {
  return (
    <>
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-6 px-6"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          padding: "60px 24px",
          background: "linear-gradient(135deg, #f8fafc, #e2e8f0)"
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "520px" }}>
          <h1
            className="text-4xl font-semibold tracking-tight text-slate-900"
            style={{ fontSize: "42px", fontWeight: 600, color: "#0f172a", letterSpacing: "-0.03em" }}
          >
            InsightHub demo workspace
          </h1>
          <p
            className="mt-3 text-base text-slate-500"
            style={{ marginTop: "16px", fontSize: "16px", color: "#475569" }}
          >
            Explore the end-to-end dashboard experience powered by mocked APIs, members, and events for
            <span style={{ fontWeight: 600 }}> {mockCompany.name}</span>.
          </p>
        </div>
        <Link
          href={`/dashboard/${mockCompany.companyId}`}
          className="rounded-full bg-blue-600 px-6 py-3 text-white shadow-lg transition hover:bg-blue-500"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "9999px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "14px 28px",
            boxShadow: "0 15px 35px rgba(37, 99, 235, 0.35)",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.01em"
          }}
        >
          View dashboard
          <span aria-hidden="true" style={{ fontSize: "18px" }}>
            →
          </span>
        </Link>
      </main>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Insight iQ</h1>
          <p className="mt-4 text-gray-600">Explore insights and analytics for your members.</p>
          <Link
            href={`/dashboard/${mockCompany.companyId}`}
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
