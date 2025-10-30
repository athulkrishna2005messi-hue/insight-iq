import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockStore } from "@/lib/mock/datasource";

export async function GET(req: NextRequest, { params }: { params: { companyId: string; memberId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId) return new Response("Unauthorized", { status: 401 });
  const items = mockStore.events
    .filter((e) => e.companyId === params.companyId && e.memberId === params.memberId)
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 20);
  return Response.json({ items });
}


