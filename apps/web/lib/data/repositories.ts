export type Company = { companyId: string; name: string; timezone: string; plan: string; createdAt: string };
export type Member = {
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

export interface MembersRepository {
  list(options: { companyId: string; q?: string; offset?: number; limit?: number }): Promise<Member[]>;
  get(companyId: string, memberId: string): Promise<Member | null>;
}

// Mock implementation placeholder (to be expanded)
export class MockMembersRepository implements MembersRepository {
  async list({ companyId }: { companyId: string }): Promise<Member[]> {
    return [
      {
        memberId: "m1",
        companyId,
        email: "user@example.com",
        displayName: "Demo User",
        joinDate: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        lifetimeValue: 123.45,
        planIds: ["basic"],
        engagementScore: 0.7,
        riskScore: 0.2
      }
    ];
  }
  async get(companyId: string, memberId: string): Promise<Member | null> {
    return this.list({ companyId }).then((arr) => arr.find((m) => m.memberId === memberId) ?? null);
  }
}


