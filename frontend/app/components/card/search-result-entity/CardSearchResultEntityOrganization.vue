<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResultEntity
    :ariaLabel="ariaLabel"
    data-testid="organization-card"
    :description="description"
    :entityName="organization.orgName"
    :iconName="defaultIconName"
    :imageAlt="imageAlt"
    :imageUrl="imageUrl"
    :isExternalLink="false"
    :isReduced="isReduced"
    :linkUrl="linkUrl"
    :title="organization.name"
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
  </CardSearchResultEntity>
</template>

<script setup lang="ts">

const props = defineProps<{
  organization: Organization;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const { t } = useI18n();
const { linkUrl } = useLinkURL(props);

const description = computed(() => {
  return props.organization.texts[0]?.description || "";
});

const ariaLabel = computed(() => {
  return t("i18n.components._global.navigate_to_organization_aria_label");
});

const imageAlt = computed(() => {
  return t(
    "i18n.components.card_search_result_entity_organization.organization_img_alt_text",
    { entity_name: props.organization.name }
  );
});

const imageUrl = computed(() => {
  if (props.organization.iconUrl?.fileObject) {
    return props.organization.iconUrl.fileObject;
  }
  return "";
});

const defaultIconName = computed(() => {
  return IconMap.ORGANIZATION;
});

const location = computed(() => {
  if (props.organization.location) {
    return props.organization.location.displayName.split(",")[0];
  }
  return "";
});
</script>
