<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="feedItemUrls && feedItemNames"
    class="mt-3 flex items-center justify-start space-x-3"
  >
    <div v-for="(url, index) in feedItemUrls" class="max-w-[100%]">
      <FeedItem :name="feedItemNames[index]" :url="url" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import type { Group } from "~/types/communities/group";

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

const { organization } = organizationStore;

const feedItemNames = computed<string[]>(() => {
  if (organization && organization.groups) {
    return organization.groups.map((group: Group) => group.name);
  } else {
    return [""];
  }
});

const feedItemUrls = computed<string[]>(() => {
  if (organization && organization.groups) {
    return organization.groups.map(
      (group: Group) => `/organizations/${organization.id}/groups/${group.id}`
    );
  } else {
    return [""];
  }
});

const currentWidth = ref(window.innerWidth);
const numberOfFeedItems = ref(1);
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const updateWidth = () => {
  currentWidth.value = window.innerWidth;
  if (currentWidth.value < BreakpointMap.SMALL) {
    numberOfFeedItems.value = 1;
  } else if (currentWidth.value < BreakpointMap.LARGE) {
    numberOfFeedItems.value = 2;
  } else if (currentWidth.value < BreakpointMap.XL) {
    numberOfFeedItems.value = 3;
  } else if (currentWidth.value < BreakpointMap.XXXL) {
    numberOfFeedItems.value = 4;
  } else {
    numberOfFeedItems.value = 5;
  }
};

const handleResize = () => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(updateWidth, 100);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  updateWidth();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
