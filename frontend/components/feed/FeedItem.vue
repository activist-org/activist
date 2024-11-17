<template>
  <NuxtLink
    :to="localePath(url)"
    :aria-label="$t('components._global.navigate_to_group_aria_label')"
  >
    <div
      class="elem-shadow-sm bg-layer-2 border-section-div cursor-pointer rounded-md border p-2 sm:p-3"
    >
      <div class="flex items-center space-x-3 pb-2">
        <Icon
          v-if="(item.itemType = 'group')"
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
        <h4 class="responsive-h5 font-bold">{{ item.title }}</h4>
      </div>
      <div
        class="bg-distinct-text flex h-32 items-center justify-center rounded-md"
      >
        <img
          v-if="item.imgUrl"
          :src="item.imgUrl"
          :alt="$t('components.feed_item.img_alt_text')"
        />
        <Icon
          v-else
          class="fill-layer-1"
          name="IconGroup"
          size="6em"
          :alt="$t('components.feed_item.img_alt_text')"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { FeedItem } from "~/types/feed/feed-item";
import { IconMap } from "~/types/icon-map";

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
