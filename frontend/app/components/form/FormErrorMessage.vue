<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <p :id="id" v-if="message" class="error-text" :data-testid="id" role="alert">
    {{ props.message }}
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{ message?: string; id?: string }>();
const id = props.id || "form-error";
</script>
