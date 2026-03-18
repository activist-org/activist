// SPDX-License-Identifier: AGPL-3.0-or-later
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import type { ContentImage } from "../../../shared/types/file-type"; // Adjust path if needed

import { createImageStore } from "../../../app/stores/factories/images";

// Mock factory to create images easily
const createMockImage = (overrides?: Partial<ContentImage>): ContentImage =>
  ({
    id: "img-123",
    url: "https://example.com/image.jpg",
    ...overrides,
  }) as ContentImage;

describe("createImageStore Factory", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  // Create a test store using the factory
  const useTestImageStore = createImageStore("test-images");

  describe("Initial State", () => {
    it("initializes with an empty images array", () => {
      const store = useTestImageStore();
      expect(store.images).toEqual([]);
      expect(store.getImages()).toEqual([]);
    });

    it("initializes with a null entityId", () => {
      const store = useTestImageStore();
      expect(store.entityId).toBeNull();
      expect(store.getEntityId()).toBeNull();
    });
  });

  describe("Setters and Getters", () => {
    it("can set and get entityId", () => {
      const store = useTestImageStore();
      store.setEntityId("entity-456");

      expect(store.entityId).toBe("entity-456");
      expect(store.getEntityId()).toBe("entity-456");
    });

    it("can set and get images array", () => {
      const store = useTestImageStore();
      const mockImages = [
        createMockImage({ id: "img-1" }),
        createMockImage({ id: "img-2" }),
      ];

      store.setImages(mockImages);

      expect(store.images).toEqual(mockImages);
      expect(store.getImages()).toEqual(mockImages);
      expect(store.getImages()).toHaveLength(2);
    });
  });

  describe("Actions", () => {
    it("clearImages() empties the images array", () => {
      const store = useTestImageStore();

      store.setImages([createMockImage()]);
      expect(store.getImages()).toHaveLength(1);

      store.clearImages();

      expect(store.images).toEqual([]);
      expect(store.getImages()).toHaveLength(0);
    });

    it("clearImages() does not affect entityId", () => {
      const store = useTestImageStore();

      store.setEntityId("entity-789");
      store.setImages([createMockImage()]);

      store.clearImages();

      expect(store.getImages()).toEqual([]);
      expect(store.getEntityId()).toBe("entity-789");
    });
  });
});
