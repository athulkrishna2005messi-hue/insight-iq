import { randomUUID } from "crypto";

export function getMockDashboard(companyId: string) {
  const seed = [...companyId].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = mulberry32(seed);
  const kpis = {
    activeMembers: Math.floor(500 + rand() * 1500),
    new7d: Math.floor(50 + rand() * 150),
    churn7d: Math.floor(10 + rand() * 40),
    mrr: Number((rand() * 10000 + 20000).toFixed(2)),
    arpu: Number((rand() * 30 + 20).toFixed(2)),
    minutes: Math.floor(rand() * 100000)
  };
  const today = new Date();
  const series = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    return {
      date: d.toISOString().slice(0, 10),
      active: Math.floor(kpis.activeMembers * (0.7 + rand() * 0.6)),
      revenue: Number((kpis.mrr / 30 * (0.8 + rand() * 0.4)).toFixed(2)),
      engagement: Math.floor(kpis.minutes / 30 * (0.8 + rand() * 0.4))
    };
  });
  return { kpis, series, id: randomUUID() };
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


