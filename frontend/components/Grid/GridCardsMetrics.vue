<template>
  <div
    class="grid gap-6 grid-cols-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4"
  >
    <CardsMetrics
      text="New Organizations"
      textColor="text-white"
      backgroundColor="bg-zinc-900"
      number="10"
      borderColor="border-zinc-900"
    />

    <CardsMetrics
      text="Events"
      textColor="text-black"
      backgroundColor="bg-white"
      number="123"
      borderColor="border-black"
    />

    <CardsMetrics
      text="Act Events"
      textColor="text-red-700"
      backgroundColor="bg-red-200"
      number="100"
      borderColor="border-red-600"
    />

    <CardsMetrics
      text="Learn Events"
      textColor="text-blue-500"
      backgroundColor="bg-blue-100"
      number="23"
      borderColor="border-blue-500"
    />
  </div>
</template>

<script setup lang="ts">
import CardsMetrics from "./CardsMetrics.vue";
</script>
