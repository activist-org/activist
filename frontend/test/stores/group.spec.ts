// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { Group } from "../../shared/types/group";

import { useGroupStore } from "../../app/stores/data/group";
import { createMockContentImage, createMockGroup } from "../mocks/factories";

describe("useGroupStore", () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test to ensure isolation.
    setActivePinia(createPinia());
  });

  // MARK: Initial State

  describe("Initial State", () => {
    it("initializes with null group", () => {
      const store = useGroupStore();
      expect(store.group).toBeNull();
    });

    it("initializes with empty groups array", () => {
      const store = useGroupStore();
      expect(store.groups).toEqual([]);
    });

    it("initializes with empty images array", () => {
      const store = useGroupStore();
      expect(store.images).toEqual([]);
    });
  });

  // MARK: Getter Actions

  describe("Getter Actions", () => {
    it("getGroup returns current group", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      store.setGroup(mockGroup);
      expect(store.getGroup()).toEqual(mockGroup);
    });

    it("getGroups returns current groups array", () => {
      const store = useGroupStore();
      const mockGroups = [createMockGroup({ id: "group-1" } as Partial<Group>)];
      store.setGroups(mockGroups);
      expect(store.getGroups()).toEqual(mockGroups);
    });

    it("getGroupImages returns current images array", () => {
      const store = useGroupStore();
      const mockImages = [createMockContentImage({ id: "img-1" })];
      store.setGroupImages(mockImages);
      expect(store.getGroupImages()).toEqual(mockImages);
    });
  });

  // MARK: Setter Actions

  describe("Setter Actions", () => {
    it("setGroup updates group state", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      store.setGroup(mockGroup);
      expect(store.group).toEqual(mockGroup);
    });

    it("setGroups updates groups array", () => {
      const store = useGroupStore();
      const mockGroups = [
        createMockGroup({ id: "group-1" } as Partial<Group>),
        createMockGroup({ id: "group-2" } as Partial<Group>),
      ];
      store.setGroups(mockGroups);
      expect(store.groups).toEqual(mockGroups);
      expect(store.groups).toHaveLength(2);
    });

    it("setGroupImages updates images array", () => {
      const store = useGroupStore();
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];
      store.setGroupImages(mockImages);
      expect(store.images).toEqual(mockImages);
      expect(store.images).toHaveLength(2);
    });
  });

  // MARK: Conditional Clear Actions

  describe("Conditional Clear Actions", () => {
    it("clearGroupImages clears images only if group.id matches", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];

      store.setGroup(mockGroup);
      store.setGroupImages(mockImages);

      // Clear with matching id - should clear images.
      store.clearGroupImages("group-1");
      expect(store.getGroupImages()).toEqual([]);
      expect(store.images).toHaveLength(0);
    });

    it("clearGroupImages does nothing if group.id does not match", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];

      store.setGroup(mockGroup);
      store.setGroupImages(mockImages);

      // Clear with non-matching id - should not clear images.
      store.clearGroupImages("group-2");
      expect(store.getGroupImages()).toEqual(mockImages);
      expect(store.images).toHaveLength(2);
    });

    it("clearGroupImages throws error when group is null", () => {
      const store = useGroupStore();
      const mockImages = [createMockContentImage({ id: "img-1" })];

      // Group is null by default.
      expect(store.group).toBeNull();
      store.setGroupImages(mockImages);

      // Attempt to clear - should throw error when accessing group.id on null.
      expect(() => {
        store.clearGroupImages("group-1");
      }).toThrow();
      // Images should remain since error prevents clearing.
      expect(store.getGroupImages()).toEqual(mockImages);
    });

    it("clearGroup sets group to null only if group.id matches", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);

      store.setGroup(mockGroup);

      // Clear with matching id - should set group to null.
      store.clearGroup("group-1");
      expect(store.getGroup()).toBeNull();
      expect(store.group).toBeNull();
    });

    it("clearGroup does nothing if group.id does not match", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);

      store.setGroup(mockGroup);

      // Clear with non-matching id - should not clear group.
      store.clearGroup("group-2");
      expect(store.getGroup()).toEqual(mockGroup);
      expect(store.group.id).toBe("group-1");
    });

    it("clearGroup throws error when group is null", () => {
      const store = useGroupStore();

      // Group is null by default.
      expect(store.group).toBeNull();

      // Attempt to clear - should throw error when accessing group.id on null.
      expect(() => {
        store.clearGroup("group-1");
      }).toThrow();
      expect(store.getGroup()).toBeNull();
      expect(store.group).toBeNull();
    });

    it("clearGroups always clears groups array regardless of state", () => {
      const store = useGroupStore();
      const mockGroups = [
        createMockGroup({ id: "group-1" } as Partial<Group>),
        createMockGroup({ id: "group-2" } as Partial<Group>),
      ];

      store.setGroups(mockGroups);
      store.clearGroups();

      expect(store.getGroups()).toEqual([]);
      expect(store.groups).toHaveLength(0);
    });
  });

  // MARK: Integration Tests

  describe("Integration Tests", () => {
    it("setting group with specific id, then clearing images with same id clears images", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];

      store.setGroup(mockGroup);
      store.setGroupImages(mockImages);
      expect(store.getGroupImages()).toHaveLength(2);

      store.clearGroupImages("group-1");
      expect(store.getGroupImages()).toEqual([]);
      expect(store.getGroup()).toEqual(mockGroup); // group should remain
    });

    it("setting group with specific id, then clearing images with different id doesn't clear images", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];

      store.setGroup(mockGroup);
      store.setGroupImages(mockImages);

      store.clearGroupImages("group-2"); // different id
      expect(store.getGroupImages()).toEqual(mockImages);
      expect(store.getGroupImages()).toHaveLength(2);
    });

    it("setting group, then clearing it sets group to null", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);

      store.setGroup(mockGroup);
      expect(store.getGroup()).toEqual(mockGroup);

      store.clearGroup("group-1");
      expect(store.getGroup()).toBeNull();
    });

    it("can set groups array independently of single group", () => {
      const store = useGroupStore();
      const singleGroup = createMockGroup({
        id: "group-single",
      } as Partial<Group>);
      const groupsArray = [
        createMockGroup({ id: "group-1" } as Partial<Group>),
        createMockGroup({ id: "group-2" } as Partial<Group>),
      ];

      store.setGroup(singleGroup);
      store.setGroups(groupsArray);

      expect(store.getGroup()).toEqual(singleGroup);
      expect(store.getGroups()).toEqual(groupsArray);
      expect(store.group.id).toBe("group-single");
      expect(store.groups).toHaveLength(2);
    });

    it("clearing groups doesn't affect single group", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      const mockGroups = [
        createMockGroup({ id: "group-2" } as Partial<Group>),
        createMockGroup({ id: "group-3" } as Partial<Group>),
      ];

      store.setGroup(mockGroup);
      store.setGroups(mockGroups);

      store.clearGroups();

      expect(store.getGroup()).toEqual(mockGroup); // single group should remain
      expect(store.getGroups()).toEqual([]); // groups array should be cleared
    });
  });

  // MARK: Edge Cases

  describe("Edge Cases", () => {
    it("clearing images when group is null throws error", () => {
      const store = useGroupStore();
      const mockImages = [createMockContentImage({ id: "img-1" })];

      expect(store.group).toBeNull();
      store.setGroupImages(mockImages);

      // Should throw error when accessing group.id on null.
      expect(() => {
        store.clearGroupImages("group-1");
      }).toThrow();
      expect(store.getGroupImages()).toEqual(mockImages); // images should remain
    });

    it("clearing group when group is null throws error", () => {
      const store = useGroupStore();

      expect(store.group).toBeNull();

      // Should throw error when accessing group.id on null.
      expect(() => {
        store.clearGroup("group-1");
      }).toThrow();
      expect(store.getGroup()).toBeNull();
    });

    it("clearing images when group.id doesn't match should not clear", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];

      store.setGroup(mockGroup);
      store.setGroupImages(mockImages);

      store.clearGroupImages("different-id");
      expect(store.getGroupImages()).toEqual(mockImages);
      expect(store.getGroupImages()).toHaveLength(2);
    });

    it("handles setting empty groups array", () => {
      const store = useGroupStore();
      store.setGroups([createMockGroup()]);
      store.setGroups([]);
      expect(store.groups).toEqual([]);
      expect(store.getGroups()).toHaveLength(0);
    });
    it("handles setting empty images array", () => {
      const store = useGroupStore();
      store.setGroupImages([createMockContentImage()]);
      store.setGroupImages([]);
      expect(store.images).toEqual([]);
      expect(store.getGroupImages()).toHaveLength(0);
    });
  });
});
