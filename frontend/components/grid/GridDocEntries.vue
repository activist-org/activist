<template>
  <div class="grid h-fit w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-8">
    <CardDocsEntry
      v-for="card in cards"
      :key="card.id"
      :url="route.path.replace(/\/$/, '') + '/' + card.url"
      :imgURL="card.imgURL"
      :imgDimensions="card.imgDimensions"
      :imgAltText="card.imgAltText"
      :title="card.title"
      :description="card.description"
    />
  </div>
</template>

<script setup lang="ts">
import type { DocsEntry } from "~/types/card-docs-entry";

defineProps<{
  cards?: DocsEntry[];
}>();

const route = useRoute();
</script>
