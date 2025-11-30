<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    v-if="canDeleteEntity"
    aria-labelledby="icon-delete-label"
    class="cursor-pointer text-action-red focus-brand hover:text-distinct-text"
    data-testid="icon-delete"
  >
    <Icon :name="IconMap.TRASH" size="1.2em" />
    <!-- Note: Buttons need text for a11y. Adding the following for e2e tests. -->
    <span id="icon-delete-label" hidden>Delete</span>
  </button>
</template>

<script setup lang="ts">
const { canDelete } = useUser();
const canDeleteEntity = computed(() => canDelete());
</script>
