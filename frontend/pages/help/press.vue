<template>
  <div
    class="bg-light-layer-0 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ $t("_global.press") }}</Title>
    </Head>
    <h1 class="p-4">This will be a press contact page</h1>
  </div>
</template>

<script script setup="ts">
import useRouteToName from "~/composables/useRouteToName";

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);
</script>
