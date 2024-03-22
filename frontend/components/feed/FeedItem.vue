<template>
  <div
    class="bg-light-layer-2 dark:bg-dark-layer-2 border-light-section-div dark:border-dark-section-div elem-shadow-sm rounded-md border p-2 sm:p-3"
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
      class="bg-light-placeholder dark:bg-dark-placeholder h-32 w-full rounded-md"
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
