// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventImageIconMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventImageIconMutations } from "../../../app/composables/mutations/useEventImageIconMutations";
import { getKeyForGetEvent } from "../../../app/composables/queries/useGetEvent";
import { createSampleUploadableFile, setupMutationMocks } from "./setup";

const { mockRefreshNuxtData, showToastError, uploadEventIconImage } =
  vi.hoisted(() => ({
    mockRefreshNuxtData: vi.fn().mockResolvedValue(undefined),
    showToastError: vi.fn(),
    uploadEventIconImage: vi.fn(),
  }));

vi.mock("../../../app/services/event/image", () => ({
  uploadEventIconImage: (...args: unknown[]) => uploadEventIconImage(...args),
}));

vi.mock("../../../app/composables/generic/useToaster", () => ({
  useToaster: () => ({
    showToastError,
    showToastInfo: vi.fn(),
    showToastSuccess: vi.fn(),
  }),
}));

mockNuxtImport("refreshNuxtData", () => mockRefreshNuxtData);

describe("useEventImageIconMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([mockRefreshNuxtData, uploadEventIconImage]);
  });

  describe("uploadIconImage", () => {
    it("calls uploadEventIconImage with eventId and image on success", async () => {
      const image = createSampleUploadableFile();
      const { uploadIconImage } = useEventImageIconMutations(eventId);

      const result = await uploadIconImage(image);

      expect(uploadEventIconImage).toHaveBeenCalledWith("event-123", image);
      expect(result).toBe(true);
    });

    it("calls refreshNuxtData with getKeyForGetEvent(id) on success", async () => {
      const image = createSampleUploadableFile();
      const { uploadIconImage } = useEventImageIconMutations(eventId);

      await uploadIconImage(image);

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("sets loading true then false", async () => {
      const image = createSampleUploadableFile();
      const { uploadIconImage, loading } = useEventImageIconMutations(eventId);

      const promise = uploadIconImage(image);
      expect(loading.value).toBe(true);
      await promise;
      expect(loading.value).toBe(false);
    });

    it("returns false, sets error, and does not call refreshNuxtData when service throws", async () => {
      uploadEventIconImage.mockRejectedValue(new Error("Upload failed"));
      const image = createSampleUploadableFile();
      const { uploadIconImage, error } = useEventImageIconMutations(eventId);

      const result = await uploadIconImage(image);

      expect(result).toBe(false);
      expect(error.value).not.toBeNull();
      expect(showToastError).toHaveBeenCalled();
      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("refreshEventData", () => {
    it("calls refreshNuxtData with getKeyForGetEvent(id)", async () => {
      const { refreshEventData } = useEventImageIconMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).toHaveBeenCalledWith(
        getKeyForGetEvent("event-123")
      );
    });

    it("no-ops when eventId is empty", async () => {
      eventId.value = "";
      const { refreshEventData } = useEventImageIconMutations(eventId);

      await refreshEventData();

      expect(mockRefreshNuxtData).not.toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns readonly loading and error", () => {
      const { loading, error } = useEventImageIconMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
