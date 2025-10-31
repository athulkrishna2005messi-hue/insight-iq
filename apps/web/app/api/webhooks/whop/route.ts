import { NextRequest } from "next/server";
import { mockStore, mockCompany } from "@/lib/mock/datasource";
import { randomUUID } from "crypto";

function validateSecret(req: NextRequest) {
  const provided = req.headers.get("x-whop-secret");
  const expected = process.env.WHOP_SECRET || process.env.WHOP_WEBHOOK_SECRET || "dev-secret";
  return provided === expected;
}

export async function POST(req: NextRequest) {
  if (!validateSecret(req)) return new Response("Unauthorized", { status: 401 });
  const contentType = req.headers.get("content-type") ?? "";
  let payload: any = {};
  if (contentType.includes("application/json")) {
    payload = await req.json();
  } else {
    const text = await req.text();
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
  }

  // Expect minimal fields: companyId, memberId, type, metadata
  const companyId = payload.companyId || mockCompany.companyId;
  const memberId = payload.memberId || null;
  const type = payload.type || "whop_event";
  const metadata = payload.metadata ?? payload;

  const event = {
    eventId: randomUUID(),
    memberId: memberId,
    companyId,
    type,
    metadata,
    occurredAt: new Date().toISOString()
  } as any;

  mockStore.events.push(event);
  return Response.json({ ok: true, stored: true, eventId: event.eventId });
}


