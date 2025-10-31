export type MockCompany = {
  companyId: string;
  name: string;
  timezone: string;
  plan: string;
  createdAt: string;
};

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
  whopPlanTier?: string;
  whopStatus?: 'active' | 'canceled' | 'refunded';
  whopLastEventType?: string;
  whopLastEventTs?: string;
  whopRenewalDate?: string;
};

export type MockEvent = {
  eventId: string;
  memberId: string;
  companyId: string;
  type: string;
  metadata: any;
  occurredAt: string;
};

export type MockDashboardKpis = {
  companyId: string;
  activeUsers: number;
  new7d: number;
  churn30d: number;
  mrr: number;
  arpu: number;
  minutes: number;
  trend: number[];
};

type MockCohort = {
  cohortId: string;
  companyId: string;
  name: string;
  filterDefinition: any;
  createdAt: string;
};

type MockAlert = {
  alertId: string;
  companyId: string;
  ruleDefinition: any;
  lastTriggeredAt: string | null;
};

type MockSettings = Record<string, { anonymize: boolean }>;

export type MockStore = {
  companies: MockCompany[];
  members: MockMember[];
  events: MockEvent[];
  cohorts: MockCohort[];
  alerts: MockAlert[];
  settings: MockSettings;
};

export const mockCompany: MockCompany = {
  companyId: "mock-company",
  name: "Mock Co",
  timezone: "UTC",
  plan: "growth",
  createdAt: "2024-01-15T12:00:00.000Z"
};

const mockCompanies: MockCompany[] = [mockCompany];

export const mockMembers: MockMember[] = [
  {
    memberId: "m1",
    companyId: mockCompany.companyId,
    email: "ava.diaz@mock.co",
    displayName: "Ava Diaz",
    joinDate: "2023-09-12T09:00:00.000Z",
    lastActiveAt: "2025-03-12T15:45:00.000Z",
    lifetimeValue: 1280,
    planIds: ["growth"],
    engagementScore: 0.82,
    riskScore: 0.12
  },
  {
    memberId: "m2",
    companyId: mockCompany.companyId,
    email: "leo.nakamura@mock.co",
    displayName: "Leo Nakamura",
    joinDate: "2024-02-02T14:30:00.000Z",
    lastActiveAt: "2025-03-10T11:10:00.000Z",
    lifetimeValue: 640,
    planIds: ["growth"],
    engagementScore: 0.76,
    riskScore: 0.18
  },
  {
    memberId: "m3",
    companyId: mockCompany.companyId,
    email: "mina.cho@mock.co",
    displayName: "Mina Cho",
    joinDate: "2023-11-19T18:05:00.000Z",
    lastActiveAt: "2025-03-08T16:25:00.000Z",
    lifetimeValue: 420,
    planIds: ["starter"],
    engagementScore: 0.63,
    riskScore: 0.22
  },
  {
    memberId: "m4",
    companyId: mockCompany.companyId,
    email: "jacob.mendes@mock.co",
    displayName: "Jacob Mendes",
    joinDate: "2024-04-01T07:45:00.000Z",
    lastActiveAt: "2025-03-11T19:40:00.000Z",
    lifetimeValue: 980,
    planIds: ["growth", "analytics"],
    engagementScore: 0.9,
    riskScore: 0.08
  },
  {
    memberId: "m5",
    companyId: mockCompany.companyId,
    email: "noor.faruqi@mock.co",
    displayName: "Noor Faruqi",
    joinDate: "2023-07-23T21:55:00.000Z",
    lastActiveAt: "2025-03-05T13:05:00.000Z",
    lifetimeValue: 560,
    planIds: ["starter"],
    engagementScore: 0.48,
    riskScore: 0.38
  },
  {
    memberId: "m6",
    companyId: mockCompany.companyId,
    email: "peter.ramirez@mock.co",
    displayName: "Peter Ramirez",
    joinDate: "2024-01-09T10:20:00.000Z",
    lastActiveAt: "2025-03-03T08:50:00.000Z",
    lifetimeValue: 750,
    planIds: ["growth"],
    engagementScore: 0.71,
    riskScore: 0.26
  },
  {
    memberId: "m7",
    companyId: mockCompany.companyId,
    email: "sofia.liu@mock.co",
    displayName: "Sofia Liu",
    joinDate: "2022-12-15T12:30:00.000Z",
    lastActiveAt: "2025-03-12T09:20:00.000Z",
    lifetimeValue: 1520,
    planIds: ["enterprise"],
    engagementScore: 0.94,
    riskScore: 0.06
  },
  {
    memberId: "m8",
    companyId: mockCompany.companyId,
    email: "dylan.kent@mock.co",
    displayName: "Dylan Kent",
    joinDate: "2024-05-19T16:45:00.000Z",
    lastActiveAt: "2025-02-26T22:15:00.000Z",
    lifetimeValue: 360,
    planIds: ["starter"],
    engagementScore: 0.39,
    riskScore: 0.44
  },
  {
    memberId: "m9",
    companyId: mockCompany.companyId,
    email: "jules.ferreira@mock.co",
    displayName: "Jules Ferreira",
    joinDate: "2023-10-02T17:40:00.000Z",
    lastActiveAt: "2025-03-04T10:35:00.000Z",
    lifetimeValue: 680,
    planIds: ["growth"],
    engagementScore: 0.68,
    riskScore: 0.29
  },
  {
    memberId: "m10",
    companyId: mockCompany.companyId,
    email: "amir.hassan@mock.co",
    displayName: "Amir Hassan",
    joinDate: "2024-03-28T06:55:00.000Z",
    lastActiveAt: "2025-03-09T17:05:00.000Z",
    lifetimeValue: 540,
    planIds: ["analytics"],
    engagementScore: 0.57,
    riskScore: 0.33
  }
];

export const mockEvents: MockEvent[] = [
  {
    eventId: "evt-001",
    memberId: "m1",
    companyId: mockCompany.companyId,
    type: "login",
    metadata: { surface: "web" },
    occurredAt: "2025-03-12T15:40:00.000Z"
  },
  {
    eventId: "evt-002",
    memberId: "m1",
    companyId: mockCompany.companyId,
    type: "session_minutes",
    metadata: { minutes: 42 },
    occurredAt: "2025-03-11T14:10:00.000Z"
  },
  {
    eventId: "evt-003",
    memberId: "m2",
    companyId: mockCompany.companyId,
    type: "feature_adopted",
    metadata: { feature: "dashboards" },
    occurredAt: "2025-03-10T11:05:00.000Z"
  },
  {
    eventId: "evt-004",
    memberId: "m3",
    companyId: mockCompany.companyId,
    type: "login",
    metadata: { surface: "mobile" },
    occurredAt: "2025-03-08T16:20:00.000Z"
  },
  {
    eventId: "evt-005",
    memberId: "m4",
    companyId: mockCompany.companyId,
    type: "login",
    metadata: { surface: "web" },
    occurredAt: "2025-03-11T19:35:00.000Z"
  },
  {
    eventId: "evt-006",
    memberId: "m5",
    companyId: mockCompany.companyId,
    type: "cancel_attempt",
    metadata: { reason: "budget" },
    occurredAt: "2025-03-02T09:15:00.000Z"
  },
  {
    eventId: "evt-007",
    memberId: "m6",
    companyId: mockCompany.companyId,
    type: "minutes_streamed",
    metadata: { minutes: 58 },
    occurredAt: "2025-03-03T08:45:00.000Z"
  },
  {
    eventId: "evt-008",
    memberId: "m7",
    companyId: mockCompany.companyId,
    type: "login",
    metadata: { surface: "api" },
    occurredAt: "2025-03-12T09:15:00.000Z"
  },
  {
    eventId: "evt-009",
    memberId: "m8",
    companyId: mockCompany.companyId,
    type: "login",
    metadata: { surface: "web" },
    occurredAt: "2025-02-26T22:10:00.000Z"
  },
  {
    eventId: "evt-010",
    memberId: "m9",
    companyId: mockCompany.companyId,
    type: "email_click",
    metadata: { campaign: "reactivation" },
    occurredAt: "2025-03-04T10:30:00.000Z"
  },
  {
    eventId: "evt-011",
    memberId: "m10",
    companyId: mockCompany.companyId,
    type: "login",
    metadata: { surface: "web" },
    occurredAt: "2025-03-09T17:00:00.000Z"
  }
];

const mockCohorts: MockCohort[] = [
  {
    cohortId: "cohort-power-users",
    companyId: mockCompany.companyId,
    name: "Power Users",
    filterDefinition: { engagementScore: { gte: 0.8 } },
    createdAt: "2024-06-05T10:00:00.000Z"
  },
  {
    cohortId: "cohort-risk-watchlist",
    companyId: mockCompany.companyId,
    name: "Risk Watchlist",
    filterDefinition: { riskScore: { gte: 0.5 } },
    createdAt: "2024-07-18T08:30:00.000Z"
  }
];

const mockAlerts: MockAlert[] = [
  {
    alertId: "alert-risk-high",
    companyId: mockCompany.companyId,
    ruleDefinition: { type: "risk_gt", threshold: 0.7 },
    lastTriggeredAt: null
  },
  {
    alertId: "alert-churn-spike",
    companyId: mockCompany.companyId,
    ruleDefinition: { type: "churn_gt", threshold: 0.06 },
    lastTriggeredAt: "2025-02-20T09:00:00.000Z"
  }
];

const mockSettings: MockSettings = {
  [mockCompany.companyId]: { anonymize: false }
};

export function getMockKpis(companyId: string): MockDashboardKpis | null {
  const companyExists = mockCompanies.some((company) => company.companyId === companyId);
  if (!companyExists) return null;

  return {
    companyId,
    activeUsers: 1200,
    new7d: 80,
    churn30d: 5.4,
    mrr: 3200,
    arpu: 4.6,
    minutes: 42500,
    trend: [950, 1000, 1025, 1100, 1150, 1180, 1200]
  };
}

export const mockStore: MockStore = {
  companies: mockCompanies,
  members: mockMembers,
  events: mockEvents,
  cohorts: mockCohorts,
  alerts: mockAlerts,
  settings: mockSettings
};
