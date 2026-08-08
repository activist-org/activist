// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useGroupSocialLinksMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useGroupSocialLinksMutations } from "../../../app/composables/mutations/useGroupSocialLinksMutations";
import { sampleSocialLinkInput, setupMutationMocks } from "./setup";

// MARK: Hoisted Mocks

const {
  updateGroupSocialLink,
  createGroupSocialLinks,
  deleteGroupSocialLink,
  replaceAllGroupSocialLinks,
  invalidateGroupCache,
} = vi.hoisted(() => ({
  updateGroupSocialLink: vi.fn(),
  createGroupSocialLinks: vi.fn(),
  deleteGroupSocialLink: vi.fn(),
  replaceAllGroupSocialLinks: vi.fn(),
  invalidateGroupCache: vi.fn(),
}));

// MARK: Module Mocks

vi.mock("../../../app/services/communities/group/social-link", () => ({
  updateGroupSocialLink: (...args: unknown[]) => updateGroupSocialLink(...args),
  createGroupSocialLinks: (...args: unknown[]) =>
    createGroupSocialLinks(...args),
  deleteGroupSocialLink: (...args: unknown[]) => deleteGroupSocialLink(...args),
  replaceAllGroupSocialLinks: (...args: unknown[]) =>
    replaceAllGroupSocialLinks(...args),
}));

vi.mock("../../../app/composables/cache/useGroupCache", () => ({
  useGroupCache: () => ({ invalidateGroupCache }),
}));

// MARK: Tests

describe("useGroupSocialLinksMutations", () => {
  const groupId = ref("group-123");

  beforeEach(() => {
    groupId.value = "group-123";
    setupMutationMocks([
      updateGroupSocialLink,
      createGroupSocialLinks,
      deleteGroupSocialLink,
      replaceAllGroupSocialLinks,
      invalidateGroupCache,
    ]);
  });

  describe("updateLink", () => {
    it("calls updateGroupSocialLink with linkId and data including group on success", async () => {
      const linkId = "link-1";
      const data = { ...sampleSocialLinkInput };
      const { updateLink } = useGroupSocialLinksMutations(groupId);

      const result = await updateLink(linkId, data);

      expect(updateGroupSocialLink).toHaveBeenCalledWith(
        linkId,
        expect.objectContaining({ ...data, group: "group-123" })
      );
      expect(result).toBe(true);
    });

    it("calls invalidateGroupCache via onSettled on success", async () => {
      const { updateLink } = useGroupSocialLinksMutations(groupId);

      await updateLink("link-1", sampleSocialLinkInput);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("returns false when groupId is empty", async () => {
      groupId.value = "";
      const { updateLink } = useGroupSocialLinksMutations(groupId);

      const result = await updateLink("link-1", sampleSocialLinkInput);

      expect(result).toBe(false);
      expect(updateGroupSocialLink).not.toHaveBeenCalled();
    });

    it("returns false when service throws", async () => {
      updateGroupSocialLink.mockRejectedValue(new Error("Update failed"));
      const { updateLink } = useGroupSocialLinksMutations(groupId);

      const result = await updateLink("link-1", sampleSocialLinkInput);

      expect(result).toBe(false);
    });
  });

  describe("createLinks", () => {
    it("calls createGroupSocialLinks with groupId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      const result = await createLinks(links);

      expect(createGroupSocialLinks).toHaveBeenCalledWith("group-123", links);
      expect(result).toBe(true);
    });

    it("calls invalidateGroupCache via onSettled on success", async () => {
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      await createLinks([sampleSocialLinkInput]);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("returns false when groupId is empty", async () => {
      groupId.value = "";
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      const result = await createLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(createGroupSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false when links is empty", async () => {
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      const result = await createLinks([]);

      expect(result).toBe(false);
      expect(createGroupSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid link data", async () => {
      const badLinks = [{ link: "", label: "Bad", order: 0 }];
      createGroupSocialLinks.mockRejectedValue(new Error("Invalid link data"));
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      const result = await createLinks(badLinks);

      expect(result).toBe(false);
    });
  });

  describe("deleteLink", () => {
    it("calls deleteGroupSocialLink with linkId on success", async () => {
      const linkId = "link-1";
      const { deleteLink } = useGroupSocialLinksMutations(groupId);

      const result = await deleteLink(linkId);

      expect(deleteGroupSocialLink).toHaveBeenCalledWith(linkId);
      expect(result).toBe(true);
    });

    it("calls invalidateGroupCache via onSettled on success", async () => {
      const { deleteLink } = useGroupSocialLinksMutations(groupId);

      await deleteLink("link-1");

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("returns false when service throws", async () => {
      deleteGroupSocialLink.mockRejectedValue(new Error("Delete failed"));
      const { deleteLink } = useGroupSocialLinksMutations(groupId);

      const result = await deleteLink("link-1");

      expect(result).toBe(false);
    });
  });

  describe("replaceAllLinks", () => {
    it("calls replaceAllGroupSocialLinks with groupId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { replaceAllLinks } = useGroupSocialLinksMutations(groupId);

      const result = await replaceAllLinks(links);

      expect(replaceAllGroupSocialLinks).toHaveBeenCalledWith(
        "group-123",
        links
      );
      expect(result).toBe(true);
    });

    it("calls invalidateGroupCache via onSettled on success", async () => {
      const { replaceAllLinks } = useGroupSocialLinksMutations(groupId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("returns false when groupId is empty", async () => {
      groupId.value = "";
      const { replaceAllLinks } = useGroupSocialLinksMutations(groupId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(replaceAllGroupSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false when service throws", async () => {
      replaceAllGroupSocialLinks.mockRejectedValue(new Error("Replace failed"));
      const { replaceAllLinks } = useGroupSocialLinksMutations(groupId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useGroupSocialLinksMutations(groupId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
