<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    v-if="canDeleteEntity"
    class="cursor-pointer text-action-red hover:text-distinct-text"
    data-testid="icon-delete"
    type="button"
  >
    <Icon :name="IconMap.TRASH" size="1.2em" />
  </button>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const { canDelete } = useUser();
const canDeleteEntity = computed(() => canDelete());
</script>
