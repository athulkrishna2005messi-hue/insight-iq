import { getMockKpis } from "@/lib/mock/datasource";

export async function GET(_req: Request, { params }: { params: { companyId: string } }) {
  const data = getMockKpis(params.companyId);
  if (!data) {
    return new Response("Not found", { status: 404 });
  }
  return Response.json(data);
}
