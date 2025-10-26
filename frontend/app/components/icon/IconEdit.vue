<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="canEditEntity"
    class="cursor-pointer text-primary-text hover:text-distinct-text"
    data-testid="icon-edit"
  >
    <Icon :name="IconMap.EDIT" size="1.2em" />
  </div>
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
