<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    v-if="canEditEntity"
    :aria-label="$t('i18n.components.icon_edit.aria_label_alt_text')"
    class="cursor-pointer text-primary-text focus-brand hover:text-distinct-text"
    data-testid="icon-edit"
  >
    <Icon :name="IconMap.EDIT" size="1.2em" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  entity?: Entity | null;
}>();

const { canEdit } = useUser();
const canEditEntity = computed(() => canEdit(props?.entity));
</script>
