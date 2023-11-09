<template>
  <div
    class="flex flex-col px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <p>{{ $t("pages.events.id.resources.subheader") }} {{ id }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;
</script>
