// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationSocialLinksMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationSocialLinksMutations } from "../../../app/composables/mutations/useOrganizationSocialLinksMutations";
import { getKeyForGetOrganization } from "../../../app/composables/queries/useGetOrganization";
import { sampleSocialLinkInput, setupMutationMocks } from "./setup";

const {
  mockRefreshNuxtData,
  showToastError,
  updateOrganizationSocialLink,
  createOrganizationSocialLinks,
  deleteOrganizationSocialLink,
  replaceAllOrganizationSocialLinks,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  updateOrganizationSocialLink: vi.fn(),
  createOrganizationSocialLinks: vi.fn(),
  deleteOrganizationSocialLink: vi.fn(),
  replaceAllOrganizationSocialLinks: vi.fn(),
}));

vi.mock("../../../app/services/communities/organization/social-link", () => ({
  updateOrganizationSocialLink: (...args: unknown[]) =>
    updateOrganizationSocialLink(...args),
  createOrganizationSocialLinks: (...args: unknown[]) =>
    createOrganizationSocialLinks(...args),
  deleteOrganizationSocialLink: (...args: unknown[]) =>
    deleteOrganizationSocialLink(...args),
  replaceAllOrganizationSocialLinks: (...args: unknown[]) =>
    replaceAllOrganizationSocialLinks(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useOrganizationSocialLinksMutations", () => {
  const organizationId = ref("org-123");

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      updateOrganizationSocialLink,
      createOrganizationSocialLinks,
      deleteOrganizationSocialLink,
      replaceAllOrganizationSocialLinks,
    ]);
  });

  describe("updateLink", () => {
    it("calls updateOrganizationSocialLink with organizationId, linkId and data on success", async () => {
      const linkId = "link-1";
      const data = { ...sampleSocialLinkInput };
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await updateLink(linkId, data);

      expect(updateOrganizationSocialLink).toHaveBeenCalledWith(
        "org-123",
        linkId,
        expect.objectContaining(data)
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await updateLink("link-1", sampleSocialLinkInput);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("sets loading true then false", async () => {
      const { updateLink, loading } =
        useOrganizationSocialLinksMutations(organizationId);

      const promise = updateLink("link-1", sampleSocialLinkInput);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await updateLink("link-1", sampleSocialLinkInput);

      expect(result).toBe(false);
      expect(updateOrganizationSocialLink).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateOrganizationSocialLink.mockRejectedValue(
        new Error("Update failed")
      );
      const { updateLink, error } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await updateLink("link-1", sampleSocialLinkInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("createLinks", () => {
    it("calls createOrganizationSocialLinks with organizationId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await createLinks(links);

      expect(createOrganizationSocialLinks).toHaveBeenCalledWith(
        "org-123",
        links
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await createLinks([sampleSocialLinkInput]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await createLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(createOrganizationSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false when links is empty", async () => {
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await createLinks([]);

      expect(result).toBe(false);
      expect(createOrganizationSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid link data", async () => {
      const badLinks = [{ link: "", label: "Bad", order: 0 }];
      createOrganizationSocialLinks.mockRejectedValue(
        new Error("Invalid link data")
      );
      const { createLinks, error } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await createLinks(badLinks);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      createOrganizationSocialLinks.mockRejectedValue(
        new Error("Create failed")
      );
      const { createLinks, error } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await createLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("deleteLink", () => {
    it("calls deleteOrganizationSocialLink with linkId on success", async () => {
      const linkId = "link-1";
      const { deleteLink } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await deleteLink(linkId);

      expect(deleteOrganizationSocialLink).toHaveBeenCalledWith(linkId);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { deleteLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await deleteLink("link-1");

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      deleteOrganizationSocialLink.mockRejectedValue(
        new Error("Delete failed")
      );
      const { deleteLink, error } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await deleteLink("link-1");

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("replaceAllLinks", () => {
    it("calls replaceAllOrganizationSocialLinks with organizationId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await replaceAllLinks(links);

      expect(replaceAllOrganizationSocialLinks).toHaveBeenCalledWith(
        "org-123",
        links
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(replaceAllOrganizationSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      replaceAllOrganizationSocialLinks.mockRejectedValue(
        new Error("Replace failed")
      );
      const { replaceAllLinks, error } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshOrganizationData", () => {
    it("calls refreshNuxtData with getKeyForGetOrganization(id)", async () => {
      const { refreshOrganizationData } =
        useOrganizationSocialLinksMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetOrganization("org-123")
      );
    });

    it("no-ops when organizationId is empty", async () => {
      organizationId.value = "";
      const { refreshOrganizationData } =
        useOrganizationSocialLinksMutations(organizationId);

      await refreshOrganizationData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } =
        useOrganizationSocialLinksMutations(organizationId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
