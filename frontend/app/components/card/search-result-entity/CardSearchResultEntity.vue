<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    :class="{
      'card-compact': type === 'compact',
      'card-detailed': type === 'detailed',
    }"
  >
    <div
      class="relative flex w-full flex-col"
      :class="{
        'md:flex-row': type === 'detailed',
        'flex-col': type === 'compact',
      }"
    >
      <div
        class="flex w-full justify-center"
        :class="{
          'md:w-fit': type === 'detailed',
          'w-full': type === 'compact',
        }"
      >
        <NuxtLink :aria-label="t(ariaLabel)" :to="localePath(linkUrl)">
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
                <Icon class="size-[75%]" :name="iconName || 'default'" />
              </div>
            </slot>
          </div>
        </NuxtLink>
      </div>
      <div
        class="flex-col space-y-2 pt-3"
        :class="{
          'md:grow md:pl-4 md:pt-0 lg:pl-6': type === 'detailed',
        }"
      >
        <div class="flex flex-col justify-between md:flex-row">
          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <NuxtLink :aria-label="t(ariaLabel)" :to="localePath(linkUrl)">
              <h3 class="font-bold" data-testid="group-title">
                {{ title }}
              </h3>
            </NuxtLink>
            <slot
              :class="{
                'max-md:absolute max-md:right-0 max-md:top-0':
                  type === 'compact',
              }"
              name="menu"
            />
          </div>
          <div
            v-if="aboveMediumBP"
            class="flex items-center space-x-3"
            :class="{
              'lg:space-x-5': type === 'detailed',
            }"
          >
            <slot name="desktop-meta-tags" />
          </div>
        </div>
        <div
          class="flex flex-col space-y-3"
          :class="{
            'md:flex-row md:space-y-0': type === 'detailed',
          }"
        >
          <div
            v-if="!aboveMediumBP"
            class="flex flex-col items-center justify-center space-y-[0.375rem] pt-4"
          >
            <slot name="mobile-meta-tags" />
          </div>
          <div
            v-if="!isReduced"
            class="flex justify-center space-x-3"
            :class="{
              'md:justify-start lg:space-x-4': type === 'detailed',
            }"
          >
            <slot name="organizations" />
          </div>
        </div>
        <NuxtLink
          v-if="entityName"
          :aria-label="t(ariaLabel)"
          class="text-distinct-text hover:text-primary-text"
          data-testid="group-entity-name"
          :to="localePath(linkUrl)"
        >
          @{{ entityName }}
        </NuxtLink>
        <p
          class="justify-center"
          :class="{
            'line-clamp-3 lg:line-clamp-4': isReduced,
            'line-clamp-4 lg:line-clamp-5': !isReduced && type === 'detailed',
            'md:justify-start md:p-0': type === 'detailed',
            'line-clamp-2': type === 'compact',
          }"
          data-testid="entity-description"
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
  type?: "compact" | "detailed";
}>();

const { t } = useI18n();
const aboveMediumBP = useBreakpoint("md");
const localePath = useLocalePath();

const imageSizeClass = computed(() => ({
  "h-[9.375rem] w-[9.375rem]": props.isReduced,
  "h-[12.5rem] w-[12.5rem]": !props.isReduced,
}));
</script>
