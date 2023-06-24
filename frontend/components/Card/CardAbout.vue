<template>
  <div
    class="relative flex flex-col items-center w-full h-min card-style sm:items-start"
  >
    <div class="bg-slate-400 w-10 h-10 sm:w-16 sm:h-16 absolute right-0 m-3 rounded-md"><img src="" alt=""></div>
    <div class="px-4 py-3 sm:px-2 sm:py-2 w-full">
      <div class="flex justify-start items-center gap-3 mb-3">
        <h3 class="text-left responsive-h3 font-display">About</h3>
        <Icon name="bi:pencil-square" size="1.2em" />
      </div>
      <TopicMarker topic="Housing Community" class="mb-3" />
      <div class="flex items-center gap-3 mb-3">
        <div class="bg-slate-400 w-6 h-6 rounded-md"><img src="#" alt=""></div>
        <p class="font-semibold">Berliner Obdachlosenhilfe</p>
      </div>
      <div class="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
        <div class="flex items-center gap-2">
          <Icon name="bx:bxs-map" size="1.2em" />
          <p>Multiple locations, Berlin</p>
        </div>
        <div class="flex items-center gap-3">
          <Icon name="bi:calendar-plus" size="1.2em" />
          <p>27/10/2022,14:00-23:30</p>
          <Icon name="mdi:account-reactivate" size="1.2em" />
        </div>
      </div>
      <div>
        <p>{{ description }}</p>
        <NuxtLink to="/" class="font-semibold text-blue-600">Click for full text</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  description: string;
  aboutType: "organization" | "event";
}>();
</script>
