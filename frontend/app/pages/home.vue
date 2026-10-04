<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLayout name="home">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  // The home page only shows content for signed-in users (supported
  // organizations and events, which require an account to support).
  // Redirect signed-out visitors to the sign-in page.
  // @see https://github.com/activist-org/activist/issues/2430
  middleware: ["userOnly"],
});
</script>
