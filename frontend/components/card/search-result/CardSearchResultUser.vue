<template>
  <div class="relative flex w-full flex-col md:flex-row">
    <div class="flex w-full justify-center md:w-fit">
      <div
        class="border-light-section-div dark:border-dark-section-div bg-light-layer-0 dark:bg-dark-layer-0 w-fit rounded-full border"
      >
        <div
          :class="{
            'h-[150px] w-[150px]': reduced,
            'h-[200px] w-[200px]': !reduced,
          }"
          class="fill-light-text dark:fill-dark-text flex items-center justify-center"
        >
          <Icon class="h-[75%] w-[75%]" name="bi:person" />
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
            {{ user.name }}
          </h2>
          <MenuSearchResult
            class="max-md:absolute max-md:right-0 max-md:top-0"
            search-result-type="user"
          />
        </div>
        <div
          class="hidden w-full items-center space-x-3 md:flex md:w-fit lg:space-x-5"
        >
          <MetaTagLocation :location="user?.location" />
        </div>
      </div>
      <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
        <div
          class="flex w-full items-center justify-center space-x-3 md:hidden"
        >
          <MetaTagLocation :location="user?.location" />
        </div>
        <div
          class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
        >
          <MetaTagSupporters
            :supporters="user.supporters"
            label="components.meta-tag.supporters_lower"
          />
        </div>
      </div>
      <div class="flex justify-center md:justify-start">
        {{ user.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user";

defineProps<{
  isPrivate?: boolean;
  reduced?: boolean;
  user: User;
}>();
</script>
