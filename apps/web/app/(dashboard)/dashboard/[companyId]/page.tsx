import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

type DashboardKpis = {
  companyId: string;
  activeUsers: number;
  new7d: number;
  churn30d: number;
  mrr: number;
  arpu: number;
  minutes: number;
  trend: number[];
};

type KpiFields = Pick<
  DashboardKpis,
  "activeUsers" | "new7d" | "churn30d" | "mrr" | "arpu" | "minutes"
>;

type KpiTile = {
  key: keyof KpiFields;
  label: string;
  format?: (value: number) => string;
};

// ---------- FORMATTERS ----------
const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const percentFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
const currencyWholeFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});
const currencyPreciseFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 1
});

// ---------- KPI TILES ----------
const KPI_TILES: KpiTile[] = [
  { key: "activeUsers", label: "Active users", format: (v) => numberFormatter.format(v) },
  { key: "new7d", label: "New last 7 days", format: (v) => numberFormatter.format(v) },
  { key: "churn30d", label: "30d churn rate", format: (v) => `${percentFormatter.format(v)}%` },
  { key: "mrr", label: "Monthly recurring revenue", format: (v) => currencyWholeFormatter.format(v) },
  { key: "arpu", label: "ARPU", format: (v) => currencyPreciseFormatter.format(v) },
  { key: "minutes", label: "Minutes streamed", format: (v) => numberFormatter.format(v) }
];

// ---------- DATA LOADER ----------
async function loadDashboardKpis(companyId: string): Promise<DashboardKpis> {
  const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const res = await fetch(`${baseUrl}/api/dashboard/${companyId}`, { cache: "no-store" });
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("Failed to load dashboard KPIs");
  }
  return res.json();
}

// ---------- STYLES ----------
const GRID_STYLE: CSSProperties = {
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
};

const CARD_STYLE: CSSProperties = {
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  background:
    "linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(226, 232, 240, 0.85))",
  padding: "20px",
  boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "12px"
};

const TREND_CARD_STYLE: CSSProperties = {
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  background:
    "linear-gradient(135deg, rgba(239, 246, 255, 0.9), rgba(219, 234, 254, 0.9))",
  padding: "24px",
  boxShadow: "0 16px 40px rgba(30, 64, 175, 0.18)",
  display: "flex",
  flexDirection: "column",
  gap: "20px"
};

// ---------- COMPONENT ----------
export default async function DashboardPage({
  params
}: {
  params: { companyId: string };
}) {
  const data = await loadDashboardKpis(params.companyId);

  const maxTrend = data.trend.length ? Math.max(...data.trend) : 0;
  const minTrend = data.trend.length ? Math.min(...data.trend) : 0;
  const firstTrend = data.trend[0] ?? 0;
  const lastTrend = data.trend[data.trend.length - 1] ?? 0;
  const trendDelta = lastTrend - firstTrend;
  const trendDeltaPercent =
    firstTrend === 0 ? 0 : (trendDelta / firstTrend) * 100;

  return (
    <main
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10"
      style={{
        margin: "0 auto",
        width: "100%",
        maxWidth: "1100px",
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "40px"
      }}
    >
      {/* ---------- HEADER ---------- */}
      <header
        className="space-y-3"
        style={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        <span
          className="text-sm font-medium uppercase tracking-wide text-slate-500"
          style={{
            fontSize: "12px",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#64748b"
          }}
        >
          Company overview
        </span>
        <h1
          className="text-3xl font-semibold tracking-tight text-slate-900"
          style={{
            fontSize: "32px",
            fontWeight: 600,
            color: "#0f172a",
            letterSpacing: "-0.03em"
          }}
        >
          Performance for {data.companyId}
        </h1>
        <p
          className="text-sm text-slate-500"
          style={{ fontSize: "15px", color: "#475569", maxWidth: "540px" }}
        >
          Live KPIs aggregated from the mock data source. Use these numbers to
          explore the dashboard experience and validate integrations.
        </p>
      </header>

      {/* ---------- KPI GRID ---------- */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" style={GRID_STYLE}>
          {KPI_TILES.map((tile) => {
            const value = data[tile.key];
            const formatted = tile.format
              ? tile.format(value)
              : numberFormatter.format(value);
            return (
              <div
                key={tile.key}
                className="rounded-xl border bg-white shadow-sm"
                style={CARD_STYLE}
              >
                <span
                  className="text-sm font-medium uppercase tracking-wide text-slate-500"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.22em",
                    color: "#64748b"
                  }}
                >
                  {tile.label}
                </span>
                <span
                  className="text-3xl font-semibold text-slate-900"
                  style={{ fontSize: "36px", fontWeight: 600, color: "#0f172a" }}
                >
                  {formatted}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- TREND SECTION ---------- */}
      <section
        className="space-y-4"
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div
          className="flex items-start justify-between gap-4"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "16px"
          }}
        >
          <div
            className="space-y-1"
            style={{ display: "flex", flexDirection: "column", gap: "6px" }}
          >
            <h2
              className="text-lg font-semibold tracking-tight text-slate-900"
              style={{ fontSize: "20px", fontWeight: 600, color: "#0f172a" }}
            >
              Active user trend
            </h2>
            <p
              className="text-sm text-slate-500"
              style={{ fontSize: "14px", color: "#475569", maxWidth: "480px" }}
            >
              Weekly active accounts over the past seven intervals with a simple
              sparkline approximation.
            </p>
          </div>
          <div className="text-right" style={{ textAlign: "right" }}>
            <div
              className="text-2xl font-semibold text-slate-900"
              style={{ fontSize: "28px", fontWeight: 600, color: "#0f172a" }}
            >
              {numberFormatter.format(lastTrend)}
            </div>
            <div
              className="text-sm"
              style={{
                fontSize: "13px",
                color: trendDelta >= 0 ? "#047857" : "#b91c1c"
              }}
            >
              {trendDelta >= 0 ? "▲" : "▼"}{" "}
              {percentFormatter.format(Math.abs(trendDeltaPercent))}% vs start
            </div>
          </div>
        </div>

        {/* ---------- SPARKLINE BAR CHART ---------- */}
        <div
          className="flex h-48 items-end gap-2 rounded-xl border bg-white shadow-sm"
          style={{
            ...TREND_CARD_STYLE,
            height: "240px"
          }}
          role="img"
          aria-label={`Weekly active users: ${data.trend.join(", ")}`}
        >
          <div
            className="flex flex-1 items-end gap-3"
            style={{
              display: "flex",
              flex: 1,
              alignItems: "flex-end",
              gap: "12px",
              height: "100%"
            }}
          >
            {data.trend.map((value, index) => {
              const heightPercent =
                maxTrend === 0 ? 0 : (value / maxTrend) * 100;
              return (
                <div
                  key={`${value}-${index}`}
                  className="flex-1 rounded-full bg-blue-500"
                  style={{
                    flex: 1,
                    minWidth: "12px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(180deg, rgba(59,130,246,0.9), rgba(37,99,235,0.85))",
                    height: `${Math.max(10, heightPercent)}%`
                  }}
                  aria-hidden="true"
                />
              );
            })}
          </div>
          <div
            className="flex flex-col justify-between text-xs text-slate-500"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#475569"
            }}
          >
            <span>High: {numberFormatter.format(maxTrend)}</span>
            <span>Low: {numberFormatter.format(minTrend)}</span>
          </div>
        </div>

        <div
          className="flex justify-between text-xs text-slate-400"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#94a3b8"
          }}
        >
          {data.trend.map((_, index) => (
            <span key={`label-${index}`}>W{index + 1}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
