<template>
  <div class="flex flex-col w-full md:flex-row">
    <div class="flex justify-center w-full md:w-fit">
      <div
        class="border rounded-lg w-fit border-light-section-div dark:border-dark-section-div bg-light-content"
      >
        <img
          v-if="organization.imageURL"
          class="w-[200px] h-[200px]"
          :src="organization.imageURL"
          :alt="
            $t('components.card-search-result-organization.img-alt-text') +
            ' ' +
            organization.name
          "
        />
        <div
          v-else
          class="w-[200px] h-[200px] flex justify-center items-center text-light-text dark:text-dark-text"
        >
          <Icon name="IconOrganization" class="w-[75%] h-[75%]" />
        </div>
      </div>
    </div>
    <div
      class="flex-col pt-3 space-y-3 md:pl-4 lg:pl-6 md:space-y-4 md:grow md:pt-0"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <h2 class="font-bold responsive-h3">
            {{ organization.name }}
          </h2>
          <div class="text-light-cta-orange dark:text-dark-cta-orange">
            <Icon name="ph:dots-three-circle-vertical" size="1.75em" />
          </div>
        </div>
        <div class="items-center hidden space-x-3 md:flex lg:space-x-5">
          <MetaTagLocation :location="organization.location" />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        <MarkerTopic :topic="organization.topic" />
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
            label="components.meta-tag-members.label"
          />
          <MetaTagSupporters
            :supporters="organization.supporters"
            label="components.meta-tag-supporters.label"
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
import type { Organization } from "../../../types/organization";

defineProps<{
  isPrivate?: boolean;
  organization: Organization;
}>();
</script>
