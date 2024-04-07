<template>
  <div class="relative flex w-full flex-col md:flex-row">
    <div class="flex w-full justify-center md:w-fit">
      <div
        class="border-light-section-div dark:border-dark-section-div bg-light-layer-0 dark:bg-dark-layer-0 w-fit rounded-lg border"
      >
        <img
          v-if="resource.imageURL"
          :class="recued ? 'h-[150px] w-[150px]' : 'h-[200px] w-[200px]'"
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
            'h-[150px] w-[150px]': reduced,
            'h-[200px] w-[200px]': !reduced,
          }"
          class="fill-light-text dark:fill-dark-text flex items-center justify-center"
        >
          <Icon name="IconResource" class="h-[75%] w-[75%]" />
        </div>
      </div>
    </div>
    <div
      class="flex-col pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6"
      :class="{
        'space-y-2': reduced,
        'space-y-3 md:space-y-4': !reduced,
      }"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <h2 class="responsive-h3 font-bold">
            {{ resource.name }}
          </h2>
          <MenuSearchResult
            class="max-md:absolute max-md:right-0 max-md:top-0"
            search-result-type="resource"
          />
        </div>
        <div class="hidden items-center space-x-3 md:flex lg:space-x-5">
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
          class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
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
