<template>
  <NuxtLink
    id="btn-roadmap"
    class="style-btn select-none items-center rounded-md px-3 py-[0.35rem] text-base font-semibold"
    :to="localePath('/about/roadmap')"
    :aria-label="$t('components.btn-roadmap.aria-label')"
  >
    {{ $t("_global.roadmap") }}
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
