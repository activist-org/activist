<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style flex flex-col justify-center px-3 py-4 md:grow md:flex-row md:justify-start md:py-3 lg:px-5"
  >
    <div class="relative flex w-full flex-col md:flex-row">
      <div class="flex w-full justify-center md:w-fit">
        <component
          :is="isExternalLink ? 'a' : 'NuxtLink'"
          :to="isExternalLink ? undefined : localePath(linkUrl)"
          :href="isExternalLink ? linkUrl : undefined"
          :target="isExternalLink ? '_blank' : undefined"
          :aria-label="$t(ariaLabel)"
        >
          <div
            :class="imageContainerClass"
            class="h-min border border-section-div bg-layer-0"
          >
            <slot name="image" :imageUrl="imageUrl" :imageAlt="imageAlt">
              <img
                v-if="imageUrl"
                class="rounded-md"
                :class="imageSizeClass"
                :src="imageUrl"
                :alt="imageAlt"
              />
              <div
                v-else
                :class="[imageSizeClass, iconContainerClass]"
                class="flex items-center justify-center"
              >
                <Icon :name="iconName || 'default'" class="h-[75%] w-[75%]" />
              </div>
            </slot>
          </div>
        </component>
      </div>

      <div class="flex-col space-y-2 pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6">
        <div class="-mb-2 flex flex-col justify-between md:flex-row">
          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <component
              :is="isExternalLink ? 'a' : 'NuxtLink'"
              :to="isExternalLink ? undefined : localePath(linkUrl)"
              :href="isExternalLink ? linkUrl : undefined"
              :target="isExternalLink ? '_blank' : undefined"
              :aria-label="$t(ariaLabel)"
            >
              <h3 class="font-bold">
                {{ title }}
              </h3>
            </component>

            <slot
              name="menu"
              class="max-md:absolute max-md:right-0 max-md:top-0"
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

        <component
          v-if="entityName"
          :is="isExternalLink ? 'a' : 'NuxtLink'"
          :to="isExternalLink ? undefined : localePath(linkUrl)"
          :href="isExternalLink ? linkUrl : undefined"
          :target="isExternalLink ? '_blank' : undefined"
          class="text-distinct-text hover:text-primary-text"
          :aria-label="$t(ariaLabel)"
        >
          @{{ entityName }}
        </component>

        <p
          class="justify-center md:justify-start md:px-0 md:py-0"
          :class="{
            'line-clamp-3': isReduced,
            'line-clamp-4 lg:line-clamp-5': !isReduced,
          }"
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
  isExternalLink?: boolean;
  isReduced?: boolean;
  isPrivate?: boolean;
}>();

const aboveMediumBP = useBreakpoint("md");
const localePath = useLocalePath();

const imageSizeClass = computed(() => ({
  "h-[150px] w-[150px]": props.isReduced,
  "h-[200px] w-[200px]": !props.isReduced,
}));

const imageContainerClass = computed(() => ({
  "w-max rounded-md": !props.isExternalLink,
  "rounded-full": props.isExternalLink,
}));

const iconContainerClass = computed(() => ({
  "text-primary-text": !props.isExternalLink,
  "fill-primary-text": props.isExternalLink,
}));
</script>
