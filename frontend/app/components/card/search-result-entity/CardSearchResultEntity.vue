<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style flex flex-col justify-center px-3 py-4 md:grow md:flex-row md:justify-start md:py-3 lg:px-5"
  >
    <div class="relative flex w-full flex-col md:flex-row">
      <div class="flex w-full justify-center md:w-fit">
        <NuxtLink :aria-label="$t(ariaLabel)" :to="localePath(linkUrl)">
          <div class="h-min w-max rounded-md border border-section-div">
            <slot :imageAlt="imageAlt" :imageUrl="imageUrl" name="image">
              <img
                v-if="imageUrl"
                :alt="imageAlt"
                class="rounded-md"
                :class="imageSizeClass"
                :src="imageUrl"
              />
              <div
                v-else
                class="flex items-center justify-center text-primary-text"
                :class="[imageSizeClass]"
              >
                <Icon class="h-[75%] w-[75%]" :name="iconName || 'default'" />
              </div>
            </slot>
          </div>
        </NuxtLink>
      </div>
      <div class="flex-col space-y-2 pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6">
        <div class="-mb-2 flex flex-col justify-between md:flex-row">
          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <NuxtLink :aria-label="$t(ariaLabel)" :to="localePath(linkUrl)">
              <h3 class="font-bold" data-testid="group-title">
                {{ title }}
              </h3>
            </NuxtLink>
            <slot
              class="max-md:absolute max-md:right-0 max-md:top-0"
              name="menu"
            />
          </div>
          <div
            v-if="aboveMediumBP"
            class="flex items-center space-x-3 lg:space-x-5"
          >
            <slot name="desktop-meta-tags" />
          </div>
        </div>
        <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
          <div
            v-if="!aboveMediumBP"
            class="flex items-center justify-center space-x-4"
          >
            <slot name="mobile-meta-tags" />
          </div>
          <div
            v-if="!isReduced"
            class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
          >
            <slot name="organizations" />
          </div>
        </div>
        <NuxtLink
          v-if="entityName"
          :aria-label="$t(ariaLabel)"
          class="text-distinct-text hover:text-primary-text"
          data-testid="group-entity-name"
          :to="localePath(linkUrl)"
        >
          @{{ entityName }}
        </NuxtLink>
        <p
          class="justify-center md:justify-start md:px-0 md:py-0"
          :class="{
            'line-clamp-3': isReduced,
            'line-clamp-4 lg:line-clamp-5': !isReduced,
          }"
          data-testid="group-description"
        >
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  linkUrl: string;
  ariaLabel: string;
  imageUrl?: string;
  imageAlt?: string;
  iconName?: string;
  entityName?: string;
  isReduced?: boolean;
}>();

const aboveMediumBP = useBreakpoint("md");
const localePath = useLocalePath();

const imageSizeClass = computed(() => ({
  "h-[150px] w-[150px]": props.isReduced,
  "h-[200px] w-[200px]": !props.isReduced,
}));
</script>
