<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div v-show="loading" class="flex items-center justify-center">
    <div class="loading-pulse py-12 lg:py-36">
      <img
        v-if="colorMode.value == 'light'"
        :alt="t('i18n._global.activist_icon_img_alt_text')"
        class="h-40"
        :src="activistIconLightUrl"
      />
      <img
        v-else-if="colorMode.value == 'dark'"
        :alt="t('i18n._global.activist_icon_img_alt_text')"
        class="h-40"
        :src="activistIconDarkUrl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const colorMode = useColorMode();
const activistIconLightUrl = ACTIVIST_ICON_LIGHT_URL;
const activistIconDarkUrl = ACTIVIST_ICON_DARK_URL;
defineProps<{
  loading?: boolean;
}>();
</script>
