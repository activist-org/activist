<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex items-center justify-center space-x-2">
    <div
      v-for="n in 3"
      :key="n"
      class="animate-bounce rounded-full"
      :style="{ animationDelay: `${(n - 1) * 0.2}s` }"
    >
      <img
        v-if="$colorMode.value == 'light'"
        :alt="$t('i18n._global.activist_icon_img_alt_text')"
        class="h-4"
        :src="ACTIVIST_ICON_LIGHT_URL"
      />
      <img
        v-else-if="$colorMode.value == 'dark'"
        :alt="$t('i18n._global.activist_icon_img_alt_text')"
        class="h-4"
        :src="ACTIVIST_ICON_DARK_URL"
      />
    </div>
  </div>
</template>
