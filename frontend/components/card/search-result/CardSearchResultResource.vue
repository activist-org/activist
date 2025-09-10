<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    class="card-style flex flex-col justify-center px-3 py-4 md:grow md:flex-row md:justify-start md:py-3 lg:px-5"
  >
    <div class="relative flex w-full flex-col md:flex-row">
      <div class="flex w-full justify-center md:w-fit">
        <a :href="linkUrl" target="_blank" :aria-label="ariaLabel">
          <div class="h-min rounded-md border border-section-div bg-layer-0">
            <div
              :class="{
                'h-[150px] w-[150px]': isReduced,
                'h-[200px] w-[200px]': !isReduced,
              }"
              class="flex items-center justify-center fill-primary-text"
            >
              <Icon :name="IconMap.RESOURCE" class="h-[75%] w-[75%]" />
            </div>
          </div>
        </a>
      </div>
      <div class="flex-col space-y-2 pt-3 md:grow md:pl-4 md:pt-0 lg:pl-6">
        <div class="-mb-2 flex flex-col justify-between md:flex-row">
          <div class="flex items-center justify-center space-x-2 md:space-x-4">
            <a :href="linkUrl" target="_blank" :aria-label="ariaLabel">
              <h3 class="font-bold">{{ resource.name }}</h3>
            </a>
            <MenuSearchResult
              class="max-md:absolute max-md:right-0 max-md:top-0"
              :resource="resource"
            />
          </div>
        </div>
        <div class="flex flex-col space-y-3 md:flex-row md:space-y-0">
          <div
            class="flex justify-center space-x-3 md:justify-start lg:space-x-4"
          >
            <MetaTagOrganization
              v-if="!isReduced && resource.org"
              class="pt-2"
              :organization="resource.org"
            />
          </div>
        </div>
        <p
          class="justify-center md:justify-start md:px-0 md:py-0"
          :class="{
            'line-clamp-3': isReduced,
            'line-clamp-4 lg:line-clamp-5': !isReduced,
          }"
        >
          {{ resource.description || '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Resource } from "~/types/content/resource";
import { useLinkURL } from "~/composables/useLinkURL";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  resource: Resource;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const i18n = useI18n();
const { linkUrl } = useLinkURL(props);

const ariaLabel = computed(() =>
  i18n.t("i18n.components.card_search_result.navigate_to_resource_aria_label")
);
</script>
