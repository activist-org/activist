<template>
  <div class="card-style">
    <div
      class="flex items-center justify-center sm:justify-start gap-1 w-full mb-3 px-4 pb-2 pt-6"
    >
      <h1 class="text-4xl font-bold">
        Getting Involved
        <Icon
          name="bi:box-arrow-up-right"
          size="0.5em"
          style="vertical-align: baseline"
        />
      </h1>
    </div>
    <div class="flex flex-col sm:flex-row justify-between items-center px-4">
      <p class="mb-1 text-center sm:text-justify sm:mb-0">The following are working groups within Berliner Obdachlosenhilfe:</p>
      <div class="flex items-center justify-center gap-3">
        <LabeledBtn
          :cta="true"
          label="View all groups"
          linkTo="https://tally.so/r/nprxbq"
          fontSize="sm"
          class=""
        />
        <LabeledBtn
          :cta="true"
          label="Join organisation"
          linkTo="https://tally.so/r/nprxbq"
          fontSize="sm"
        />
      </div>
    </div>
    <div
      class="w-full flex flex-col items-center justify-center sm:flex-row sm:justify-between sm:items-start sm:space-x-3 overflow-x-scroll p-4 mb-4"
    >
      <div v-for="feed in feeds">
        <CardsFeed :title="feed.title" :description="feed.description" class="mb-3 sm:mb-0" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  feeds?: Array<{
    title?: string;
    description?: string;
  }>;
}>();
</script>
