<template>
  <NuxtLink
    class="px-3 py-[0.35rem] items-center text-base font-semibold rounded-md select-none style-btn"
    :to="localePath('/about/roadmap')"
    :aria-label="$t('components.btn-roadmap.aria-label')"
  >
    {{ $t("_global.roadmap") }}
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
