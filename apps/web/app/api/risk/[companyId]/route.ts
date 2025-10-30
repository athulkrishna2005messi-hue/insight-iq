import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockStore } from "@/lib/mock/datasource";
import { scoreRisk } from "@/lib/ml/client";
import { buildFeatures, heuristicRisk } from "@/lib/risk/heuristic";

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId) return new Response("Unauthorized", { status: 401 });
  const members = mockStore.members.filter((m) => m.companyId === params.companyId);
  const items = members.slice(0, 200).map((m) => ({ memberId: m.memberId, features: buildFeatures(m) }));

  try {
    const scored = await scoreRisk(items);
    // merge scores back
    const byId = new Map(scored.map((s) => [s.memberId, s] as const));
    const ranked = members
      .map((m) => ({
        memberId: m.memberId,
        email: m.email,
        displayName: m.displayName,
        riskScore: byId.get(m.memberId)?.riskScore ?? m.riskScore,
        reasons: byId.get(m.memberId)?.reasons ?? []
      }))
      .sort((a, b) => b.riskScore - a.riskScore);
    return Response.json({ items: ranked });
  } catch {
    // heuristic fallback
    const ranked = members
      .map((m) => ({
        memberId: m.memberId,
        email: m.email,
        displayName: m.displayName,
        riskScore: heuristicRisk(m),
        reasons: ["heuristic_fallback"]
      }))
      .sort((a, b) => b.riskScore - a.riskScore);
    return Response.json({ items: ranked, fallback: true });
  }
}
 


