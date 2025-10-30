import { mockStore } from "@/lib/mock/datasource";
import type { Member } from "./repositories";

export function searchMembers(companyId: string, q?: string, limit = 20): Member[] {
  const inCompany = mockStore.members.filter((m) => m.companyId === companyId);
  const filtered = q
    ? inCompany.filter((m) =>
        [m.email, m.displayName].some((s) => s.toLowerCase().includes(q.toLowerCase()))
      )
    : inCompany;
  return filtered.slice(0, limit).map((m) => ({
    memberId: m.memberId,
    companyId: m.companyId,
    email: m.email,
    displayName: m.displayName,
    joinDate: m.joinDate,
    lastActiveAt: m.lastActiveAt,
    lifetimeValue: m.lifetimeValue,
    planIds: m.planIds,
    engagementScore: m.engagementScore,
    riskScore: m.riskScore
  }));
}


