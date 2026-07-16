// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Unit tests for useEventImageIconMutations composable.
 * @see https://github.com/activist-org/activist/issues/1783
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { useEventImageIconMutations } from "../../../app/composables/mutations/useEventImageIconMutations";
import { createSampleUploadableFile, setupMutationMocks } from "./setup";

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const { showToastError, uploadEventIconImage, invalidateEventCache } =
  vi.hoisted(() => ({
    showToastError: vi.fn(),
    uploadEventIconImage: vi.fn(),
    invalidateEventCache: vi.fn(),
  }));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
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

vi.mock("../../../app/composables/cache/useEventCache", () => ({
  useEventCache: () => ({ invalidateEventCache }),
}));

vi.mock("../../../app/stores/eventList", () => ({
  useEventListStore: () => ({ setItems: vi.fn() }),
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("useEventImageIconMutations", () => {
  const eventId = ref("event-123");

  beforeEach(() => {
    eventId.value = "event-123";
    setupMutationMocks([uploadEventIconImage, invalidateEventCache]);
    showToastError.mockReset();
  });

  describe("uploadIconImage", () => {
    it("calls uploadEventIconImage with eventId and image on success", async () => {
      uploadEventIconImage.mockResolvedValue(undefined);
      const image = createSampleUploadableFile();
      const { uploadIconImage } = useEventImageIconMutations(eventId);

      await uploadIconImage(image);

      expect(uploadEventIconImage).toHaveBeenCalledWith("event-123", image);
    });

    it("calls invalidateEventCache via onSettled on success", async () => {
      uploadEventIconImage.mockResolvedValue(undefined);
      const image = createSampleUploadableFile();
      const { uploadIconImage } = useEventImageIconMutations(eventId);

      await uploadIconImage(image);

      expect(invalidateEventCache).toHaveBeenCalledWith("event-123");
    });

    it("calls handleError (showToastError) via onError when service throws", async () => {
      uploadEventIconImage.mockRejectedValue(new Error("Upload failed"));
      const image = createSampleUploadableFile();
      const { uploadIconImage } = useEventImageIconMutations(eventId);

      await uploadIconImage(image).catch(() => {});

      expect(showToastError).toHaveBeenCalled();
    });
  });

  describe("readonly state", () => {
    it("returns loading and error", () => {
      const { loading, error } = useEventImageIconMutations(eventId);

      expect(loading).toBeDefined();
      expect(error).toBeDefined();
    });
  });
});
