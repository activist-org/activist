<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="feedItemUrls && feedItemNames"
    class="mt-3 flex items-center justify-start space-x-3"
  >
    <div v-for="(url, index) in feedItemUrls" class="max-w-[100%]">
      <FeedItem
        v-if="feedItemNames[index]"
        :name="feedItemNames[index]"
        :url="url"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const { data: organization } = useGetOrganization(orgId || "");

const feedItemNames = computed<string[]>(() => {
  if (organization && organization.value?.groups) {
    return organization.value?.groups.map((group: Group) => group.name);
  } else {
    return [""];
  }
});

const feedItemUrls = computed<string[]>(() => {
  if (organization && organization.value?.groups) {
    return organization.value.groups.map(
      (group: Group) =>
        `/organizations/${organization.value?.id}/groups/${group.id}`
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
  resizeTimeout = setTimeout(updateWidth, 10);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  updateWidth();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
