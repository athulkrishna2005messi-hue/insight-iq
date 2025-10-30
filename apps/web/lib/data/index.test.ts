import { searchMembers } from "./index";
import { mockStore } from "@/lib/mock/datasource";

describe("searchMembers", () => {
  it("returns members for company", () => {
    const items = searchMembers("demo-company", undefined, 5);
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThanOrEqual(5);
    for (const m of items) expect(m.companyId).toBe("demo-company");
  });
  it("filters by query", () => {
    const any = mockStore.members.find((m) => m.companyId === "demo-company");
    expect(any).toBeTruthy();
    const items = searchMembers("demo-company", any!.email.split("@")[0], 50);
    expect(items.some((m) => m.memberId === any!.memberId)).toBe(true);
  });
});


