<template>
  <div class="relative flex flex-col w-full md:flex-row">
    <div class="flex justify-center w-full md:w-fit">
      <div
        class="border w-fit border-light-section-div dark:border-dark-section-div bg-light-layer-0 dark:bg-dark-layer-0"
        :class="{
          'rounded-lg': organization.imageURL,
          'rounded-3xl': !organization.imageURL,
        }"
      >
        <img
          v-if="organization.imageURL"
          :class="{
            'w-[150px] h-[150px]': reduced,
            'w-[200px] h-[200px]': !reduced,
          }"
          :src="organization.imageURL"
          :alt="
            $t('components.card-search-result-organization.img-alt-text') +
            ' ' +
            organization.name
          "
        />
        <div
          v-else
          :class="{
            'w-[150px] h-[150px]': reduced,
            'w-[200px] h-[200px]': !reduced,
          }"
          class="flex items-center justify-center text-light-text dark:text-dark-text"
        >
          <Icon name="IconOrganization" class="w-[100%] h-[100%]" />
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
            {{ organization.name }}
          </h2>
          <MenuSearchResult
            class="max-md:absolute max-md:top-0 max-md:right-0"
            search-result-type="organization"
          />
        </div>
        <div class="items-center hidden space-x-3 md:flex lg:space-x-5">
          <MetaTagLocation :location="organization.location" />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        <ShieldTopic v-if="!reduced" :topic="organization.topic" />
      </div>
      <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
        <div class="flex items-center justify-center space-x-4 md:hidden">
          <MetaTagLocation :location="organization.location" />
        </div>
        <div
          class="flex justify-center space-x-3 lg:space-x-4 md:justify-start"
        >
          <MetaTagMembers
            :members="organization.members"
            label="components._global.members"
          />
          <MetaTagSupporters
            :supporters="organization.supporters"
            label="components.meta-tag.supporters_lower"
          />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        {{ organization.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/organization";

defineProps<{
  organization: Organization;
  reduced?: boolean;
}>();
</script>
