<template>
  <div class="flex flex-col w-full md:flex-row">
    <div class="flex justify-center w-full md:w-fit">
      <div
        class="border rounded-full w-fit border-light-section-div dark:border-dark-section-div bg-light-content dark:bg-dark-content"
      >
        <div
          class="w-[200px] h-[200px] flex justify-center items-center fill-light-text dark:fill-dark-text"
        >
          <Icon name="bi:person" class="w-[75%] h-[75%]" />
        </div>
      </div>
    </div>
    <div
      class="flex-col pt-3 md:pl-4 lg:pl-6 space-y-3 md:space-y-4 md:grow md:pt-0"
    >
      <div class="flex flex-col justify-between md:flex-row">
        <div class="flex items-center justify-center space-x-2 md:space-x-4">
          <h2 class="font-bold responsive-h3">
            {{ user.name }}
          </h2>
          <div class="text-light-cta-orange dark:text-dark-cta-orange">
            <Icon name="ph:dots-three-circle-vertical" size="1.75em" />
          </div>
        </div>
        <div
          class="items-center hidden w-full md:flex md:w-fit space-x-3 lg:space-x-5"
        >
          <MetaTagLocation :location="user?.location" />
        </div>
      </div>
      <div class="flex flex-col md:flex-row space-y-3 md:space-y-0">
        <div
          class="flex items-center justify-center w-full md:hidden space-x-3"
        >
          <MetaTagLocation :location="user?.location" />
        </div>
        <div
          class="flex justify-center space-x-3 lg:space-x-4 md:justify-start"
        >
          <MetaTagSupporters
            :supporters="user.supporters"
            :label="$t('components.meta-tag-supporters.label')"
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
import type { User } from "../../../types/user";

defineProps<{
  isPrivate?: boolean;
  user: User;
}>();
</script>
