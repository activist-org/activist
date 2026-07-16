// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventSocialLinksMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventSocialLinksMutations } from "../../../app/composables/mutations/useEventSocialLinksMutations";
import { sampleSocialLinkInput, setupMutationMocks } from "./setup";

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const {
  showToastError,
  updateEventSocialLink,
  createEventSocialLinks,
  deleteEventSocialLink,
  replaceAllEventSocialLinks,
  invalidateEventCache,
} = vi.hoisted(() => ({
  showToastError: vi.fn(),
  updateEventSocialLink: vi.fn(),
  createEventSocialLinks: vi.fn(),
  deleteEventSocialLink: vi.fn(),
  replaceAllEventSocialLinks: vi.fn(),
  invalidateEventCache: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
vi.mock("../../../app/services/event/social-link", () => ({
  updateEventSocialLink: (...args: unknown[]) => updateEventSocialLink(...args),
  createEventSocialLinks: (...args: unknown[]) =>
    createEventSocialLinks(...args),
  deleteEventSocialLink: (...args: unknown[]) => deleteEventSocialLink(...args),
  replaceAllEventSocialLinks: (...args: unknown[]) =>
    replaceAllEventSocialLinks(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

vi.mock("../../../app/composables/cache/useEventCache", () => ({
  useEventCache: () => ({ invalidateEventCache }),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("useEventSocialLinksMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([
      updateEventSocialLink,
      createEventSocialLinks,
      deleteEventSocialLink,
      replaceAllEventSocialLinks,
      invalidateEventCache,
    ]);
    showToastError.mockReset();
  });

  // ---------------------------------------------------------------------------
  describe("updateLink", () => {
    it("calls updateEventSocialLink with eventId, linkId and data on success", async () => {
      updateEventSocialLink.mockResolvedValue(true);
      const { updateLink } = useEventSocialLinksMutations(eventId);

      await updateLink({ id: "link-1", ...sampleSocialLinkInput });

      expect(updateEventSocialLink).toHaveBeenCalledWith(
        "event-123",
        "link-1",
        expect.objectContaining(sampleSocialLinkInput)
      );
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      updateEventSocialLink.mockResolvedValue(true);
      const { updateLink } = useEventSocialLinksMutations(eventId);

      await updateLink({ id: "link-1", ...sampleSocialLinkInput });

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("returns null when eventId is empty", async () => {
      eventId.value = "";
      const { updateLink } = useEventSocialLinksMutations(eventId);

      const result = await updateLink({
        id: "link-1",
        ...sampleSocialLinkInput,
      });

      expect(result).toBeNull();
      expect(updateEventSocialLink).not.toHaveBeenCalled();
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      updateEventSocialLink.mockRejectedValue(new Error("Update failed"));
      const { updateLink } = useEventSocialLinksMutations(eventId);

      await updateLink({ id: "link-1", ...sampleSocialLinkInput }).catch(
        () => {}
      );

      expect(showToastError).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  describe("createLinks", () => {
    it("calls createEventSocialLinks with eventId and links on success", async () => {
      createEventSocialLinks.mockResolvedValue(true);
      const { createLinks } = useEventSocialLinksMutations(eventId);

      await createLinks([sampleSocialLinkInput]);

      expect(createEventSocialLinks).toHaveBeenCalledWith("event-123", [
        sampleSocialLinkInput,
      ]);
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      createEventSocialLinks.mockResolvedValue(true);
      const { createLinks } = useEventSocialLinksMutations(eventId);

      await createLinks([sampleSocialLinkInput]);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("returns null when eventId is empty", async () => {
      eventId.value = "";
      const { createLinks } = useEventSocialLinksMutations(eventId);

      const result = await createLinks([sampleSocialLinkInput]);

      expect(result).toBeNull();
      expect(createEventSocialLinks).not.toHaveBeenCalled();
    });

    it("returns null when links is empty", async () => {
      const { createLinks } = useEventSocialLinksMutations(eventId);

      const result = await createLinks([]);

      expect(result).toBeNull();
      expect(createEventSocialLinks).not.toHaveBeenCalled();
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      createEventSocialLinks.mockRejectedValue(new Error("Create failed"));
      const { createLinks } = useEventSocialLinksMutations(eventId);

      await createLinks([sampleSocialLinkInput]).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  describe("deleteLink", () => {
    it("calls deleteEventSocialLink with linkId on success", async () => {
      deleteEventSocialLink.mockResolvedValue(true);
      const { deleteLink } = useEventSocialLinksMutations(eventId);

      await deleteLink("link-1");

      expect(deleteEventSocialLink).toHaveBeenCalledWith("link-1");
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      deleteEventSocialLink.mockResolvedValue(true);
      const { deleteLink } = useEventSocialLinksMutations(eventId);

      await deleteLink("link-1");

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      deleteEventSocialLink.mockRejectedValue(new Error("Delete failed"));
      const { deleteLink } = useEventSocialLinksMutations(eventId);

      await deleteLink("link-1").catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  describe("replaceAllLinks", () => {
    it("calls replaceAllEventSocialLinks with eventId and links on success", async () => {
      replaceAllEventSocialLinks.mockResolvedValue(true);
      const { replaceAllLinks } = useEventSocialLinksMutations(eventId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(replaceAllEventSocialLinks).toHaveBeenCalledWith("event-123", [
        sampleSocialLinkInput,
      ]);
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      replaceAllEventSocialLinks.mockResolvedValue(true);
      const { replaceAllLinks } = useEventSocialLinksMutations(eventId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("returns null when eventId is empty", async () => {
      eventId.value = "";
      const { replaceAllLinks } = useEventSocialLinksMutations(eventId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBeNull();
      expect(replaceAllEventSocialLinks).not.toHaveBeenCalled();
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      replaceAllEventSocialLinks.mockRejectedValue(new Error("Replace failed"));
      const { replaceAllLinks } = useEventSocialLinksMutations(eventId);

      await replaceAllLinks([sampleSocialLinkInput]).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  describe("readonly state", () => {
    it("returns loading and error", () => {
      const { loading, error } = useEventSocialLinksMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
