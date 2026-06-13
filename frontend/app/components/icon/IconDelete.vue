<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    v-if="canDeleteEntity"
    :aria-label="$t('i18n.components.icon_delete.aria_label_alt_text')"
    class="cursor-pointer text-action-red focus-brand hover:text-distinct-text"
    data-testid="icon-delete"
  >
    <Icon :name="IconMap.TRASH" size="1.2em" />
  </button>
</template>

<script setup lang="ts">
const { canDelete } = useUser();
const canDeleteEntity = computed(() => canDelete());
</script>
