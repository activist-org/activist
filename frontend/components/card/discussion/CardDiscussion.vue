<template>
  <div
    class="card-style flex w-full flex-col px-3 py-4 md:grow md:flex-row md:py-3 lg:px-5"
  >
    <BtnAction
      v-if="aboveMediumBP"
      class="mt-1 flex h-min"
      :cta="true"
      :counter="discussion.upVoters.length"
      fontSize="sm"
      :leftIcon="IconMap.ARROW_UP"
      iconSize="1.25em"
      ariaLabel="components.btn-action.upvote-discussion-aria-label"
    />
    <div class="flex-col space-y-3 md:grow md:space-y-4 md:pl-4 lg:pl-6">
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div class="flex w-full justify-between">
            <h2 class="responsive-h3 w-full font-bold">
              {{ discussion.title }}
            </h2>
            <div
              v-if="!aboveMediumBP"
              class="flex items-center space-x-3 md:w-fit"
            >
              <MetaTagMembers :members="discussion.participants.length" />
              <MetaTag
                :iconName="IconMap.CHAT"
                :value="String(discussion.messages)"
              />
            </div>
          </div>
          <div class="flex space-x-2">
            <BtnAction
              v-if="!aboveMediumBP"
              class="mt-1 flex"
              :cta="true"
              :label="`${discussion.upVoters}`"
              fontSize="sm"
              :leftIcon="IconMap.ARROW_UP"
              iconSize="1.25em"
              ariaLabel="components.btn-action.upvote-discussion-aria-label"
            />
            <BtnAction
              class="mt-1 flex"
              :cta="true"
              :label="discussion.category"
              fontSize="sm"
              iconSize="1.25em"
              ariaLabel="components.btn-action.filter-discussion-category-aria-label"
            />
          </div>
        </div>
        <div
          v-if="aboveMediumBP"
          class="flex w-full items-center space-x-3 md:w-fit lg:space-x-5"
        >
          <MetaTagMembers :members="discussion.participants.length" />
          <MetaTag
            :iconName="IconMap.CHAT"
            :value="String(discussion.messages)"
          />
        </div>
      </div>
      <div class="flex">
        <div
          class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
        >
          <NuxtLink to="/" class="flex items-center">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full border border-light-section-div bg-light-layer-0 dark:border-dark-section-div dark:bg-dark-layer-0"
            >
              <Icon :name="IconMap.PERSON" size="1.5em" />
            </div>
            <p class="ml-2">{{ discussion.createdBy.user_name }}</p>
          </NuxtLink>
          <div class="ml-2 flex items-center">
            <MetaTagDate :date="new Date().toISOString().slice(0, 10)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useBreakpoint from "~/composables/useBreakpoint";
import type { Discussion } from "~/types/content/discussion";
import { IconMap } from "~/types/icon-map";

defineProps<{
  isPrivate?: boolean;
  discussion: Discussion;
}>();

const aboveMediumBP = useBreakpoint("md");
</script>
