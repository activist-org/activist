<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div v-if="message" :id="id" class="error-text" :data-testid="id">
    {{ props.message }}
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ message?: string; id?: string }>();
const id = props.id || "form-error";
</script>
