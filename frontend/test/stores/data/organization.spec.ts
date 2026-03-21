// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { Organization } from "../../../shared/types/organization";

import {
  useOrganizationImageStore,
  useOrganizationListStore,
  useOrganizationStore,
} from "../../../app/stores/data/organization";
import {
  createMockContentImage,
  createMockOrganization,
  createMockOrganizationFilters,
} from "../../mocks/factories";

describe("Organization Stores", () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test to ensure isolation.
    setActivePinia(createPinia());
  });

  // MARK: Core Entity Store (useOrganizationStore)

  describe("useOrganizationStore", () => {
    it("initializes with null organization", () => {
      const store = useOrganizationStore();
      expect(store.organization).toBeNull();
    });

    it("setOrganization updates organization state", () => {
      const store = useOrganizationStore();
      const mockOrg = createMockOrganization({
        id: "org-1",
      } as Partial<Organization>);
      store.setOrganization(mockOrg);
      expect(store.organization).toEqual(mockOrg);
    });

    it("getOrganization returns current organization", () => {
      const store = useOrganizationStore();
      const mockOrg = createMockOrganization({
        id: "org-1",
        name: "Test Organization",
      } as Partial<Organization>);
      store.setOrganization(mockOrg);
      expect(store.getOrganization()).toEqual(mockOrg);
      expect(store.getOrganization().id).toBe("org-1");
    });
  });

  // MARK: List Store (useOrganizationListStore)

  describe("useOrganizationListStore (Pagination Factory)", () => {
    describe("Initial State", () => {
      it("initializes with empty items array", () => {
        const store = useOrganizationListStore();
        expect(store.items).toEqual([]);
      });

      it("initializes with empty filters object", () => {
        const store = useOrganizationListStore();
        expect(store.filters).toEqual({});
      });

      it("initializes with page 1", () => {
        const store = useOrganizationListStore();
        expect(store.page).toBe(1);
      });
    });

    describe("Actions", () => {
      it("getItems and setItems manage the list properly", () => {
        const store = useOrganizationListStore();
        const mockOrgs = [
          createMockOrganization({ id: "org-1" } as Partial<Organization>),
          createMockOrganization({ id: "org-2" } as Partial<Organization>),
        ];
        store.setItems(mockOrgs);
        expect(store.items).toEqual(mockOrgs);
        expect(store.getItems()).toHaveLength(2);
      });

      it("getFilters and setFilters manage filter state", () => {
        const store = useOrganizationListStore();
        const mockFilters = createMockOrganizationFilters({ name: "Test Org" });
        store.setFilters(mockFilters);
        expect(store.filters).toEqual(mockFilters);
        expect(store.getFilters()).toEqual(mockFilters);
      });

      it("getPage and setPage manage pagination", () => {
        const store = useOrganizationListStore();
        store.setPage(5);
        expect(store.page).toBe(5);
        expect(store.getPage()).toBe(5);
      });

      it("clear resets items, filters, and page", () => {
        const store = useOrganizationListStore();
        store.setItems([createMockOrganization()]);
        store.setFilters(createMockOrganizationFilters({ name: "Test" }));
        store.setPage(5);

        store.clear();

        expect(store.items).toEqual([]);
        expect(store.filters).toEqual({});
        expect(store.page).toBe(1);
      });
    });

    describe("Edge Cases", () => {
      it("clamps page to 1 when setting to 0", () => {
        const store = useOrganizationListStore();
        store.setPage(5);
        store.setPage(0);
        expect(store.page).toBe(1);
        expect(store.getPage()).toBe(1);
      });

      it("clamps page to 1 when setting to negative number", () => {
        const store = useOrganizationListStore();
        store.setPage(-1);
        expect(store.page).toBe(1);
        expect(store.getPage()).toBe(1);
      });
    });
  });

  // MARK: Images Store (useOrganizationImageStore)

  describe("useOrganizationImageStore (Image Factory)", () => {
    it("initializes with empty images array", () => {
      const store = useOrganizationImageStore();
      expect(store.images).toEqual([]);
    });

    it("getImages and setImages manage image state", () => {
      const store = useOrganizationImageStore();
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];
      store.setImages(mockImages);
      expect(store.images).toEqual(mockImages);
      expect(store.getImages()).toHaveLength(2);
    });

    it("clearImages sets images to empty array regardless of current state", () => {
      const store = useOrganizationImageStore();

      // Clear when already empty.
      store.clearImages();
      expect(store.images).toEqual([]);

      // Clear when populated.
      const mockImages = [createMockContentImage({ id: "img-1" })];
      store.setImages(mockImages);
      expect(store.getImages()).toHaveLength(1);

      store.clearImages();
      expect(store.images).toEqual([]);
      expect(store.getImages()).toHaveLength(0);
    });
  });

  // MARK: Integration sanity checks across separated stores

  describe("Cross-store Independence", () => {
    it("updates in one store do not affect the others", () => {
      const coreStore = useOrganizationStore();
      const listStore = useOrganizationListStore();
      const imageStore = useOrganizationImageStore();

      const mockOrg = createMockOrganization({
        id: "org-1",
      } as Partial<Organization>);
      const mockImages = [createMockContentImage({ id: "img-1" })];

      coreStore.setOrganization(mockOrg);
      listStore.setPage(5);
      imageStore.setImages(mockImages);

      // Verify independence
      expect(coreStore.getOrganization().id).toBe("org-1");
      expect(listStore.getPage()).toBe(5);
      expect(imageStore.getImages()).toHaveLength(1);

      // Clear images shouldn't touch core or list stores.
      imageStore.clearImages();
      expect(imageStore.getImages()).toHaveLength(0);
      expect(coreStore.getOrganization()).not.toBeNull();
      expect(listStore.getPage()).toBe(5);
    });
  });
});
