// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Component } from "vue";

import { describe, expect, it } from "vitest";

import { useMentionSuggestion } from "../../app/composables/useMentionSuggestions";

describe("useMentionSuggestions", () => {
  // MARK: Query Filtering

  // Mock component for useMentionSuggestion.

  const MockMentionList = {} as Component;
  const { getItems } = useMentionSuggestion(MockMentionList);

  it("items filters by query prefix, case-insensitive, max 5", () => {
    const out = getItems({ query: "j" } as { query: string });
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((n) => n.toLowerCase().startsWith("j"))).toBe(true);
    expect(out.length).toBeLessThanOrEqual(5);
  });

  it("items returns all base names for empty query (limited by slice)", () => {
    const out = getItems({ query: "" } as { query: string });
    expect(out).toEqual(["Jay Doe", "Jane Doe", "John Doe"]);
  });

  it("items handles non-matching query gracefully", () => {
    const out = getItems({ query: "zzz" } as { query: string });
    expect(out).toEqual([]);
  });
});
