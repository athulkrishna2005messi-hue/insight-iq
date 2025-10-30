import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockStore } from "@/lib/mock/datasource";

export async function POST(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId || session.role !== "admin") return new Response("Unauthorized", { status: 401 });

  // Simulate evaluating rules and sending a mock DM/log
  const { alerts, members } = mockStore;
  const nowIso = new Date().toISOString();
  const affected = [] as Array<{ alertId: string; memberId: string }>;
  for (const a of alerts.filter((x) => x.companyId === params.companyId)) {
    // Simple mock: if risk_gt rule, pick members over threshold
    const t = a.ruleDefinition?.threshold ?? 0.7;
    const risky = members.filter((m) => m.companyId === params.companyId && m.riskScore > t).slice(0, 5);
    for (const m of risky) affected.push({ alertId: a.alertId, memberId: m.memberId });
    a.lastTriggeredAt = nowIso;
  }
  return Response.json({ ok: true, triggeredAt: nowIso, affected });
}


