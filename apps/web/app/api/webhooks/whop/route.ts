import { mapWhopEvent, type WhopWebhookEvent } from "@/lib/whop/eventMapper";
import { updateMockDatastore } from "@/lib/mock/updateMockDatastore";
import { createHmac, timingSafeEqual } from "crypto";

const SIGNATURE_HEADER_PRIMARY = "whop-signature";
const SIGNATURE_HEADER_FALLBACK = "whop-signature-v1";
const PUBLIC_KEY_HEADER = "whop-public-key";

function extractSignature(rawHeader: string | null): string | null {
  if (!rawHeader) return null;
  const header = rawHeader.trim();
  if (!header) return null;

  if (!header.includes("=")) {
    return header;
  }

  const segments = header.split(",").map((segment) => segment.trim());
  const signatureSegment = segments.find((segment) => segment.startsWith("s="));
  if (!signatureSegment) return null;
  return signatureSegment.slice(2);
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
