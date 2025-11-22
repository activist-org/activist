<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="cursor-pointer text-primary-text hover:text-distinct-text"
    v-bind="$attrs"
  >
    <Icon :name="IconMap.X_LG" size="1.2em" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>
