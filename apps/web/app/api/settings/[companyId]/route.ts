import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { mockStore } from "@/lib/mock/datasource";

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId) return new Response("Unauthorized", { status: 401 });
  const s = mockStore.settings[params.companyId] ?? { anonymize: false };
  return Response.json(s);
}

export async function POST(req: NextRequest, { params }: { params: { companyId: string } }) {
  const session = getSession(req.headers);
  if (!session || session.companyId !== params.companyId || session.role !== "admin") return new Response("Unauthorized", { status: 401 });
  const contentType = req.headers.get("content-type") ?? "";
  let anonymize = false;
  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    anonymize = Boolean(body.anonymize);
  } else {
    const form = await req.formData();
    const val = form.get("anonymize");
    // HTML checkbox posts 'on' when checked
    anonymize = val === "on" || val === "true";
  }
  mockStore.settings[params.companyId] = { anonymize };
  return Response.json(mockStore.settings[params.companyId]);
}


