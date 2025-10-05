<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    id="btn-roadmap"
    class="style-btn select-none items-center rounded-md px-3 py-[0.35rem] text-base font-semibold"
    to="https://docs.activist.org/activist/product/about/roadmap"
    :aria-label="$t('i18n.components.btn_road_map.aria_label')"
  >
    {{ $t("i18n.components._global.roadmap") }}
  </NuxtLink>
</template>
