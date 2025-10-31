import { searchMembers } from "./index";
import { mockStore, mockCompany } from "@/lib/mock/datasource";

describe("searchMembers", () => {
  const companyId = mockCompany.companyId;

  it("returns members for company", () => {
    const items = searchMembers(companyId, undefined, 5);
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(5);
    for (const m of items) expect(m.companyId).toBe(companyId);
  });

  it("filters by query", () => {
    const any = mockStore.members.find((m) => m.companyId === companyId);
    expect(any).toBeTruthy();
    const items = searchMembers(companyId, any!.email.split("@")[0], 50);
    expect(items.some((m) => m.memberId === any!.memberId)).toBe(true);
  });
});
