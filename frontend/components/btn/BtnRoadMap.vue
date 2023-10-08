<template>
  <nuxtlink
    class="px-3 py-[0.35rem] items-center text-base font-semibold rounded-md select-none text-light-text bg-light-content hover:bg-light-highlight active:bg-light-content dark:text-dark-text dark:bg-dark-content dark:hover:bg-dark-highlight dark:active:bg-dark-content focus-brand shadow-sm shadow-zinc-700"
    :to="localePath('/about/roadmap')"
    :aria-label="$t('components.btn-roadmap.aria-label')"
  >
    {{ $t("components.btn-roadmap.label") }}
  </nuxtlink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
