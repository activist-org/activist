<template>
  <div
    class="card-style flex w-full flex-col px-3 py-4 md:grow md:flex-row md:py-3 lg:px-5"
  >
    <BtnAction
      class="mt-1 hidden h-min md:flex"
      :cta="true"
      :counter="discussion.upVoters"
      fontSize="sm"
      leftIcon="bi:arrow-up"
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
            <div class="flex items-center space-x-3 md:hidden md:w-fit">
              <MetaTagMembers
                :members="discussion.participants"
                :label="label"
              />
              <MetaTag
                iconName="bi:chat-left"
                :value="String(discussion.messages)"
                :label="label"
              />
            </div>
          </div>
          <div class="flex space-x-2">
            <BtnAction
              class="mt-1 flex md:hidden"
              :cta="true"
              :label="discussion.upVoters"
              fontSize="sm"
              leftIcon="bi:arrow-up"
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
          class="hidden w-full items-center space-x-3 md:flex md:w-fit lg:space-x-5"
        >
          <MetaTagMembers :members="discussion.participants" :label="label" />
          <MetaTag
            iconName="bi:chat-left"
            :value="String(discussion.messages)"
            :label="label"
          />
        </div>
      </div>
      <div class="flex">
        <div
          class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
        >
          <a href="/" class="flex items-center">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full border border-light-section-div bg-light-layer-0 dark:border-dark-section-div dark:bg-dark-layer-0"
            >
              <Icon name="bi:person" size="1.5em" />
            </div>
            <p class="ml-2">{{ discussion.author }}</p>
          </a>
          <div class="ml-2 flex items-center">
            <MetaTagDate :date="event?.date.toLocaleDateString()" />
            <p class="mt-0.8 ml-1">
              {{ discussion.creationDate.toLocaleDateString() }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DiscussionEntry } from "~/types/card-discussion-entry";

defineProps<{
  isPrivate?: boolean;
  discussion: DiscussionEntry;
}>();
</script>
