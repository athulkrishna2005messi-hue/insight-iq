import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockStore } from "@/lib/mock/datasource";

export async function GET(req: NextRequest, { params }: { params: { companyId: string; memberId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId) return new Response("Unauthorized", { status: 401 });
  const m = mockStore.members.find((x) => x.companyId === params.companyId && x.memberId === params.memberId);
  if (!m) return new Response("Not Found", { status: 404 });
  return Response.json(m);
}


