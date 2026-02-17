// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventSocialLinksMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventSocialLinksMutations } from "../../../app/composables/mutations/useEventSocialLinksMutations";
import { getKeyForGetEvent } from "../../../app/composables/queries/useGetEvent";
import { sampleSocialLinkInput, setupMutationMocks } from "./setup";

const {
  mockRefreshNuxtData,
  showToastError,
  updateEventSocialLink,
  createEventSocialLinks,
  deleteEventSocialLink,
  replaceAllEventSocialLinks,
} = vi.hoisted(() => ({
  mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
  showToastError: vi.fn(),
  updateEventSocialLink: vi.fn(),
  createEventSocialLinks: vi.fn(),
  deleteEventSocialLink: vi.fn(),
  replaceAllEventSocialLinks: vi.fn(),
}));

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

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useEventSocialLinksMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([
      mockRefreshNuxtData,
      updateEventSocialLink,
      createEventSocialLinks,
      deleteEventSocialLink,
      replaceAllEventSocialLinks,
    ]);
  });

  describe("updateLink", () => {
    it("calls updateEventSocialLink with eventId, linkId and data on success", async () => {
      const linkId = "link-1";
      const data = { ...sampleSocialLinkInput };
      const { updateLink } = useEventSocialLinksMutations(eventId);

      const result = await updateLink(linkId, data);

      expect(updateEventSocialLink).toHaveBeenCalledWith(
        "event-123",
        linkId,
        expect.objectContaining(data)
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { updateLink } = useEventSocialLinksMutations(eventId);

      await updateLink("link-1", sampleSocialLinkInput);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("sets loading true then false", async () => {
      const { updateLink, loading } = useEventSocialLinksMutations(eventId);

      const promise = updateLink("link-1", sampleSocialLinkInput);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false when eventId is empty", async () => {
      eventId.value = "";
      const { updateLink } = useEventSocialLinksMutations(eventId);

      const result = await updateLink("link-1", sampleSocialLinkInput);

      expect(result).toBe(false);
      expect(updateEventSocialLink).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      updateEventSocialLink.mockRejectedValue(new Error("Update failed"));
      const { updateLink, error } = useEventSocialLinksMutations(eventId);

      const result = await updateLink("link-1", sampleSocialLinkInput);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("createLinks", () => {
    it("calls createEventSocialLinks with eventId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { createLinks } = useEventSocialLinksMutations(eventId);

      const result = await createLinks(links);

      expect(createEventSocialLinks).toHaveBeenCalledWith("event-123", links);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { createLinks } = useEventSocialLinksMutations(eventId);

      await createLinks([sampleSocialLinkInput]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false when eventId is empty", async () => {
      eventId.value = "";
      const { createLinks } = useEventSocialLinksMutations(eventId);

      const result = await createLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(createEventSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false when links is empty", async () => {
      const { createLinks } = useEventSocialLinksMutations(eventId);

      const result = await createLinks([]);

      expect(result).toBe(false);
      expect(createEventSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false when service rejects invalid link data", async () => {
      const badLinks = [{ link: "", label: "Bad", order: 0 }];
      createEventSocialLinks.mockRejectedValue(new Error("Invalid link data"));
      const { createLinks, error } = useEventSocialLinksMutations(eventId);

      const result = await createLinks(badLinks);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      createEventSocialLinks.mockRejectedValue(new Error("Create failed"));
      const { createLinks, error } = useEventSocialLinksMutations(eventId);

      const result = await createLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("deleteLink", () => {
    it("calls deleteEventSocialLink with linkId on success", async () => {
      const linkId = "link-1";
      const { deleteLink } = useEventSocialLinksMutations(eventId);

      const result = await deleteLink(linkId);

      expect(deleteEventSocialLink).toHaveBeenCalledWith(linkId);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { deleteLink } = useEventSocialLinksMutations(eventId);

      await deleteLink("link-1");

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      deleteEventSocialLink.mockRejectedValue(new Error("Delete failed"));
      const { deleteLink, error } = useEventSocialLinksMutations(eventId);

      const result = await deleteLink("link-1");

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("replaceAllLinks", () => {
    it("calls replaceAllEventSocialLinks with eventId and links on success", async () => {
      const links = [sampleSocialLinkInput];
      const { replaceAllLinks } = useEventSocialLinksMutations(eventId);

      const result = await replaceAllLinks(links);

      expect(replaceAllEventSocialLinks).toHaveBeenCalledWith(
        "event-123",
        links
      );
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData on success", async () => {
      const { replaceAllLinks } = useEventSocialLinksMutations(eventId);

      await replaceAllLinks([sampleSocialLinkInput]);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("returns false when eventId is empty", async () => {
      eventId.value = "";
      const { replaceAllLinks } = useEventSocialLinksMutations(eventId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(replaceAllEventSocialLinks).not.toHaveBeenCalled();
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      replaceAllEventSocialLinks.mockRejectedValue(new Error("Replace failed"));
      const { replaceAllLinks, error } = useEventSocialLinksMutations(eventId);

      const result = await replaceAllLinks([sampleSocialLinkInput]);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshEventData", () => {
    it("calls refreshNuxtData with getKeyForGetEvent(id)", async () => {
      const { refreshEventData } = useEventSocialLinksMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("no-ops when eventId is empty", async () => {
      eventId.value = "";
      const { refreshEventData } = useEventSocialLinksMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useEventSocialLinksMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
