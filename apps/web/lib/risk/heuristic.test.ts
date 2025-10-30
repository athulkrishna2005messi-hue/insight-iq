import { heuristicRisk, buildFeatures } from "./heuristic";

describe("heuristicRisk", () => {
  it("produces value in [0,1]", () => {
    const m = { lastActiveAt: new Date().toISOString(), engagementScore: 0.5, lifetimeValue: 200 };
    const v = heuristicRisk(m);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThanOrEqual(1);
  });
});

describe("buildFeatures", () => {
  it("builds numeric features", () => {
    const m = { lastActiveAt: new Date().toISOString(), engagementScore: 0.4, lifetimeValue: 150 };
    const f = buildFeatures(m);
    expect(typeof f.lastActiveDaysAgo).toBe("number");
    expect(f.engagementScore).toBe(0.4);
    expect(f.lifetimeValue).toBe(150);
  });
});


