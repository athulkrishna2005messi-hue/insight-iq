import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockStore } from "@/lib/mock/datasource";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId) return new Response("Unauthorized", { status: 401 });
  const items = mockStore.alerts.filter((a) => a.companyId === params.companyId);
  return Response.json({ items });
}

export async function POST(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId || session.role !== "admin") return new Response("Unauthorized", { status: 401 });

  const contentType = req.headers.get("content-type") ?? "";
  let ruleDefinition: any = {};
  if (contentType.includes("application/json")) {
    const body = await req.json();
    ruleDefinition = body.ruleDefinition ?? {};
  } else {
    const form = await req.formData();
    try {
      ruleDefinition = JSON.parse(String(form.get("ruleDefinition") ?? "{}"));
    } catch {
      ruleDefinition = {};
    }
  }

  const alert = {
    alertId: randomUUID(),
    companyId: params.companyId,
    ruleDefinition,
    lastTriggeredAt: null as string | null
  };
  mockStore.alerts.push(alert);
  return Response.json(alert, { status: 201 });
}


