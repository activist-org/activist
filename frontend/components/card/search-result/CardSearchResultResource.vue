<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResult
    :title="resource.name"
    :description="description"
    :linkUrl="linkUrl"
    :ariaLabel="ariaLabel"
    :imageUrl="imageUrl"
    :imageAlt="imageAlt"
    :iconName="defaultIconName"
    :entityName="entityName"
    :isExternalLink="true"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  >
    <template #menu>
      <MenuSearchResult
        class="max-md:absolute max-md:right-0 max-md:top-0"
        :resource="resource"
      />
    </template>

    <template #organizations>
      <MetaTagOrganization
        v-if="!isReduced && resource.org"
        class="pt-2"
        :organization="resource.org"
      />
    </template>
  </CardSearchResult>
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

const description = computed(() => {
  return props.resource.description || "";
});

const ariaLabel = computed(() => {
  return i18n.t(
    "i18n.components.card_search_result_resource.navigate_to_resource_aria_label"
  );
});

const imageAlt = computed(() => {
  return i18n.t(
    "i18n.components.card_search_result_resource.resource_img_alt_text",
    {
      entity_name: props.resource.name,
    }
  );
});

const defaultIconName = computed(() => {
  return IconMap.RESOURCE;
});

const imageUrl = computed(() => {
  // Resources typically don't have images, so we return empty string
  // The component will show the icon instead
  return "";
});

const entityName = computed(() => {
  // Resources don't have entity names like organizations (@org_name)
  return "";
});
</script>
