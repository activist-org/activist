<template>
  <div
    class="responsive-py-4 responsive-px-5 text-primary-text bg-layer-0 flex w-full flex-col items-center"
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
