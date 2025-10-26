<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="canDeleteEntity"
    class="cursor-pointer text-action-red hover:text-distinct-text"
    data-testid="icon-delete"
  >
    <Icon :name="IconMap.TRASH" size="1.2em" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const { canDelete } = useUser();
const canDeleteEntity = computed(() => canDelete());
</script>
