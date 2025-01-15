<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="responsive-py-4 responsive-px-5 flex w-full flex-col items-center bg-layer-0 text-primary-text"
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
