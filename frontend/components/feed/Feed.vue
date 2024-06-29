<template>
  <div
    v-if="feedItemURLs && feedItemNames"
    class="mt-3 flex items-center justify-start space-x-3"
  >
    <div
      v-for="(url, index) in feedItemURLs.slice(0, numberOfFeedItems)"
      class="w-full"
    >
      <FeedItem :name="feedItemNames[index]" :url="url" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import type { Group } from "~/types/entities/group";
import type {
  Organization,
  OrganizationGroup,
} from "~/types/entities/organization";

const props = defineProps<{
  organization: Organization;
}>();

const resOrgGroups = await useAsyncData(
  async () =>
    await fetchWithToken(
      `/entities/organization_group?org_id=${props.organization.id}`,
      {}
    )
);

const orgGroups = resOrgGroups.data as unknown as OrganizationGroup[];

const resGroups = await useAsyncData(
  async () =>
    await fetchWithToken(
      `/entities/groups?group_id=${orgGroups.map((g) => g.group_id).join(",")}`,
      {}
    )
);

const groups = resGroups.data as unknown as Group[];

const feedItemNames = computed<string[]>(() => {
  if (props.organization && orgGroups) {
    return groups.map((group) => group.name);
  } else {
    return [""];
  }
});

const feedItemURLs = computed<string[]>(() => {
  if (props.organization && orgGroups) {
    return groups.map(
      (group) => `/organizations/${group.organization.id}/groups/${group.id}`
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
