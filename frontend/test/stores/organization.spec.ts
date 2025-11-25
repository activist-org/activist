// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { Organization } from "../../shared/types/organization";

import { useOrganizationStore } from "../../app/stores/organization";
import {
  createMockContentImage,
  createMockOrganization,
  createMockOrganizationFilters,
} from "./helpers";

describe("useOrganizationStore", () => {
  beforeEach(() => {
    // Create fresh Pinia instance for each test to ensure isolation
    setActivePinia(createPinia());
  });

  // MARK: Initial State
  describe("Initial State", () => {
    it("initializes with null organization", () => {
      const store = useOrganizationStore();
      expect(store.organization).toBeNull();
    });

    it("initializes with empty organizations array", () => {
      const store = useOrganizationStore();
      expect(store.organizations).toEqual([]);
    });

    it("initializes with empty images array", () => {
      const store = useOrganizationStore();
      expect(store.images).toEqual([]);
    });

    it("initializes with empty filters object", () => {
      const store = useOrganizationStore();
      expect(store.filters).toEqual({});
    });

    it("initializes with page 0", () => {
      const store = useOrganizationStore();
      expect(store.page).toBe(0);
    });
  });

  // MARK: Getter Actions
  describe("Getter Actions", () => {
    it("getOrganization returns current organization", () => {
      const store = useOrganizationStore();
      const mockOrg = createMockOrganization({
        id: "org-1",
      } as Partial<Organization>);
      store.setOrganization(mockOrg);
      expect(store.getOrganization()).toEqual(mockOrg);
    });

    it("getOrganizations returns current organizations array", () => {
      const store = useOrganizationStore();
      const mockOrgs = [
        createMockOrganization({ id: "org-1" } as Partial<Organization>),
      ];
      store.setOrganizations(mockOrgs);
      expect(store.getOrganizations()).toEqual(mockOrgs);
    });

    it("getImages returns current images array", () => {
      const store = useOrganizationStore();
      const mockImages = [createMockContentImage({ id: "img-1" })];
      store.setImages(mockImages);
      expect(store.getImages()).toEqual(mockImages);
    });

    it("getFilters returns current filters", () => {
      const store = useOrganizationStore();
      const mockFilters = createMockOrganizationFilters({ name: "Test Org" });
      store.setFilters(mockFilters);
      expect(store.getFilters()).toEqual(mockFilters);
    });

    it("getPage returns current page number", () => {
      const store = useOrganizationStore();
      store.setPage(5);
      expect(store.getPage()).toBe(5);
    });
  });

  // MARK: Setter Actions
  describe("Setter Actions", () => {
    it("setOrganization updates organization state", () => {
      const store = useOrganizationStore();
      const mockOrg = createMockOrganization({
        id: "org-1",
      } as Partial<Organization>);
      store.setOrganization(mockOrg);
      expect(store.organization).toEqual(mockOrg);
    });

    it("setOrganizations updates organizations array", () => {
      const store = useOrganizationStore();
      const mockOrgs = [
        createMockOrganization({ id: "org-1" } as Partial<Organization>),
        createMockOrganization({ id: "org-2" } as Partial<Organization>),
      ];
      store.setOrganizations(mockOrgs);
      expect(store.organizations).toEqual(mockOrgs);
      expect(store.organizations).toHaveLength(2);
    });

    it("setImages updates images array", () => {
      const store = useOrganizationStore();
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];
      store.setImages(mockImages);
      expect(store.images).toEqual(mockImages);
      expect(store.images).toHaveLength(2);
    });

    it("setFilters updates filters object", () => {
      const store = useOrganizationStore();
      const mockFilters = createMockOrganizationFilters({ name: "Test" });
      store.setFilters(mockFilters);
      expect(store.filters).toEqual(mockFilters);
    });

    it("setPage updates page number", () => {
      const store = useOrganizationStore();
      store.setPage(10);
      expect(store.page).toBe(10);
    });
  });

  // MARK: Special Actions
  describe("Special Actions", () => {
    it("clearImages sets images to empty array", () => {
      const store = useOrganizationStore();
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];
      store.setImages(mockImages);
      store.clearImages();
      expect(store.images).toEqual([]);
      expect(store.getImages()).toHaveLength(0);
    });

    it("clearImages clears images regardless of current state", () => {
      const store = useOrganizationStore();
      // Clear when already empty
      store.clearImages();
      expect(store.images).toEqual([]);

      // Clear when populated
      store.setImages([createMockContentImage()]);
      store.clearImages();
      expect(store.images).toEqual([]);
    });
  });

  // MARK: Integration Tests
  describe("Integration Tests", () => {
    it("setting organization then getting it returns the same organization", () => {
      const store = useOrganizationStore();
      const mockOrg = createMockOrganization({
        id: "org-1",
        name: "Test Organization",
      } as Partial<Organization>);
      store.setOrganization(mockOrg);
      expect(store.getOrganization()).toEqual(mockOrg);
      expect(store.getOrganization().id).toBe("org-1");
    });

    it("setting images then clearing them results in empty array", () => {
      const store = useOrganizationStore();
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];
      store.setImages(mockImages);
      expect(store.getImages()).toHaveLength(2);
      store.clearImages();
      expect(store.getImages()).toEqual([]);
      expect(store.getImages()).toHaveLength(0);
    });

    it("setting filters doesn't affect images array", () => {
      const store = useOrganizationStore();
      const mockImages = [createMockContentImage({ id: "img-1" })];
      const mockFilters = createMockOrganizationFilters({ name: "Test" });

      store.setImages(mockImages);
      store.setFilters(mockFilters);

      expect(store.getImages()).toEqual(mockImages);
      expect(store.getFilters()).toEqual(mockFilters);
    });

    it("setting page doesn't affect organization", () => {
      const store = useOrganizationStore();
      const mockOrg = createMockOrganization({
        id: "org-1",
      } as Partial<Organization>);

      store.setOrganization(mockOrg);
      store.setPage(5);

      expect(store.getOrganization()).toEqual(mockOrg);
      expect(store.getPage()).toBe(5);
    });

    it("can set images independently of organization", () => {
      const store = useOrganizationStore();
      const mockOrg = createMockOrganization({
        id: "org-1",
      } as Partial<Organization>);
      const mockImages = [
        createMockContentImage({ id: "img-1" }),
        createMockContentImage({ id: "img-2" }),
      ];

      store.setOrganization(mockOrg);
      store.setImages(mockImages);

      expect(store.getOrganization()).toEqual(mockOrg);
      expect(store.getImages()).toEqual(mockImages);
      expect(store.organization.id).toBe("org-1");
      expect(store.images).toHaveLength(2);
    });
  });

  // MARK: Edge Cases
  describe("Edge Cases", () => {
    it("handles setting empty organizations array", () => {
      const store = useOrganizationStore();
      store.setOrganizations([createMockOrganization()]);
      store.setOrganizations([]);
      expect(store.organizations).toEqual([]);
      expect(store.getOrganizations()).toHaveLength(0);
    });

    it("handles setting empty images array", () => {
      const store = useOrganizationStore();
      store.setImages([createMockContentImage()]);
      store.setImages([]);
      expect(store.images).toEqual([]);
      expect(store.getImages()).toHaveLength(0);
    });

    it("handles clearing images when array is already empty", () => {
      const store = useOrganizationStore();
      expect(store.images).toEqual([]);
      store.clearImages();
      expect(store.images).toEqual([]);
      expect(store.getImages()).toHaveLength(0);
    });
    it("can set page to 0", () => {
      const store = useOrganizationStore();
      store.setPage(5);
      store.setPage(0);
      expect(store.page).toBe(0);
      expect(store.getPage()).toBe(0);
    });
  });
});
