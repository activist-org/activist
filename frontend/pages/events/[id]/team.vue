<template>
  <p
    class="py-5 text-light-text dark:text-dark-text responsive-px-5 bg-light-content dark:bg-dark-content"
  >
    {{ $t("pages.events.id.team.subheader") }} {{ id }}
  </p>
</template>

<script setup lang="ts">
const { id } = useRoute().params;
</script>
