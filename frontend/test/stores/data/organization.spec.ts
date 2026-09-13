// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { Organization } from "../../../shared/types/organization";

import {
  useOrganizationImageStore,
  useOrganizationStore,
} from "../../../app/stores/data/organization";
import {
  createMockContentImage,
  createMockOrganization,
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
      const imageStore = useOrganizationImageStore();

      const mockOrg = createMockOrganization({
        id: "org-1",
      } as Partial<Organization>);
      const mockImages = [createMockContentImage({ id: "img-1" })];

      coreStore.setOrganization(mockOrg);
      imageStore.setImages(mockImages);

      // Verify independence
      expect(coreStore.getOrganization().id).toBe("org-1");
      expect(imageStore.getImages()).toHaveLength(1);

      // Clear images shouldn't touch core or list stores.
      imageStore.clearImages();
      expect(imageStore.getImages()).toHaveLength(0);
      expect(coreStore.getOrganization()).not.toBeNull();
    });
  });
});
