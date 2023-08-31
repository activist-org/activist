<template>
  <div
    class="border w-fit h-[100%] border-light-section-div dark:border-dark-section-div rounded-full bg-light-content dark:bg-dark-content"
  >
    <div
      class="w-[200px] h-[200px] flex justify-center items-center fill-light-text dark:fill-dark-text"
    >
      <Icon name="bi:person" class="w-[75%] h-[75%]" />
    </div>
  </div>
  <div class="px-6 pb-1 space-y-4 md:grow">
    <div class="flex justify-between">
      <div class="flex items-center space-x-4">
        <h2 class="font-bold responsive-h3">
          {{ user.name }}
        </h2>
        <div class="text-light-cta-orange dark:text-dark-cta-orange">
          <Icon name="ph:dots-three-circle-vertical" size="2em" />
        </div>
      </div>
    </div>
    <div class="flex gap-4" v-if="user">
      <div class="flex items-center gap-1" v-if="user.location">
        <Icon name="ic:sharp-location-on" class="mr-1" size="1.25em" />
        {{ user.location }}
      </div>
      <div class="flex items-center gap-1">
        <Icon name="bi:people" class="mr-1" />
        {{ user.supporters }} supporters
      </div>
    </div>
    <div>
      {{ user.description }}
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
