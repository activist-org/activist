<template>
  <div class="px-6 py-5 card-style">
    <div class="relative flex-col w-full gap-5">
      <div
        class="bg-light-header dark:bg-dark-header border-2 border-light-section-div dark:border-dark-section-div w-10 h-10 sm:w-16 sm:h-16 absolute right-0 rounded-md flex justify-center items-center text-light-text dark:text-dark-text"
      >
        <Icon name="bi:qr-code-scan" size="3em" alt="QR code scanning icon" />
      </div>
      <div>
        <div class="flex items-center gap-5 mb-3">
          <h3 class="text-left responsive-h3 font-display">About</h3>
          <Icon name="bi:pencil-square" size="1.2em" />
        </div>
        <div v-if="aboutType === 'event'">
          <TopicMarker topic="Housing Community" class="mb-3" />
          <div class="flex items-center gap-3 mb-3">
            <div class="w-6 h-6 flex justify-center items-center rounded-md">
              <Icon name="IconOrganization" size="1.75em" />
            </div>
            <p class="font-semibold">Berliner Obdachlosenhilfe</p>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-8 mb-3">
            <div class="flex items-center gap-2">
              <Icon name="bx:bxs-map" size="1.2em" />
              <p>Multiple locations, Berlin</p>
            </div>
            <div class="flex items-center gap-3">
              <Icon name="bi:calendar-plus" size="1.2em" />
              <p>27/10/2022, 14:00-23:30</p>
            </div>
          </div>
          <div>
            <p class="line-clamp-1 sm:line-clamp-none">{{ description }}</p>
            <NuxtLink to="/" class="font-semibold text-blue-600"
              >Click for full text</NuxtLink
            >
          </div>
        </div>
        <div v-if="aboutType === 'organization'">
          <div class="flex flex-col sm:items-center gap-5 sm:flex-row mb-3">
            <TopicMarker topic="Housing and Community" class="" />
            <div class="flex items-center gap-2">
              <Icon name="bx:bxs-map" size="1.2em" />
              <p>Berlin, Germany</p>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="bi:people" size="1.2em" />
              <p>123 members</p>
            </div>
          </div>
          <div>
            <p class="line-clamp-1 sm:line-clamp-none">{{ description }}</p>
            <NuxtLink to="/" class="font-semibold text-blue-600 sm:hidden"
              >Click for full text</NuxtLink
            >
          </div>
        </div>
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
