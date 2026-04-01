// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

/**
 * Factory function to create an image store with a unique ID, allowing for multiple independent image states across the application.
 * @param id - A unique string identifier for the image store, used to differentiate it from other stores created by this factory.
 * @returns A Pinia store instance with state and actions for managing images and their associated entity ID, including methods to get, set, and clear images.
 */
export function createImageStore(id: string) {
  return defineStore(id, {
    state: () => ({
      images: [] as ContentImage[],
      entityId: null as string | null,
    }),
    actions: {
      getEntityId() {
        return this.entityId;
      },
      setEntityId(id: string) {
        this.entityId = id;
      },
      getImages() {
        return this.images;
      },
      setImages(images: ContentImage[]) {
        this.images = images;
      },
      clearImages() {
        this.images = [];
      },
    },
  });
}
