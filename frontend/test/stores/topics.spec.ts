// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useTopics } from "../../app/stores/topics";
import { createMockTopic } from "./helpers";

describe("useTopics", () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test to ensure isolation
    setActivePinia(createPinia());
  });

  // MARK: Initial State
  describe("Initial State", () => {
    it("initializes with empty topics array", () => {
      const store = useTopics();
      expect(store.topics).toEqual([]);
    });
  });

  // MARK: Getter Actions
  describe("Getter Actions", () => {
    it("getTopics returns current topics array", () => {
      const store = useTopics();
      const mockTopics = [createMockTopic({ id: "topic-1" })];
      store.setTopics(mockTopics);
      expect(store.getTopics()).toEqual(mockTopics);
    });
  });

  // MARK: Setter Actions
  describe("Setter Actions", () => {
    it("setTopics updates topics array", () => {
      const store = useTopics();
      const mockTopics = [
        createMockTopic({ id: "topic-1" }),
        createMockTopic({ id: "topic-2" }),
      ];
      store.setTopics(mockTopics);
      expect(store.topics).toEqual(mockTopics);
      expect(store.topics).toHaveLength(2);
    });
  });

  // MARK: Integration Tests
  describe("Integration Tests", () => {
    it("setting topics then getting them returns the same array", () => {
      const store = useTopics();
      const mockTopics = [
        createMockTopic({ id: "topic-1" }),
        createMockTopic({ id: "topic-2" }),
      ];
      store.setTopics(mockTopics);
      expect(store.getTopics()).toEqual(mockTopics);
      expect(store.getTopics()).toHaveLength(2);
    });

    it("topics array is reactive - changes reflect immediately", () => {
      const store = useTopics();
      const mockTopics = [createMockTopic({ id: "topic-1" })];

      store.setTopics(mockTopics);
      expect(store.topics).toEqual(mockTopics);
      expect(store.getTopics()).toEqual(mockTopics);

      // Update topics
      const updatedTopics = [
        createMockTopic({ id: "topic-1" }),
        createMockTopic({ id: "topic-2" }),
      ];
      store.setTopics(updatedTopics);
      expect(store.topics).toEqual(updatedTopics);
      expect(store.getTopics()).toEqual(updatedTopics);
      expect(store.topics).toHaveLength(2);
    });
  });

  // MARK: Edge Cases
  describe("Edge Cases", () => {
    it("handles setting empty topics array", () => {
      const store = useTopics();
      store.setTopics([createMockTopic()]);
      store.setTopics([]);
      expect(store.topics).toEqual([]);
      expect(store.getTopics()).toHaveLength(0);
    });

    it("handles setting topics with single topic", () => {
      const store = useTopics();
      const singleTopic = [createMockTopic({ id: "topic-1" })];
      store.setTopics(singleTopic);
      expect(store.getTopics()).toEqual(singleTopic);
      expect(store.getTopics()).toHaveLength(1);
      expect(store.topics[0]?.id).toBe("topic-1");
    });

    it("handles setting topics with multiple topics", () => {
      const store = useTopics();
      const multipleTopics = [
        createMockTopic({ id: "topic-1" }),
        createMockTopic({ id: "topic-2" }),
        createMockTopic({ id: "topic-3" }),
      ];
      store.setTopics(multipleTopics);
      expect(store.getTopics()).toEqual(multipleTopics);
      expect(store.getTopics()).toHaveLength(3);
      expect(store.topics[0]?.id).toBe("topic-1");
      expect(store.topics[1]?.id).toBe("topic-2");
      expect(store.topics[2]?.id).toBe("topic-3");
    });
    it("getting topics when array is empty returns empty array", () => {
      const store = useTopics();
      expect(store.getTopics()).toEqual([]);
      expect(store.getTopics()).toHaveLength(0);
      expect(store.topics).toEqual([]);
    });
  });
});
