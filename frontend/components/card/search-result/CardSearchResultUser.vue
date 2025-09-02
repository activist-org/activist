<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResult
    :title="user.name"
    :description="description"
    :linkUrl="linkUrl"
    :ariaLabel="ariaLabel"
    :imageUrl="imageUrl"
    :imageAlt="imageAlt"
    :iconName="defaultIconName"
    :entityName="entityName"
    :isExternalLink="false"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  >
    <template #menu>
      <MenuSearchResult
        class="max-md:absolute max-md:right-0 max-md:top-0"
        :user="user"
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
import type { User } from "~/types/auth/user";

import { useLinkURL } from "~/composables/useLinkURL";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  user: User;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const i18n = useI18n();
const { linkUrl } = useLinkURL(props);

const description = computed(() => {
  return props.user.description || "";
});

const ariaLabel = computed(() => {
  return i18n.t(
    "i18n.components.card_search_result_user.navigate_to_user_aria_label"
  );
});

const imageAlt = computed(() => {
  return i18n.t("i18n.components.card_search_result_user.user_img_alt_text", {
    entity_name: props.user.name,
  });
});

const defaultIconName = computed(() => {
  return IconMap.PERSON;
});

const imageUrl = computed(() => {
  if (props.user.iconUrl?.fileObject) {
    return props.user.iconUrl.fileObject;
  }
  return "";
});

const location = computed(() => {
  return props.user.location || "";
});

const entityName = computed(() => {
  // Users don't have entity names like organizations (@org_name)
  return "";
});
</script>
