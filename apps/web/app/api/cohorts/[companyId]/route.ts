import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockStore } from "@/lib/mock/datasource";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId) return new Response("Unauthorized", { status: 401 });
  const items = (mockStore as any).cohorts ?? [];
  const filtered = items.filter((c: any) => c.companyId === params.companyId);
  return Response.json({ items: filtered });
}

export async function POST(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId || session.role !== "admin")
    return new Response("Unauthorized", { status: 401 });

  const contentType = req.headers.get("content-type") ?? "";
  let name = "";
  let filterDefinition: any = {};
  if (contentType.includes("application/json")) {
    const body = await req.json();
    name = body.name ?? "Untitled Cohort";
    filterDefinition = body.filterDefinition ?? {};
  } else {
    const form = await req.formData();
    name = String(form.get("name") ?? "Untitled Cohort");
    try {
      filterDefinition = JSON.parse(String(form.get("filterDefinition") ?? "{}"));
    } catch {
      filterDefinition = {};
    }
  }

  const cohort = {
    cohortId: randomUUID(),
    companyId: params.companyId,
    name,
    filterDefinition,
    createdAt: new Date().toISOString()
  };
  (mockStore as any).cohorts = (mockStore as any).cohorts ?? [];
  (mockStore as any).cohorts.push(cohort);
  return Response.json(cohort, { status: 201 });
}


