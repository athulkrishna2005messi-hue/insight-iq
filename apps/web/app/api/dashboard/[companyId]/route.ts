import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getMockDashboard } from "@/lib/mock/dashboard";

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const data = getMockDashboard(params.companyId);
  return Response.json(data);
}


