<template>
  <div class="flex flex-col w-full md:flex-row relative">
    <div class="flex justify-center w-full md:w-fit">
      <div
        class="border rounded-lg w-fit border-light-section-div dark:border-dark-section-div bg-light-content dark:bg-dark-content"
      >
        <img
          v-if="resource.imageURL"
          :class="recued ? 'w-[150px] h-[150px]' : 'w-[200px] h-[200px]'"
          :src="resource.imageURL"
          :alt="
            $t('components.card-search-result-resource.img-alt-text') +
            ' ' +
            resource.name
          "
        />
        <div
          v-else
          :class="{
            'w-[150px] h-[150px]': reduced,
            'w-[200px] h-[200px]': !reduced,
          }"
          class="flex justify-center items-center fill-light-text dark:fill-dark-text"
        >
          <Icon name="IconResource" class="w-[75%] h-[75%]" />
        </div>
      </div>
    </div>
    <div
      class="flex-col pt-3 md:pl-4 lg:pl-6 md:grow md:pt-0"
      :class="{
        'space-y-2': reduced,
        'space-y-3 md:space-y-4': !reduced,
      }"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <h2 class="font-bold responsive-h3">
            {{ resource.name }}
          </h2>
          <MenuSearchResult search-result-type="resource" />
        </div>
        <div class="items-center hidden space-x-3 md:flex lg:space-x-5">
          <MetaTagLocation :location="resource?.relatedLocation" />
          <MetaTagDate :date="resource.creationDate.toLocaleDateString()" />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        <ShieldTopic v-if="!reduced" :topic="resource.topic" />
      </div>
      <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
        <div class="flex items-center justify-center space-x-4 md:hidden">
          <MetaTagLocation :location="resource?.relatedLocation" />
          <MetaTagDate :date="resource.creationDate.toLocaleDateString()" />
        </div>
        <div
          class="flex justify-center space-x-3 lg:space-x-4 md:justify-start"
        >
          <MetaTagOrganization :organizations="[resource.organization]" />
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
  reduced?: boolean;
  resource: Resource;
}>();
</script>
