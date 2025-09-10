<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style flex flex-col justify-center px-3 py-4 md:grow md:flex-row md:justify-start md:py-3 lg:px-5"
  >
    <div class="relative flex w-full flex-col md:flex-row">
      <div class="flex w-full justify-center md:w-fit">
        <NuxtLink :to="localePath(linkUrl)" :aria-label="ariaLabel">
          <div class="h-min w-max rounded-md border border-section-div bg-layer-0">
            <img
              v-if="imageUrl"
              class="rounded-md"
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              :src="imageUrl"
              :alt="
                $t('i18n.components.card_search_result.group_img_alt_text') +
                ' ' +
                group.name
              "
            />
            <div
              v-else
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              class="flex items-center justify-center text-primary-text"
            >
              <Icon :name="IconMap.ORGANIZATION" class="h-[75%] w-[75%]" />
            </div>
          </div>
        </NuxtLink>
      </div>
      <div class="flex-col space-y-2 pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6">
        <div class="-mb-2 flex flex-col justify-between md:flex-row">
          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <NuxtLink :to="localePath(linkUrl)" :aria-label="ariaLabel">
              <h3 class="font-bold">{{ group.name }}</h3>
            </NuxtLink>
            <MenuSearchResult
              class="max-md:absolute max-md:right-0 max-md:top-0"
              :group="group"
            />
          </div>
          <div
            v-if="aboveMediumBP"
            class="flex items-center space-x-3 lg:space-x-5"
          >
            <MetaTagLocation v-if="location" :location="location" />
          </div>
        </div>
        <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
          <div
            v-if="!aboveMediumBP"
            class="flex items-center justify-center space-x-4"
          >
            <MetaTagLocation v-if="location" :location="location" />
          </div>
        </div>
        <NuxtLink
          v-if="group.groupName"
          :to="localePath(linkUrl)"
          class="text-distinct-text hover:text-primary-text"
          :aria-label="ariaLabel"
        >
          @{{ group.groupName }}
        </NuxtLink>
        <p
          class="justify-center md:justify-start md:px-0 md:py-0"
          :class="{
            'line-clamp-3': isReduced,
            'line-clamp-4 lg:line-clamp-5': !isReduced,
          }"
        >
          {{ group.texts?.description || '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Group } from "~/types/communities/group";
import { useLinkURL } from "~/composables/useLinkURL";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  group: Group;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const aboveMediumBP = useBreakpoint("md");
const i18n = useI18n();
const localePath = useLocalePath();
const { linkUrl } = useLinkURL(props);

const ariaLabel = computed(() =>
  i18n.t("i18n.components._global.navigate_to_group_aria_label")
);

const imageUrl = computed(() => {
  if (props.group.iconUrl?.fileObject) {
    return props.group.iconUrl.fileObject;
  }
  return "";
});

const location = computed(() => {
  if (props.group.location) {
    return props.group.location.displayName.split(",")[0];
  }
  return "";
});
</script>
