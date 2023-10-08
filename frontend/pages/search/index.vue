<template>
  <div
    class="px-4 xl:px-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ $t("pages.search.index.title") }}</title>
    </head>
    <headerapppage
      :header="$t('pages.search.index.header')"
      :tagline="$t('pages.search.index.subheader')"
    >
      <div class="flex flex-col space-x-3 sm:flex-row">
        <topicmarker topic="my topics dropdown" />
      </div>
    </headerapppage>
    <gridsearchtags :tags="['berlin', 'activism', 'eco']" class="mt-3" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});
</script>
