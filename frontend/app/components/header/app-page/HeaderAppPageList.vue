<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <HeaderAppPage
    :header="header"
    :tagline="tagline"
    :underDevelopment="underDevelopment"
  >
  <div v-if="filters && filters.length" class="flex flex-wrap gap-2 mb-4">
    <Shield
      v-for="option in filters || []"
      :key="option.id"
      @click.stop="() => onClick(option)"
      :active="true"
      class="mobileTopic max-sm:w-full"
      :isSelector="true"
      :label="option.label"
    />
  </div>
    <slot />
  </HeaderAppPage>
</template>

<script setup lang="ts">
const props = defineProps<{
  header?: string;
  tagline?: string;
  underDevelopment?: boolean;
  filters?: {
    id: number | string;
    label: string;
    value: unknown;
  }[];
}>();
const emit = defineEmits<{
  "filter-click": (option: { id: number | string; label: string; value: unknown }) => void;
}>();
const onClick = (option: { id: number | string; label: string; value: unknown }) => {
  emit("filter-click", option);
};
</script>
