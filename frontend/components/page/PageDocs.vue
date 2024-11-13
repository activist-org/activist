<template>
  <div
    class="responsive-py-4 responsive-px-5 flex w-full flex-col items-center bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <PageContent
      :imgUrl="imgUrl"
      :imgAltText="imgAltText"
      :includeBreadcrumbs="true"
    >
      <slot />
    </PageContent>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  imgUrl: string;
  imgAltText: string;
}>();
</script>
