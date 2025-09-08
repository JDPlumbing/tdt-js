import {
  countTicks,
  breakdown,
  breakdownAll,
  prettyBreakdown,
} from "../src/tdt.js";

describe("TDT core utilities", () => {
  const start = new Date("1997-06-15T00:00:00Z");
  const end = new Date("2025-09-06T00:00:00Z"); // match your run date

  test("countTicks with seconds", () => {
    const ticks = countTicks(start, end, "seconds");
    expect(ticks).toBeGreaterThan(0);
    expect(typeof ticks).toBe("number");
  });

  test("countTicks with years and months", () => {
    const years = countTicks(start, end, "years");
    const months = countTicks(start, end, "months");
    expect(years).toBeGreaterThan(20);
    expect(months).toBeGreaterThan(200);
  });

  test("breakdown gives reasonable fields", () => {
    const parts = breakdown(start, end);
    expect(parts).toHaveProperty("years");
    expect(parts).toHaveProperty("months");
    expect(parts).toHaveProperty("days");
    expect(parts.years).toBeGreaterThan(20);
  });

  test("breakdownAll includes nanoseconds", () => {
    const all = breakdownAll(start, end);
    expect(all).toHaveProperty("millennia");
    expect(all).toHaveProperty("nanoseconds");
    expect(all.nanoseconds).toBeGreaterThan(all.microseconds);
  });

  test("prettyBreakdown produces a human-readable string", () => {
    const pretty = prettyBreakdown(start, end, 3);
    expect(typeof pretty).toBe("string");
    expect(pretty.length).toBeGreaterThan(0);
    expect(pretty).toMatch(/years|months|days|hours|minutes|seconds/);
  });

  test("prettyBreakdown with same start and end gives 0 seconds", () => {
    const pretty = prettyBreakdown(end, end);
    expect(pretty).toBe("0 seconds");
  });
});
