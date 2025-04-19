<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <aside
    @mouseover="collapseSidebar(false)"
    @focus="collapseSidebar(false)"
    @mouseleave="collapseSidebar(true)"
    @focusout="
      collapseSidebar(true);
      handleFocusOut($event);
    "
    ref="sidebarWrapper"
    id="sidebar-left"
    role="menu"
    tabindex="0"
    class="elem-shadow-sm focus-brand absolute z-40 block h-full flex-col border-r border-section-div bg-layer-1 transition-all duration-500 md:flex"
    :class="{
      'w-56': !sidebar.collapsed || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed && sidebar.collapsedSwitch == true,
      'w-60':
        (!sidebar.collapsed || sidebar.collapsedSwitch == false) &&
        sidebarContentScrollable,
      'w-20':
        sidebar.collapsed &&
        sidebar.collapsedSwitch == true &&
        sidebarContentScrollable,
    }"
  >
    <SidebarLeftHeader
      @toggle-pressed="setSidebarContentScrollable()"
      :atTopShadow="applyTopShadow"
    />
    <div
      ref="content"
      class="h-full overflow-x-hidden"
      :class="{
        'overflow-y-auto':
          !sidebar.collapsed || sidebar.collapsedSwitch == false,
      }"
    >
      <SearchBar class="mt-1" :location="SearchBarLocation.SIDEBAR" />
      <SidebarLeftMainSectionSelectors class="mt-2" />
      asdf
      <SidebarLeftIndex
        v-if="
          sidebarType === SidebarType.ORGANIZATION_PAGE ||
          sidebarType === SidebarType.EVENT_PAGE
        "
        class="my-3"
        :name="placeholderName ? placeholderName : 'Name'"
        :sidebarType="sidebarType"
        :logoUrl="placeholderLogo"
      />
      <SidebarLeftFilters
        v-else
        :class="{
          'mx-3 py-4': !sidebar.collapsed || sidebar.collapsedSwitch == false,
          'mx-2 py-3': sidebar.collapsed && sidebar.collapsedSwitch == true,
        }"
        :filters="getFiltersByPageType"
      />
    </div>
    <SidebarLeftFooter :sidebarContentScrollable="sidebarContentScrollable" />
  </aside>
</template>

<script setup lang="ts">
import type { Filters } from "~/types/filters";

import { SearchBarLocation } from "~/types/location";
import { SidebarType } from "~/types/sidebar-type";
import { Topic } from "~/types/topics";
import {
  currentRoutePathIncludes,
  isCurrentRoutePathSubpageOf,
} from "~/utils/routeUtils";

const sidebar = useSidebar();
const route = useRoute();
const { currentRoute } = useRouter();

const routeName = computed(() => {
  if (currentRoute.value.name) {
    return currentRoute.value.name;
  }
  return "";
});

const isOrgPage = computed(() =>
  isCurrentRoutePathSubpageOf("organizations", routeName.value.toString())
);
const isEventPage = computed(() =>
  isCurrentRoutePathSubpageOf("events", routeName.value.toString())
);

const pathToSidebarTypeMap = [
  { path: "search", type: SidebarType.SEARCH },
  { path: "home", type: SidebarType.HOME },
  {
    path: "organizations",
    type: isOrgPage.value
      ? SidebarType.ORGANIZATION_PAGE
      : SidebarType.ORGANIZATION_FILTER,
  },
  {
    path: "events",
    type: isEventPage.value ? SidebarType.EVENT_PAGE : SidebarType.EVENT_FILTER,
  },
];

watch([isOrgPage, isEventPage], () => {
  pathToSidebarTypeMap[2].type = isOrgPage.value
    ? SidebarType.ORGANIZATION_PAGE
    : SidebarType.ORGANIZATION_FILTER;
  pathToSidebarTypeMap[3].type = isEventPage.value
    ? SidebarType.EVENT_PAGE
    : SidebarType.EVENT_FILTER;
});

const sidebarType = computed(() => {
  const matchingPath = pathToSidebarTypeMap.find((item) =>
    currentRoutePathIncludes(item.path, routeName.value.toString())
  );
  return matchingPath?.type || SidebarType.MISC;
});

// TODO: Use real name of organization / event when available from backend.
const placeholderName = route.path.split("/").at(-2)?.replaceAll("-", " ");
const placeholderLogo = "";

const topicsArray: { label: string; value: string }[] = [];

for (const key in Topic) {
  if (Object.prototype.hasOwnProperty.call(Topic, key)) {
    const value = Topic[key as keyof typeof Topic];
    topicsArray.push({ label: key.toLowerCase(), value });
  }
}

const filters = {
  daysAhead: {
    sidebarType: [SidebarType.EVENT_FILTER],
    title: "Days ahead",
    name: "daysAhead",
    type: "radio",
    style: "btn",
    allowCustomValue: true,
    items: [
      {
        label: "1",
        value: "1",
      },
      {
        label: "7",
        value: "7",
      },
      {
        label: "30",
        value: "30",
      },
    ],
  },
  eventType: {
    sidebarType: [SidebarType.EVENT_FILTER],
    title: "Event type",
    name: "eventType",
    type: "checkbox",
    style: "btn",
    items: [
      {
        label: "Learn",
        value: "learn",
        customColor: "learn-blue",
      },
      {
        label: "Action",
        value: "action",
        customColor: "action-red",
      },
    ],
  },
  locationType: {
    sidebarType: [SidebarType.EVENT_FILTER],
    title: "Location",
    name: "locationType",
    type: "checkbox",
    style: "btn",
    searchInput: true,
    items: [
      {
        label: "In person",
        value: "in-person",
      },
      {
        label: "Online",
        value: "online",
      },
    ],
  },
  eventLocationSearch: {
    sidebarType: [SidebarType.EVENT_FILTER],
    title: "",
    name: "eventLocationSearch",
    type: "search",
    placeholder: "i18n.components.sidebar_left.location_search_placeholder",
  },
  locationSearch: {
    sidebarType: [SidebarType.ORGANIZATION_FILTER, SidebarType.SEARCH],
    title: "Location",
    name: "locationSearch",
    type: "search",
    placeholder: "i18n.components.sidebar_left.location_search_placeholder",
  },
  organizationSearch: {
    sidebarType: [SidebarType.EVENT_FILTER],
    title: "Organization",
    name: "organizationSearch",
    type: "search",
    placeholder: "i18n.components.sidebar_left.orgs_search_placeholder",
  },
  topic: {
    sidebarType: [
      SidebarType.EVENT_FILTER,
      SidebarType.ORGANIZATION_FILTER,
      SidebarType.RESOURCES_FILTER,
      SidebarType.SEARCH,
    ],
    title: "Topic",
    type: "checkbox",
    name: "topic",
    style: "simple",
    expandable: true,
    items: topicsArray,
  },
};

const getFiltersByPageType = computed<Filters>(() => {
  const filteredFilters: Filters = {};
  for (const filter in filters) {
    const f = filters[filter as keyof typeof filters];
    if (!f.sidebarType.includes(sidebarType.value)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filteredFilters[filter as keyof typeof filters];
    }
  }

  return filteredFilters;
});

const content = ref();

const sidebarContentScrollable = useState<boolean>(
  "sidebarContentScrollable",
  () => false
);
const applyTopShadow = ref(false);

function setSidebarContentScrollable(): void {
  setTimeout(() => {
    // eslint-disable-next-line vue/no-ref-as-operand
    if (content && content.value) {
      sidebarContentScrollable.value =
        content.value.scrollHeight > content.value.clientHeight ? true : false;
    }
  }, 50);
  isAtTop();
}

function isAtTop(): void {
  if (sidebarContentScrollable && content && content.value) {
    applyTopShadow.value = !(content.value.scrollTop === 0);
  }
}

const sidebarWrapper = ref<HTMLElement | null>(null);

function collapseSidebar(collapse: boolean): void {
  sidebar.collapsed = collapse;
  setSidebarContentScrollable();
}

function handleFocusOut(event: FocusEvent) {
  const focusedElement = event.relatedTarget as HTMLElement;
  if (sidebarWrapper.value && sidebarWrapper.value.contains(focusedElement)) {
    collapseSidebar(false);
  } else {
    collapseSidebar(true);
  }
}

onMounted(() => {
  window.addEventListener("resize", setSidebarContentScrollable);
  setSidebarContentScrollable();
});

onUnmounted(() => {
  window.removeEventListener("resize", setSidebarContentScrollable);
});
</script>
