// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useTopicCache composable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTopicCache } from "../../../app/composables/cache/useTopicCache";

describe("useTopicCache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("topicCacheEntries", () => {
    it("calls getEntries with the topics key and returns the result", () => {
      const mockEntries = [{ data: { id: "topic-1", name: "Environment" } }];
      const { getEntries } = globalThis.useQueryCache();
      getEntries.mockReturnValue(mockEntries);

      const { topicCacheEntries } = useTopicCache();
      const result = topicCacheEntries();

      expect(getEntries).toHaveBeenCalledWith({
        key: ["topics"],
      });
      expect(result).toBe(mockEntries);
    });
  });

  describe("getKeyForTopics", () => {
    it("returns the correct topics key", () => {
      const { getKeyForTopics } = useTopicCache();

      const key = getKeyForTopics();

      expect(key).toEqual(["topics"]);
    });
  });
});
