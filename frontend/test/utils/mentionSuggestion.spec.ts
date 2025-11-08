// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, it, expect } from "vitest";

import mention from "../../app/utils/mentionSuggestion";

describe("utils/mentionSuggestion", () => {
  // MARK: - Query Filtering

  it("items filters by query prefix, case-insensitive, max 5", () => {
    const out = mention.items({ query: "j" } as { query: string });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((n) => n.toLowerCase().startsWith("j"))).toBe(true);
    expect(out.length).toBeLessThanOrEqual(5);
  });

  it("items returns all base names for empty query (limited by slice)", () => {
    const out = mention.items({ query: "" } as { query: string });
    expect(out).toEqual(["Jay Doe", "Jane Doe", "John Doe"]);
  });

  it("items handles non-matching query gracefully", () => {
    const out = mention.items({ query: "zzz" } as { query: string });
    expect(out).toEqual([]);
  });
});
