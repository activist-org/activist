// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useOrganizationSocialLinksMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useOrganizationSocialLinksMutations } from "../../../app/composables/mutations/useOrganizationSocialLinksMutations";
import { sampleSocialLinkInput, setupMutationMocks } from "./setup";

// MARK: Hoisted Mocks

const {
  updateOrganizationSocialLink,
  createOrganizationSocialLinks,
  deleteOrganizationSocialLink,
  replaceAllOrganizationSocialLinks,
  invalidateOrganizationCache,
} = vi.hoisted(() => ({
  updateOrganizationSocialLink: vi.fn(),
  createOrganizationSocialLinks: vi.fn(),
  deleteOrganizationSocialLink: vi.fn(),
  replaceAllOrganizationSocialLinks: vi.fn(),
  invalidateOrganizationCache: vi.fn(),
}));

// MARK: Module Mocks

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

vi.mock("../../../app/composables/cache/useOrganizationCache", () => ({
  useOrganizationCache: () => ({ invalidateOrganizationCache }),
}));

// MARK: Tests

describe("useOrganizationSocialLinksMutations", () => {
  const organizationId = ref("org-123");

  beforeEach(() => {
    organizationId.value = "org-123";
    setupMutationMocks([
      updateOrganizationSocialLink,
      createOrganizationSocialLinks,
      deleteOrganizationSocialLink,
      replaceAllOrganizationSocialLinks,
      invalidateOrganizationCache,
    ]);
  });

  describe("updateLink", () => {
    it("calls updateOrganizationSocialLink with organizationId, linkId and data on success", async () => {
      const linkId = "link-1";
      const data = { ...sampleSocialLinkInput };
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await updateLink({ id: linkId, ...data });

      expect(updateOrganizationSocialLink).toHaveBeenCalledWith(
        "org-123",
        linkId,
        expect.objectContaining(data)
      );
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await updateLink("link-1", sampleSocialLinkInput);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("does not call updateOrganizationSocialLink when organizationId is empty", async () => {
      organizationId.value = "";
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await updateLink("link-1", sampleSocialLinkInput);

      expect(updateOrganizationSocialLink).not.toHaveBeenCalled();
    });

    it("throws error and does not invalidate cache when service throws", async () => {
      updateOrganizationSocialLink.mockRejectedValue(
        new Error("Update failed")
      );
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await expect(updateLink("link-1", sampleSocialLinkInput)).rejects.toThrow(
        "Update failed"
      );

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("createLinks", () => {
    it("calls createOrganizationSocialLinks with organizationId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await createLinks(links);

      expect(createOrganizationSocialLinks).toHaveBeenCalledWith(
        "org-123",
        links
      );
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await createLinks([sampleSocialLinkInput]);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("does not call createOrganizationSocialLinks when organizationId is empty", async () => {
      organizationId.value = "";
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await createLinks([sampleSocialLinkInput]);

      expect(createOrganizationSocialLinks).not.toHaveBeenCalled();
    });

    it("does not call createOrganizationSocialLinks with empty links array", async () => {
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await createLinks([]);

      expect(createOrganizationSocialLinks).not.toHaveBeenCalled();
    });

    it("throws error when service rejects invalid link data", async () => {
      const badLinks = [{ link: "", label: "Bad", order: 0 }];
      createOrganizationSocialLinks.mockRejectedValue(
        new Error("Invalid link data")
      );
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await expect(createLinks(badLinks)).rejects.toThrow(
        "Invalid link data"
      );
    });
  });

  describe("deleteLink", () => {
    it("calls deleteOrganizationSocialLink with linkId on success", async () => {
      const linkId = "link-1";
      const { deleteLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await deleteLink(linkId);

      expect(deleteOrganizationSocialLink).toHaveBeenCalledWith(linkId);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { deleteLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await deleteLink("link-1");

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("throws error and does not invalidate cache when service throws", async () => {
      deleteOrganizationSocialLink.mockRejectedValue(
        new Error("Delete failed")
      );
      const { deleteLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await expect(deleteLink("link-1")).rejects.toThrow("Delete failed");

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
    });
  });

  describe("replaceAllLinks", () => {
    it("calls replaceAllOrganizationSocialLinks with organizationId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await replaceAllLinks(links);

      expect(replaceAllOrganizationSocialLinks).toHaveBeenCalledWith(
        "org-123",
        links
      );
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("does not call replaceAllOrganizationSocialLinks when organizationId is empty", async () => {
      organizationId.value = "";
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(replaceAllOrganizationSocialLinks).not.toHaveBeenCalled();
    });

    it("throws error and does not invalidate cache when service throws", async () => {
      replaceAllOrganizationSocialLinks.mockRejectedValue(
        new Error("Replace failed")
      );
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await expect(replaceAllLinks([sampleSocialLinkInput])).rejects.toThrow(
        "Replace failed"
      );

      expect(invalidateOrganizationCache).not.toHaveBeenCalled();
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
