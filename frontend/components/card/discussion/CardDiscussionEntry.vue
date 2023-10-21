<template>
  <div
    class="flex flex-col w-full md:flex-row card-style px-3 py-4 md:grow lg:px-5 md:py-3"
  >
    <BtnLabeled
      class="hidden md:flex mt-1 h-min"
      :cta="true"
      :label="discussion.upVoters"
      fontSize="sm"
      leftIcon="bi:arrow-up"
      iconSize="1.25em"
      ariaLabel="components.btn-labeled.upvote-discussion-aria-label"
    />
    <div class="flex-col space-y-3 md:pl-4 lg:pl-6 md:space-y-4 md:grow">
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div class="flex justify-between w-full">
            <h2 class="font-bold responsive-h3 w-full">
              {{ discussion.title }}
            </h2>
            <div class="items-center flex space-x-3 md:hidden md:w-fit">
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
            <BtnLabeled
              class="flex md:hidden mt-1"
              :cta="true"
              :label="discussion.upVoters"
              fontSize="sm"
              leftIcon="bi:arrow-up"
              iconSize="1.25em"
              ariaLabel="components.btn-labeled.upvote-discussion-aria-label"
            />
            <BtnLabeled
              class="flex mt-1"
              :cta="true"
              :label="discussion.category"
              fontSize="sm"
              iconSize="1.25em"
              ariaLabel="components.btn-labeled.check-discussion-category-aria-label"
            />
          </div>
        </div>
        <div
          class="items-center hidden w-full space-x-3 md:flex md:w-fit lg:space-x-5"
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
          class="flex justify-center space-x-3 lg:space-x-4 md:justify-start"
        >
          <a href="/" class="flex items-center">
            <div
              class="flex items-center justify-center border rounded-full border-light-section-div dark:border-dark-section-div bg-light-content dark:bg-dark-content w-8 h-8"
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
import type { Discussion } from "../../../types/discussion";

defineProps<{
  isPrivate?: boolean;
  discussion: Discussion;
}>();
</script>
