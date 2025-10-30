import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { searchMembers } from "@/lib/data";

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? undefined;
  const limit = Number(searchParams.get("limit") ?? "20");
  const members = searchMembers(params.companyId, q ?? undefined, limit);
  return Response.json({ items: members, total: members.length });
}


