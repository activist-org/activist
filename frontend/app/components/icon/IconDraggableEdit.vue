<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="canEditEntity"
    class="cursor-grab text-primary-text hover:text-distinct-text"
    data-testid="icon-edit-draggable"
  >
    <Icon :name="IconMap.GRIP" :size="size ?? '1.2em'" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  entity?: Entity | null;
  size?: string | number;
}>();
const { canEdit } = useUser();
const canEditEntity = computed(() => canEdit(props?.entity));
</script>
