import { randomUUID } from "crypto";

export type MockCompany = { companyId: string; name: string; timezone: string; plan: string; createdAt: string };
export type MockMember = {
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
export type MockEvent = { eventId: string; memberId: string; companyId: string; type: string; metadata: any; occurredAt: string };

export const mockStore = (() => {
  const companies: MockCompany[] = [
    { companyId: "demo-company", name: "Demo Co", timezone: "UTC", plan: "pro", createdAt: new Date().toISOString() }
  ];
  const members: MockMember[] = Array.from({ length: 50 }).map((_, i) => ({
    memberId: `m${i + 1}`,
    companyId: "demo-company",
    email: `user${i + 1}@example.com`,
    displayName: `User ${i + 1}`,
    joinDate: new Date(Date.now() - (i + 5) * 86400000).toISOString(),
    lastActiveAt: new Date(Date.now() - (i % 7) * 86400000).toISOString(),
    lifetimeValue: Math.round(50 + Math.random() * 500),
    planIds: [i % 3 === 0 ? "pro" : "basic"],
    engagementScore: Math.random(),
    riskScore: Math.random()
  }));
  const events: MockEvent[] = members.slice(0, 100).map((m) => ({
    eventId: randomUUID(),
    memberId: m.memberId,
    companyId: m.companyId,
    type: "login",
    metadata: { ip: "127.0.0.1" },
    occurredAt: new Date().toISOString()
  }));

  const cohorts: Array<{ cohortId: string; companyId: string; name: string; filterDefinition: any; createdAt: string }> = [];

  const alerts: Array<{ alertId: string; companyId: string; ruleDefinition: any; lastTriggeredAt: string | null }> = [
    {
      alertId: randomUUID(),
      companyId: "demo-company",
      ruleDefinition: { type: "risk_gt", threshold: 0.7 },
      lastTriggeredAt: null
    }
  ];

  const settings: Record<string, { anonymize: boolean }> = {
    "demo-company": { anonymize: false }
  };

  return { companies, members, events, cohorts, alerts, settings };
})();


