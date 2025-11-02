import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getMockKpis } from "@/lib/mock/datasource";

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  
  if (!session || session.companyId !== params.companyId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized", message: "Invalid or missing company session" }),
      { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const data = getMockKpis(params.companyId);
  if (!data) {
    return new Response(
      JSON.stringify({ error: "Not found", message: `Company ${params.companyId} not found` }),
      { 
        status: 404,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return Response.json(data);
}
