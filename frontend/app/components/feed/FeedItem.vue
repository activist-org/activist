<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <NuxtLink
    :aria-label="$t('i18n.components._global.navigate_to_group_aria_label')"
    :to="localePath(item.url)"
  >
    <div
      class="cursor-pointer rounded-md border border-section-div bg-layer-2 p-2 elem-shadow-sm sm:p-3"
    >
      <div class="flex items-center space-x-3 pb-2">
        <Icon
          v-if="item.itemType = 'group'"
          :name="IconMap.PEOPLE"
          size="1.5em"
        />
        <Icon
          v-else-if="item.url.includes('mastodon')"
          :name="IconMap.MASTODON"
          size="1.5em"
        />
        <Icon
          v-else-if="item.url.includes('facebook')"
          :name="IconMap.FACEBOOK"
          size="1.5em"
        />
        <Icon
          v-else-if="item.url.includes('instagram')"
          :name="IconMap.INSTAGRAM"
          size="1.5em"
        />
        <h5 class="font-bold">
          {{ item.title }}
        </h5>
      </div>
      <div
        class="flex h-32 items-center justify-center rounded-md bg-distinct-text"
      >
        <img
          v-if="item.imgUrl"
          :alt="$t('i18n.components.feed_item.img_alt_text')"
          :src="item.imgUrl"
        />
        <Icon
          v-else
          :alt="$t('i18n.components.feed_item.img_alt_text')"
          class="fill-layer-1"
          name="IconGroup"
          size="6em"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">

const props = defineProps<{
  name: string;
  url: string;
}>();

const localePath = useLocalePath();

let itemType: string = "";
if (props.url.includes("activist")) {
  itemType = "group";
} else {
  itemType = "social post";
}

const item: FeedItem = {
  url: props.url,
  itemType: itemType,
  title: props.name,
};
</script>
