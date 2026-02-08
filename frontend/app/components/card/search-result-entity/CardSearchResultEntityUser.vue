<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <CardSearchResultEntity
    :ariaLabel="ariaLabel"
    :description="description"
    :entityName="entityName"
    :iconName="defaultIconName"
    :imageAlt="imageAlt"
    :imageUrl="imageUrl"
    :isExternalLink="false"
    :isReduced="isReduced"
    :linkUrl="linkUrl"
    :title="user.name"
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
  </CardSearchResultEntity>
</template>

<script setup lang="ts">
const props = defineProps<{
  user: UserActivist;
  isPrivate?: boolean;
  isReduced?: boolean;
}>();

const { t } = useI18n();
const { linkUrl } = useLinkURL(props);

const description = computed(() => {
  return props.user.description || "";
});

const ariaLabel = computed(() => {
  return t(
    "i18n.components.card_search_result_entity_user.navigate_to_user_aria_label"
  );
});

const imageAlt = computed(() => {
  return t("i18n.components.card_search_result_entity_user.user_img_alt_text", {
    entity_name: props.user.name,
  });
});

const imageUrl = computed(() => {
  if (props.user.iconUrl?.fileObject) {
    return props.user.iconUrl.fileObject;
  }
  return "";
});

const defaultIconName = computed(() => {
  return IconMap.PERSON;
});

const location = computed(() => {
  return props.user.location || "";
});

const entityName = computed(() => {
  // Users don't have entity names like organizations (@org_name).
  return "";
});
</script>
