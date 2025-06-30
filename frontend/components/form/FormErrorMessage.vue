<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div v-if="message" class="error-text">
    {{ props.message }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ message?: string }>();
</script>
