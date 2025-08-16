// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  GET_ACTIVE_IMAGE_URL,
  GET_ORGANIZED_IMAGE_URL,
  GROW_ORGANIZATION_IMAGE_URL,
} from "~/utils/imageURLRegistry.s";

export function useDefaultCarouselImages() {
  const colorMode = useColorMode();
  const imageUrls = ref<string[]>([]);

  const updateImages = () => {
    // ensure that were on the client side
    if (!import.meta.client) return;

    const imageColor = colorMode.value === "light" ? "light" : "dark";

    imageUrls.value = [
      `${GET_ACTIVE_IMAGE_URL}_${imageColor}.png`,
      `${GET_ORGANIZED_IMAGE_URL}_${imageColor}.png`,
      `${GROW_ORGANIZATION_IMAGE_URL}_${imageColor}.png`,
    ];
  };

  // watch for the color mode changes
  watch(
    () => colorMode.value,
    () => {
      updateImages();
    },
    { immediate: false } // avoid ssr issues by not running it immeiately
  );

  // update on client-side mount
  onMounted(() => {
    updateImages();
  });

  return {
    defaultImageUrls: readonly(imageUrls),
  };
}
