<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <button
    v-if="canEditEntity"
    aria-labelledby="edit-icon-label"
    class="cursor-pointer text-primary-text hover:text-distinct-text"
    data-testid="icon-edit"
  >
    <Icon :name="IconMap.EDIT" size="1.2em" />
    <!-- Note: Buttons need text for a11y. Adding the following for e2e tests. -->
    <span id="edit-icon-label" hidden>Edit</span>
  </button>
</template>

<script setup lang="ts">
import type { Entity } from "~/types/entity";

import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  entity?: Entity | null;
}>();

const { canEdit } = useUser();
const canEditEntity = computed(() => canEdit(props?.entity));
</script>
