<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <a
    class="card-style h-70 flex w-full items-center justify-center bg-layer-2"
    :href="link"
    rel="noopener noreferrer"
    target="_blank"
  >
    <div
      class="rounded-full bg-distinct-text p-6 dark:bg-menu-selection md:p-8"
    >
      <Icon
        :color="$colorMode.value === 'dark' ? 'white' : 'black'"
        :name="IconMap.GLOBE"
        size="75px"
      />
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{ link: string }>();
</script>
