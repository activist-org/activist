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

      const result = await updateLink(linkId, data);

      expect(updateOrganizationSocialLink).toHaveBeenCalledWith(
        "org-123",
        linkId,
        expect.objectContaining(data)
      );
      expect(result).toBe(true);
    });

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await updateLink("link-1", sampleSocialLinkInput);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await updateLink("link-1", sampleSocialLinkInput);

      expect(result).toBe(false);
      expect(updateOrganizationSocialLink).not.toHaveBeenCalled();
    });

    it("returns false when service throws", async () => {
      updateOrganizationSocialLink.mockRejectedValue(
        new Error("Update failed")
      );
      const { updateLink } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await updateLink("link-1", sampleSocialLinkInput);

      expect(result).toBe(false);
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

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await createLinks([sampleSocialLinkInput]);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
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
      const { createLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await createLinks(badLinks);

      expect(result).toBe(false);
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

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { deleteLink } =
        useOrganizationSocialLinksMutations(organizationId);

      await deleteLink("link-1");

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("returns false when service throws", async () => {
      deleteOrganizationSocialLink.mockRejectedValue(
        new Error("Delete failed")
      );
      const { deleteLink } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await deleteLink("link-1");

      expect(result).toBe(false);
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

    it("calls invalidateOrganizationCache via onSettled on success", async () => {
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(invalidateOrganizationCache).toHaveBeenCalledWith("org-123");
    });

    it("returns false when organizationId is empty", async () => {
      organizationId.value = "";
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(replaceAllOrganizationSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false when service throws", async () => {
      replaceAllOrganizationSocialLinks.mockRejectedValue(
        new Error("Replace failed")
      );
      const { replaceAllLinks } =
        useOrganizationSocialLinksMutations(organizationId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
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
