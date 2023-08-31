<template>
  <div
    class="border w-fit h-[100%] border-light-section-div dark:border-dark-section-div rounded-lg bg-light-content"
  >
    <img
      v-if="organization.imageURL"
      class="w-[200px] h-[200px]"
      :src="organization.imageURL"
      :alt="'The organization logo of ' + organization.name"
    />
    <div
      v-else
      class="w-[200px] h-[200px] flex justify-center items-center text-light-text dark:text-dark-text"
    >
      <Icon name="IconOrganization" class="w-[75%] h-[75%]" />
    </div>
  </div>
  <div class="px-6 pb-1 space-y-4 md:grow">
    <div class="flex items-center space-x-4">
      <h2 class="font-bold responsive-h3">
        {{ organization.name }}
      </h2>
      <div class="text-light-cta-orange dark:text-dark-cta-orange">
        <Icon name="ph:dots-three-circle-vertical" size="2em" />
      </div>
    </div>
    <TopicMarker :topic="organization.topic" />
    <div class="flex gap-4" v-if="organization">
      <div class="flex items-center gap-1">
        <Icon name="ic:sharp-location-on" class="mr-1" size="1.25em" />
        {{ organization.location }}
      </div>
      <div class="flex items-center gap-1">
        <Icon name="bi:people" class="mr-1" />
        {{ organization.members }}
        {{ $t("components.card-search-result-organization.members") }}
      </div>
      <div class="flex items-center gap-1 fill-light-text dark:fill-dark-text">
        <Icon name="IconSupport" class="mr-1" />
        {{ organization.supporters }}
        {{ $t("components.card-search-result-organization.supporters") }}
      </div>
    </div>
    <div>
      {{ organization.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "../../../types/organization";

defineProps<{
  isPrivate?: boolean;
  organization: Organization;
}>();
</script>
