import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Member = {
  memberId: string;
  companyId: string;
  email: string;
  displayName: string;
  joinDate: string;
  lastActiveAt: string;
  lifetimeValue: number;
  planIds: string[];
  engagementScore: number;
  riskScore: number;
};

type EventItem = {
  type: string;
  occurredAt: string;
  metadata: Record<string, unknown>;
};

async function fetchMember(companyId: string, memberId: string): Promise<Member> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/members/${companyId}/${memberId}`, {
    cache: "no-store",
    headers: { "x-company-id": companyId }
  });

  if (res.status === 404) {
    throw new Error("Not Found");
  }

  if (!res.ok) {
    throw new Error("Failed to load member");
  }

  return res.json();
}

async function fetchEvents(companyId: string, memberId: string): Promise<EventItem[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/members/${companyId}/${memberId}/events`, {
    cache: "no-store",
    headers: { "x-company-id": companyId }
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as { items: EventItem[] };
  return data.items ?? [];
}

async function fetchSettings(companyId: string): Promise<{ anonymize: boolean }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`);
  const res = await fetch(`${baseUrl}/api/settings/${companyId}`, {
    cache: "no-store",
    headers: { "x-company-id": companyId }
  });

  if (!res.ok) {
    return { anonymize: false };
  }

  return res.json() as Promise<{ anonymize: boolean }>;
}

export default async function MemberDetail({ params }: { params: { companyId: string; memberId: string } }) {
  const [member, events, settings] = await Promise.all([
    fetchMember(params.companyId, params.memberId),
    fetchEvents(params.companyId, params.memberId),
    fetchSettings(params.companyId)
  ]);

  const displayName = settings.anonymize ? `${member.displayName[0]}***` : member.displayName;
  const email = settings.anonymize ? "***@***" : member.email;

  const stats = [
    { label: "Joined", value: new Date(member.joinDate).toLocaleDateString() },
    { label: "Last active", value: new Date(member.lastActiveAt).toLocaleString() },
    { label: "Plan", value: member.planIds.length ? member.planIds.join(", ") : "—" },
    { label: "Lifetime value", value: `$${member.lifetimeValue.toFixed(2)}` },
    { label: "Engagement", value: member.engagementScore.toFixed(2) },
    { label: "Risk", value: member.riskScore.toFixed(2) }
  ];

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>{displayName}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <dt className="text-xs uppercase tracking-wide text-gray-500">{stat.label}</dt>
                <dd className="mt-1 font-medium text-gray-900">{stat.value}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900">Recent events</h2>
            {events.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">No recent events</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {events.map((event, index) => (
                  <li key={`${event.type}-${event.occurredAt}-${index}`} className="text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{new Date(event.occurredAt).toLocaleString()}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-blue-600">{event.type}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
