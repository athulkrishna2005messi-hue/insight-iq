import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import type { WhopWebhookEvent } from "@/lib/whop/eventMapper";
import { mapWhopEvent } from "@/lib/whop/eventMapper";
import { updateMockDatastore } from "@/lib/mock/updateMockDatastore";

const PUBLIC_KEY_HEADER = "x-whop-public-key";
const SIGNATURE_HEADER_PRIMARY = "x-whop-signature";
const SIGNATURE_HEADER_FALLBACK = "x-signature";

function validateSecret(req: NextRequest, expectedSecret: string) {
  const provided = req.headers.get("x-whop-secret");
  return Boolean(provided) && provided === expectedSecret;
}

function extractSignature(headerValue: string | null): string | null {
  if (!headerValue) return null;
  const trimmed = headerValue.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function verifySignature(body: string, headers: Headers, secret: string, expectedPublicKey: string): boolean {
  const providedKey = headers.get(PUBLIC_KEY_HEADER);
  if (!providedKey || providedKey !== expectedPublicKey) {
    return false;
  }

  const signatureRaw = extractSignature(headers.get(SIGNATURE_HEADER_PRIMARY)) ?? extractSignature(headers.get(SIGNATURE_HEADER_FALLBACK));
  if (!signatureRaw) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret).update(body).digest("hex");

  const providedBuffer = Buffer.from(signatureRaw, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  try {
    return timingSafeEqual(providedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const whopSecret = process.env.WHOP_SECRET;
  const whopPublicKey = process.env.WHOP_PUBLIC_KEY;

  if (!whopSecret || !whopPublicKey) {
    return new Response("Webhook credentials not configured", { status: 500 });
  }

  const rawBody = await req.text();

  if (!rawBody) {
    return new Response("Empty body", { status: 400 });
  }

  const signatureValid = verifySignature(rawBody, req.headers, whopSecret, whopPublicKey);
  if (!signatureValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  let parsedEvent: WhopWebhookEvent;
  try {
    parsedEvent = JSON.parse(rawBody) as WhopWebhookEvent;
  } catch {
    return new Response("Invalid JSON payload", { status: 400 });
  }

  if (!parsedEvent || typeof parsedEvent.id !== "string" || typeof parsedEvent.type !== "string") {
    return new Response("Invalid webhook event", { status: 400 });
  }

  const mappedEvent = mapWhopEvent(parsedEvent);
  const updateResult = updateMockDatastore(mappedEvent);

  return Response.json({
    ok: true,
    eventId: mappedEvent.eventId,
    memberId: updateResult.memberId,
    updated: updateResult.updated
  });
}
