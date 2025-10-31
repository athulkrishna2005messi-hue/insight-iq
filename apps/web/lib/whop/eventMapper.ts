type BaseWhopEvent<TType extends string, TData extends Record<string, unknown>> = {
  id: string;
  type: TType;
  timestamp?: string;
  created_at?: string;
  createdAt?: string;
  data?: TData;
  [key: string]: unknown;
};

export type PurchaseCreatedEvent = BaseWhopEvent<
  "purchase.created",
  {
    member_id?: string;
    user_id?: string;
    membership_id?: string;
    tier?: string;
    plan?: string | { id?: string; name?: string };
    renewal_date?: string | number;
    renewal_at?: string | number;
    renewal_ts?: string | number;
  }
>;

export type SubscriptionRenewedEvent = BaseWhopEvent<
  "subscription.renewed",
  {
    member_id?: string;
    user_id?: string;
    tier?: string;
    renewal_date?: string | number;
    renewal_at?: string | number;
    renewal_ts?: string | number;
  }
>;

export type SubscriptionCanceledEvent = BaseWhopEvent<
  "subscription.canceled",
  {
    member_id?: string;
    user_id?: string;
    tier?: string;
    canceled_at?: string | number;
  }
>;

export type RefundIssuedEvent = BaseWhopEvent<
  "refund.issued",
  {
    member_id?: string;
    user_id?: string;
    tier?: string;
    refunded_at?: string | number;
  }
>;

export type WhopWebhookEvent =
  | PurchaseCreatedEvent
  | SubscriptionRenewedEvent
  | SubscriptionCanceledEvent
  | RefundIssuedEvent
  | BaseWhopEvent<string, Record<string, unknown>>;

export type MemberDatastoreEventType =
  | "member_joined"
  | "member_renewed"
  | "member_canceled"
  | "member_refunded";

export type MappedWhopEvent = {
  eventId: string;
  type: MemberDatastoreEventType;
  memberId: string;
  tier?: string;
  renewalDate?: string;
  ts: string;
  raw: WhopWebhookEvent;
};

function coerceIsoDate(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    // Support both seconds and milliseconds epoch values
    const millis = value > 10_000_000_000 ? value : value * 1000;
    const parsed = new Date(millis);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }

  return undefined;
}

function resolveMemberId(data: Record<string, unknown> | undefined, fallback: string): string {
  if (!data) return fallback;

  const candidates = [
    data.member_id,
    data.user_id,
    data.membership_id,
    data.customer_id,
    data.id
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return fallback;
}

function resolveTier(data: Record<string, unknown> | undefined): string | undefined {
  if (!data) return undefined;
  if (typeof data.tier === "string" && data.tier.trim().length > 0) return data.tier;

  const plan = data.plan;
  if (typeof plan === "string" && plan.trim().length > 0) {
    return plan;
  }
  if (plan && typeof plan === "object") {
    const planObj = plan as { id?: string; name?: string };
    if (typeof planObj.id === "string" && planObj.id) return planObj.id;
    if (typeof planObj.name === "string" && planObj.name) return planObj.name;
  }

  return undefined;
}

function resolveRenewalDate(data: Record<string, unknown> | undefined): string | undefined {
  if (!data) return undefined;

  const candidate = data.renewal_date ?? data.renewal_at ?? data.renewal_ts;
  return coerceIsoDate(candidate);
}

function resolveEventTimestamp(event: WhopWebhookEvent): string {
  const timestamp = coerceIsoDate(event.timestamp) ?? coerceIsoDate(event.created_at) ?? coerceIsoDate(event.createdAt);
  return timestamp ?? new Date().toISOString();
}

export function mapWhopEvent(event: WhopWebhookEvent): MappedWhopEvent {
  const ts = resolveEventTimestamp(event);
  const fallbackMemberId = `unknown-${event.id}`;
  const memberId = resolveMemberId(event.data, fallbackMemberId);
  const base: Omit<MappedWhopEvent, "type"> = {
    eventId: event.id,
    memberId,
    tier: resolveTier(event.data),
    renewalDate: resolveRenewalDate(event.data),
    ts,
    raw: event
  };

  switch (event.type) {
    case "purchase.created":
      return { ...base, type: "member_joined" };
    case "subscription.renewed":
      return { ...base, type: "member_renewed" };
    case "subscription.canceled":
      return { ...base, type: "member_canceled" };
    case "refund.issued":
      return { ...base, type: "member_refunded" };
    default:
      return { ...base, type: "member_joined" };
  }
}
