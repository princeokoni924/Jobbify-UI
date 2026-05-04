import { describe, expect, test } from "vitest";
import { getDaysUntilExpiration } from "./getDaysUntilExpiration";

describe("getDaysUntilExpiration", () => {
  test("returns null if expiresAt is missing", () => {
    const job = {};
    expect(getDaysUntilExpiration(job)).toBe(null);
  });

  test("returns 0 if expired", () => {
    const job = { expiresAt: new Date(Date.now() - 86400000).toISOString() };
    expect(getDaysUntilExpiration(job)).toBe(0);
  });

  test("returns days remaining", () => {
    const job = { expiresAt: new Date(Date.now() + 2 * 86400000).toISOString() };
    expect(getDaysUntilExpiration(job)).toBe(2);
  });
});