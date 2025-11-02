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
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/dashboard/${companyId}`, { cache: "no-store" });
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("Failed to load dashboard KPIs");
  }
  return res.json();
}

// ---------- COMPONENT ----------
export default async function DashboardPage({
  params
}: {
  params: { companyId: string };
}) {
  const data = await loadDashboardKpis(params.companyId);

  const getTrendStats = (trend: number[]) => {
    if (!trend.length) {
      return { max: 0, min: 0, first: 0, last: 0, delta: 0, deltaPercent: 0 };
    }
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const first = trend[0] ?? 0;
    const last = trend[trend.length - 1] ?? 0;
    const delta = last - first;
    const deltaPercent = first !== 0 ? (delta / first) * 100 : 0;
    return { max, min, first, last, delta, deltaPercent };
  };

  const trendStats = getTrendStats(data.trend);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      {/* ---------- HEADER ---------- */}
      <header className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.32em] text-slate-500">
          Company overview
        </span>
        <h1 className="text-3xl font-semibold tracking-tighter text-slate-900">
          Performance for {data.companyId}
        </h1>
        <p className="max-w-xl text-sm text-slate-600">
          Live KPIs aggregated from the mock data source. Use these numbers to
          explore the dashboard experience and validate integrations.
        </p>
      </header>

      {/* ---------- KPI GRID ---------- */}
      <section>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {KPI_TILES.map((tile) => {
            const value = data[tile.key];
            const formatted = tile.format
              ? tile.format(value)
              : numberFormatter.format(value);
            return (
              <div
                key={tile.key}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-300/20 bg-gradient-to-br from-slate-50/95 to-slate-200/85 p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {tile.label}
                </span>
                <span className="text-4xl font-semibold text-slate-900">
                  {formatted}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- TREND SECTION ---------- */}
      <section className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Active user trend
            </h2>
            <p className="max-w-md text-sm text-slate-600">
              Weekly active accounts over the past seven intervals with a simple
              sparkline approximation.
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-semibold text-slate-900">{numberFormatter.format(trendStats.last)}</div>
            <div
              className={`text-sm ${trendStats.delta >= 0 ? "text-emerald-700" : "text-red-700"}`}
            >
              {trendStats.delta >= 0 ? "▲" : "▼"}{" "}
              {percentFormatter.format(Math.abs(trendStats.deltaPercent))}% vs start
            </div>
          </div>
        </div>

        {/* ---------- SPARKLINE BAR CHART ---------- */}
        <div
          className="flex h-60 flex-col gap-5 rounded-2xl border border-slate-300/20 bg-gradient-to-br from-blue-50/90 to-blue-100/90 p-6 shadow-[0_16px_40px_rgba(30,64,175,0.18)]"
          role="img"
          aria-label={`Weekly active users: ${data.trend.join(", ")}`}
        >
          <div className="flex h-full flex-1 items-end gap-3">
            {data.trend.map((value, index) => {
              const heightPercent = trendStats.max !== 0 ? (value / trendStats.max) * 100 : 0;
              return (
                <div
                  key={index}
                  style={{
                    height: `${Math.max(10, heightPercent)}%`
                  }}
                  className="min-w-[12px] flex-1 rounded-xl bg-gradient-to-b from-blue-500/90 to-blue-600/85 transition-[height] duration-300 ease-in-out"
                />
              );
            })}
          </div>
          <div className="flex flex-col justify-between text-xs text-slate-600">
            <span>High: {numberFormatter.format(trendStats.max)}</span>
            <span>Low: {numberFormatter.format(trendStats.min)}</span>
          </div>
        </div>

        <div
          className="flex justify-between text-xs text-slate-400"
        >
          {data.trend.map((_, index) => (
            <span key={`label-${index}`}>W{index + 1}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
