<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResult
    :title="organization.name"
    :description="description"
    :linkUrl="linkUrl"
    :ariaLabel="ariaLabel"
    :imageUrl="imageUrl"
    :imageAlt="imageAlt"
    :iconName="defaultIconName"
    :entityName="organization.orgName"
    :isExternalLink="false"
    :isReduced="isReduced"
    :isPrivate="isPrivate"
  >
    <template #menu>
      <MenuSearchResult
        class="max-md:absolute max-md:right-0 max-md:top-0"
        :organization="organization"
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
import type { Organization } from "~/types/communities/organization";

import { useLinkURL } from "~/composables/useLinkURL";
import { IconMap } from "~/types/icon-map";

const props = defineProps<{
  organization: Organization;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const i18n = useI18n();
const { linkUrl } = useLinkURL(props);

const description = computed(() => {
  return props.organization.texts.description || "";
});

const ariaLabel = computed(() => {
  return i18n.t("i18n.components._global.navigate_to_organization_aria_label");
});

const imageAlt = computed(() => {
  return (
    i18n.t(
      "i18n.components.card_search_result_organization.organization_img_alt_text"
    ) +
    " " +
    props.organization.name
  );
});

const defaultIconName = computed(() => {
  return IconMap.ORGANIZATION;
});

const imageUrl = computed(() => {
  if (props.organization.iconUrl?.fileObject) {
    return props.organization.iconUrl.fileObject;
  }
  return "";
});

const location = computed(() => {
  if (props.organization.location) {
    return props.organization.location.displayName.split(",")[0];
  }
  return "";
});
</script>
