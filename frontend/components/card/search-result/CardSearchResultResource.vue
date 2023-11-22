<template>
  <div class="flex flex-col w-full md:flex-row">
    <div class="flex justify-center w-full md:w-fit">
      <div
        class="border rounded-lg w-fit border-light-section-div dark:border-dark-section-div bg-light-content dark:bg-dark-content"
      >
        <img
          v-if="resource.imageURL"
          class="w-[200px] h-[200px]"
          :src="resource.imageURL"
          :alt="
            $t('components.card-search-result-resource.img-alt-text') +
            ' ' +
            resource.name
          "
        />
        <div
          v-else
          class="w-[200px] h-[200px] flex justify-center items-center fill-light-text dark:fill-dark-text"
        >
          <Icon name="IconResource" class="w-[75%] h-[75%]" />
        </div>
      </div>
    </div>
    <div
      class="flex-col pt-3 space-y-3 md:pl-4 lg:pl-6 md:space-y-4 md:grow md:pt-0"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <h2 class="font-bold responsive-h3">
            {{ resource.name }}
          </h2>
          <SearchResultMeatball />
        </div>
        <div class="items-center hidden space-x-3 md:flex lg:space-x-5">
          <MetaTagLocation :location="resource?.relatedLocation" />
          <MetaTagDate :date="resource.creationDate.toLocaleDateString()" />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        <MarkerTopic :topic="resource.topic" />
      </div>
      <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
        <div class="flex items-center justify-center space-x-4 md:hidden">
          <MetaTagLocation :location="resource?.relatedLocation" />
          <MetaTagDate :date="resource.creationDate.toLocaleDateString()" />
        </div>
        <div
          class="flex justify-center space-x-3 lg:space-x-4 md:justify-start"
        >
          <MetaTagOrganization :organization="resource.organizer" />
          <MetaTagStars
            :stars="resource.stars"
            label="components.meta-tag-stars.label"
          />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        {{ resource.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Resource } from "~/types/resource";

defineProps<{
  isPrivate?: boolean;
  resource: Resource;
}>();
</script>
