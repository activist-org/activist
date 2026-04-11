// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineStore } from "pinia";

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
