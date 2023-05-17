<template>
  <div
    class="flex flex-col items-center w-full h-min card-style sm:items-start"
  >
    <div class="px-1 py-1 sm:px-2 sm:py-2 flex">
      <img class="search-result-image" src="/images/tech-from-below.svg" alt="This is the alt text, please translate"/>
      <div class="py-5 px-8">
        <h2 class="font-bold text-3xl mb-5">{{ name }}</h2>
        <TopicMarker class="mb-5" :topic="organization.topic"></TopicMarker>
        <div class="flex gap-4 mb-4 text-xl" v-if="organization">
          <div>
            <Icon name="bi:map" class="mr-1" />
            {{  organization.location }}</div>
          <div>
            <Icon name="bi:people" class="mr-1" />
            {{  organization.members }} {{ $t('members') }}
          </div>
          <div>
            <Icon name="bi:balloon-heart" class="mr-1" />
            {{  organization.supporters }} {{ $t('supporters') }}
          </div>
        </div>
        <div class="text-xl">
          {{ organization.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '../../types/organization'

defineProps<{
  name: string;
  description: string;
  searchResultType: string; // `organization`, `event`, etc
  private?: boolean;
  mode: 'organization' | 'event' | 'resource'
  organization: Organization
}>();
</script>

<style scoped>
.search-result-image {
  height: 250px;
  width: 250px;
}
</style>
