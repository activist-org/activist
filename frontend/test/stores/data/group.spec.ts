// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { Group } from "../../../shared/types/group";

import {
  useGroupImageStore,
  useGroupListStore,
  useGroupStore,
} from "../../../app/stores/data/group";
import {
  createMockContentImage,
  createMockGroup,
  createMockGroupFilters,
} from "../../mocks/factories";

describe("Group Stores", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // MARK: Core Entity Store (useGroupStore)

  describe("useGroupStore", () => {
    it("initializes with null group", () => {
      const store = useGroupStore();
      expect(store.group).toBeNull();
    });

    it("setGroup updates group state", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      store.setGroup(mockGroup);
      expect(store.group).toEqual(mockGroup);
    });

    it("getGroup returns current group", () => {
      const store = useGroupStore();
      const mockGroup = createMockGroup({
        id: "group-1",
        name: "Test Group",
      } as Partial<Group>);
      store.setGroup(mockGroup);
      expect(store.getGroup()).toEqual(mockGroup);
      expect(store.getGroup().id).toBe("group-1");
    });
  });

  // MARK: List Store (useGroupListStore)

  describe("useGroupListStore (Pagination Factory)", () => {
    describe("Initial State", () => {
      it("initializes with empty items array", () => {
        const store = useGroupListStore();
        expect(store.items).toEqual([]);
      });

      it("initializes with empty filters object", () => {
        const store = useGroupListStore();
        expect(store.filters).toEqual({});
      });

      it("initializes with page 1", () => {
        const store = useGroupListStore();
        expect(store.page).toBe(1);
      });
    });

    describe("Actions", () => {
      it("getItems and setItems manage the list properly", () => {
        const store = useGroupListStore();
        const mockGroups = [
          createMockGroup({ id: "group-1" } as Partial<Group>),
          createMockGroup({ id: "group-2" } as Partial<Group>),
        ];
        store.setItems(mockGroups);
        expect(store.items).toEqual(mockGroups);
        expect(store.getItems()).toHaveLength(2);
      });

      it("getFilters and setFilters manage filter state", () => {
        const store = useGroupListStore();
        const mockFilters = createMockGroupFilters({ name: "Test Group" });
        store.setFilters(mockFilters);
        expect(store.filters).toEqual(mockFilters);
        expect(store.getFilters()).toEqual(mockFilters);
      });

      it("getPage and setPage manage pagination", () => {
        const store = useGroupListStore();
        store.setPage(5);
        expect(store.page).toBe(5);
        expect(store.getPage()).toBe(5);
      });

      it("clear resets items, filters, and page", () => {
        const store = useGroupListStore();
        store.setItems([createMockGroup()]);
        store.setFilters(createMockGroupFilters({ name: "Test" }));
        store.setPage(5);

        store.clear();

        expect(store.items).toEqual([]);
        expect(store.filters).toEqual({});
        expect(store.page).toBe(1);
      });
    });

    describe("Edge Cases", () => {
      it("clamps page to 1 when setting to 0", () => {
        const store = useGroupListStore();
        store.setPage(5);
        store.setPage(0);
        expect(store.page).toBe(1);
        expect(store.getPage()).toBe(1);
      });

      it("clamps page to 1 when setting to negative number", () => {
        const store = useGroupListStore();
        store.setPage(-1);
        expect(store.page).toBe(1);
        expect(store.getPage()).toBe(1);
      });
    });
  });

  // MARK: Images Store (useGroupImageStore)

  describe("useGroupImageStore (Image Factory)", () => {
    it("initializes with empty images array", () => {
      const store = useGroupImageStore();
      expect(store.images).toEqual([]);
    });

    it("getImages and setImages manage image state", () => {
      const store = useGroupImageStore();
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];
      store.setImages(mockImages);
      expect(store.images).toEqual(mockImages);
      expect(store.getImages()).toHaveLength(2);
    });

    it("clearImages sets images to empty array regardless of current state", () => {
      const store = useGroupImageStore();

      store.clearImages();
      expect(store.images).toEqual([]);

      store.setImages([createMockContentImage({ id: "img-1" })]);
      expect(store.getImages()).toHaveLength(1);

      store.clearImages();
      expect(store.images).toEqual([]);
      expect(store.getImages()).toHaveLength(0);
    });
  });

  // MARK: Integration Checks

  describe("Cross-store Independence", () => {
    it("updates in one store do not affect the others", () => {
      const coreStore = useGroupStore();
      const listStore = useGroupListStore();
      const imageStore = useGroupImageStore();

      const mockGroup = createMockGroup({ id: "group-1" } as Partial<Group>);
      const mockImages = [createMockContentImage({ id: "img-1" })];

      coreStore.setGroup(mockGroup);
      listStore.setPage(3);
      imageStore.setImages(mockImages);

      expect(coreStore.getGroup().id).toBe("group-1");
      expect(listStore.getPage()).toBe(3);
      expect(imageStore.getImages()).toHaveLength(1);

      imageStore.clearImages();
      expect(imageStore.getImages()).toHaveLength(0);
      expect(coreStore.getGroup()).not.toBeNull();
      expect(listStore.getPage()).toBe(3);
    });
  });
});
