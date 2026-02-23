<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResultEntity
    :ariaLabel="ariaLabel"
    data-testid="group-card"
    :description="description"
    :entityName="group.groupName"
    :iconName="defaultIconName"
    :imageAlt="imageAlt"
    :imageUrl="imageUrl"
    :isExternalLink="false"
    :isReduced="isReduced"
    :linkUrl="linkUrl"
    :title="group.name"
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
  </CardSearchResultEntity>
</template>

<script setup lang="ts">
const props = defineProps<{
  group: Group;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const { t } = useI18n();
const { linkUrl } = useLinkURL(props);

const description = computed(() => {
  return props.group.texts[0]?.description || "";
});

const ariaLabel = computed(() => {
  return t("i18n.components._global.navigate_to_group_aria_label");
});

const imageAlt = computed(() => {
  return t(
    "i18n.components.card_search_result_entity_group.group_img_alt_text",
    {
      entity_name: props.group.name,
    }
  );
});

const imageUrl = computed(() => {
  if (props.group.iconUrl?.fileObject) {
    return props.group.iconUrl.fileObject;
  }
  return "";
});

const defaultIconName = computed(() => {
  return IconMap.ORGANIZATION;
});

const location = computed(() => {
  if (props.group.location) {
    return props.group.location.addressOrName.split(",")[0];
  }
  return "";
});
</script>
