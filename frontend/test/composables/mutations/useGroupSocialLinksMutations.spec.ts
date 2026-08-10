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
      const linkData = { id: "link-1", ...sampleSocialLinkInput };
      const { updateLink } = useGroupSocialLinksMutations(groupId);

      await updateLink(linkData);

      expect(updateGroupSocialLink).toHaveBeenCalledWith(
        "link-1",
        expect.objectContaining({
          link: sampleSocialLinkInput.link,
          label: sampleSocialLinkInput.label,
          order: sampleSocialLinkInput.order,
          group: "group-123",
        })
      );
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { updateLink } = useGroupSocialLinksMutations(groupId);

      await updateLink({ id: "link-1", ...sampleSocialLinkInput });

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("returns null and does not call updateGroupSocialLink when groupId is empty", async () => {
      groupId.value = "";
      const { updateLink } = useGroupSocialLinksMutations(groupId);

      const result = await updateLink({
        id: "link-1",
        ...sampleSocialLinkInput,
      });

      expect(result).toBeNull();
      expect(updateGroupSocialLink).not.toHaveBeenCalled();
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      updateGroupSocialLink.mockRejectedValue(new Error("Update failed"));
      const { updateLink } = useGroupSocialLinksMutations(groupId);

      await expect(
        updateLink({ id: "link-1", ...sampleSocialLinkInput })
      ).rejects.toThrow("Update failed");

      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("createLinks", () => {
    it("calls createGroupSocialLinks with groupId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      await createLinks(links);

      expect(createGroupSocialLinks).toHaveBeenCalledWith("group-123", links);
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      await createLinks([sampleSocialLinkInput]);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("returns null and does not call createGroupSocialLinks when groupId is empty", async () => {
      groupId.value = "";
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      const result = await createLinks([sampleSocialLinkInput]);

      expect(result).toBeNull();
      expect(createGroupSocialLinks).not.toHaveBeenCalled();
    });

    it("returns null and does not call createGroupSocialLinks when links array is empty", async () => {
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      const result = await createLinks([]);

      expect(result).toBeNull();
      expect(createGroupSocialLinks).not.toHaveBeenCalled();
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      createGroupSocialLinks.mockRejectedValue(new Error("Invalid link data"));
      const { createLinks } = useGroupSocialLinksMutations(groupId);

      await expect(
        createLinks([{ link: "", label: "Bad", order: 0 } as never])
      ).rejects.toThrow("Invalid link data");

      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("deleteLink", () => {
    it("calls deleteGroupSocialLink with linkId on success", async () => {
      const linkId = "link-1";
      const { deleteLink } = useGroupSocialLinksMutations(groupId);

      await deleteLink(linkId);

      expect(deleteGroupSocialLink).toHaveBeenCalledWith(linkId);
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { deleteLink } = useGroupSocialLinksMutations(groupId);

      await deleteLink("link-1");

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      deleteGroupSocialLink.mockRejectedValue(new Error("Delete failed"));
      const { deleteLink } = useGroupSocialLinksMutations(groupId);

      await expect(deleteLink("link-1")).rejects.toThrow("Delete failed");

      expect(invalidateGroupCache).not.toHaveBeenCalled();
    });
  });

  describe("replaceAllLinks", () => {
    it("calls replaceAllGroupSocialLinks with groupId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { replaceAllLinks } = useGroupSocialLinksMutations(groupId);

      await replaceAllLinks(links);

      expect(replaceAllGroupSocialLinks).toHaveBeenCalledWith(
        "group-123",
        links
      );
    });

    it("calls invalidateGroupCache via onSuccess on success", async () => {
      const { replaceAllLinks } = useGroupSocialLinksMutations(groupId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(invalidateGroupCache).toHaveBeenCalledWith("group-123");
    });

    it("returns null and does not call replaceAllGroupSocialLinks when groupId is empty", async () => {
      groupId.value = "";
      const { replaceAllLinks } = useGroupSocialLinksMutations(groupId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBeNull();
      expect(replaceAllGroupSocialLinks).not.toHaveBeenCalled();
    });

    it("rejects and does not invalidate cache when service throws", async () => {
      replaceAllGroupSocialLinks.mockRejectedValue(new Error("Replace failed"));
      const { replaceAllLinks } = useGroupSocialLinksMutations(groupId);

      await expect(replaceAllLinks([sampleSocialLinkInput])).rejects.toThrow(
        "Replace failed"
      );

      expect(invalidateGroupCache).not.toHaveBeenCalled();
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
