<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="cursor-pointer text-primary-text hover:text-action-red"
    data-testid="icon-delete"
    v-bind="$attrs"
  >
    <Icon :name="IconMap.TRASH" size="1.2em" />
  </div>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

defineOptions({
  inheritAttrs: false,
});
</script>
