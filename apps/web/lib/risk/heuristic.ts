export function buildFeatures(m: any) {
  const lastActiveDaysAgo = Math.max(0, (Date.now() - new Date(m.lastActiveAt).getTime()) / 86400000);
  return {
    lastActiveDaysAgo,
    engagementScore: Number(m.engagementScore ?? 0),
    lifetimeValue: Number(m.lifetimeValue ?? 0)
  } as Record<string, number>;
}

export function heuristicRisk(m: any) {
  const lastActiveDaysAgo = Math.max(0, (Date.now() - new Date(m.lastActiveAt).getTime()) / 86400000);
  const engagement = Number(m.engagementScore ?? 0);
  const ltv = Number(m.lifetimeValue ?? 0);
  const score = 0.6 * Math.min(1, lastActiveDaysAgo / 30) + 0.3 * (1 - Math.min(1, engagement)) + 0.1 * (1 - Math.min(1, ltv / 500));
  return Math.max(0, Math.min(1, score));
}


