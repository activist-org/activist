<template>
  <div class="w-full text-light-text dark:text-dark-text">
    <ProgressBar type="default" :progress="1" :start="1" :end="1" />
    <div class="flex flex-col px-4 xl:px-8">
      <PageBreadcrumbs class="mt-2" :breadcrumbs="breadcrumbs" />
      <div class="mt-4">
        <h1 class="font-bold responsive-h2">
          {{ $t("pages._global.information") }}
        </h1>
      </div>
      <div class="w-1/2 pt-3 pb-6 space-y-6 md:pt-4">
        <CardDatePicker />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "sidebar",
});
</script>
