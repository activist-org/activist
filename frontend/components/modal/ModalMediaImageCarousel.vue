<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <MediaImageCarousel :fullscreen="true" />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalMediaImage";
</script>
