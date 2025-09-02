<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResult
    :title="group.name"
    :description="description"
    :linkUrl="linkUrl"
    :ariaLabel="ariaLabel"
    :imageUrl="imageUrl"
    :imageAlt="imageAlt"
    :iconName="defaultIconName"
    :entityName="group.groupName"
    :isExternalLink="false"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  >
    <template #menu>
      <MenuSearchResult
        class="max-md:absolute max-md:right-0 max-md:top-0"
        :group="group"
      />
    </template>

    <template #desktop-meta-tags>
      <MetaTagLocation v-if="location" :location="location" />
    </template>

    <template #mobile-meta-tags>
      <MetaTagLocation v-if="location" :location="location" />
    </template>
  </CardSearchResult>
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

const i18n = useI18n();
const { linkUrl } = useLinkURL(props);

const description = computed(() => {
  return props.group.texts.description || "";
});

const ariaLabel = computed(() => {
  return i18n.t("i18n.components._global.navigate_to_group_aria_label");
});

const imageAlt = computed(() => {
  return (
    i18n.t("i18n.components.card_search_result_group.group_img_alt_text") +
    " " +
    props.group.name
  );
});

const defaultIconName = computed(() => {
  return IconMap.ORGANIZATION;
});

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
