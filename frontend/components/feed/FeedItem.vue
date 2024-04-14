<template>
  <div
    class="elem-shadow-sm rounded-md border border-light-section-div bg-light-layer-2 p-2 dark:border-dark-section-div dark:bg-dark-layer-2 sm:p-3"
  >
    <div class="flex items-center space-x-3">
      <Icon v-if="(item.itemType = 'group')" name="bi:people" size="1.5em" />
      <Icon
        v-else-if="item.url.includes('mastodon')"
        name="bi:mastodon"
        size="1.5em"
      />
      <Icon
        v-else-if="item.url.includes('facebook')"
        name="bi:facebook"
        size="1.5em"
      />
      <Icon
        v-else-if="item.url.includes('instagram')"
        name="bi:instagram"
        size="1.5em"
      />
      <h4 class="responsive-h5 font-bold">{{ item.title }}</h4>
    </div>
    <p class="pb-3">
      {{ item.description }}
    </p>
    <div
      class="h-32 w-full rounded-md bg-light-distinct-text dark:bg-dark-distinct-text"
    >
      <img :src="item.imgURL" :alt="$t('components.feed-item.img-alt-text')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeedItem } from "~/types/feed-item";

const props = defineProps<{
  url: string;
}>();

let itemType: string = "";
if (props.url.includes("activist")) {
  itemType = "group";
} else {
  itemType = "social post";
}

const item: FeedItem = {
  url: props.url,
  itemType: itemType,
  title: "Title",
  description: "Lorem ipsum dolor sit amet",
};
</script>
