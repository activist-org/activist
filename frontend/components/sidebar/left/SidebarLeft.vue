<template>
  <aside
    @mouseover="sidebar.collapsed = false"
    @mouseleave="sidebar.collapsed = true"
    class="absolute z-10 flex-col hidden h-full border-r transition-all duration-500 bg-light-distinct dark:bg-dark-distinct md:flex border-light-section-div dark:border-dark-section-div shadow-sm shadow-zinc-700"
    :class="{
      'w-56': !sidebar.collapsed || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed && sidebar.collapsedSwitch == true,
    }"
  >
    <SidebarLeftHeader />
    <div
      class="h-full overflow-x-hidden"
      :class="{
        'overflow-y-scroll':
          !sidebar.collapsed || sidebar.collapsedSwitch == false,
      }"
    >
      <SearchBar class="mt-3" location="sidebar" />
      <SidebarLeftMainSectionSelectors class="mt-2" />
      <SidebarLeftIndex
        v-if="
          sidebarType === SidebarType.ORGANIZATION_PAGE ||
          sidebarType === SidebarType.EVENT_PAGE
        "
        class="my-3"
        :name="placeholderName"
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
    <SidebarLeftFooter />
  </aside>
</template>

<script setup lang="ts">
import { SidebarType } from "~/types/sidebar-type";

defineProps<{
  name?: string;
}>();

const sidebar = useSidebar();
const route = useRoute();
const { locale } = useI18n();

function currentRoutePathIncludes(path: string): boolean {
  const { locale } = useI18n();

  return route.path.includes(locale.value + path);
}

function isCurrentRoutePathSubpageOf(path: string) {
  return (
    route.path.length >
      (route.path.split(locale.value + path, 1) + locale.value + path).length +
        1 &&
    route.path.split(locale.value + path).pop() !== "search" &&
    route.path.split(locale.value + path).pop() !== "search/"
  );
}

const pathToSidebarTypeMap = [
  { path: "/search", type: SidebarType.SEARCH },
  { path: "/home", type: SidebarType.HOME },
  {
    path: "/organizations",
    type: isCurrentRoutePathSubpageOf("/organizations/")
      ? SidebarType.ORGANIZATION_PAGE
      : SidebarType.FILTER_ORGANIZATIONS,
  },
  {
    path: "/events",
    type: isCurrentRoutePathSubpageOf("/events/")
      ? SidebarType.EVENT_PAGE
      : SidebarType.FILTER_EVENTS,
  },
];

const sidebarType =
  pathToSidebarTypeMap.find((item) => currentRoutePathIncludes(item.path))
    ?.type || SidebarType.MISC;

// TODO: Use real name of organization / event when available from backend.
const placeholderName = route.path.split("/").at(-2)?.replaceAll("-", " ");
const placeholderLogo = "/images/tech-from-below.svg";

const filters = {
  daysAhead: {
    sidebarType: [SidebarType.FILTER_EVENTS],
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
    sidebarType: [SidebarType.FILTER_EVENTS],
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
    sidebarType: [SidebarType.FILTER_EVENTS],
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
    sidebarType: [SidebarType.FILTER_EVENTS],
    title: "",
    name: "eventLocationSearch",
    type: "search",
    placeholder: "components.sidebar-left.location-search-placeholder",
  },
  locationSearch: {
    sidebarType: [SidebarType.FILTER_ORGANIZATIONS, SidebarType.SEARCH],
    title: "Location",
    name: "locationSearch",
    type: "search",
    placeholder: "components.sidebar-left.location-search-placeholder",
  },
  organizationSearch: {
    sidebarType: [SidebarType.FILTER_EVENTS],
    title: "Organization",
    name: "organizationSearch",
    type: "search",
    placeholder: "components.sidebar-left.orgs-search-placeholder",
  },
  topic: {
    sidebarType: [
      SidebarType.FILTER_EVENTS,
      SidebarType.FILTER_ORGANIZATIONS,
      SidebarType.FILTER_RESOURCES,
      SidebarType.SEARCH,
    ],
    title: "Topic",
    type: "checkbox",
    name: "topic",
    style: "simple",
    expandable: true,
    items: [
      {
        label: "Environment",
        value: "environment",
      },
      {
        label: "Housing",
        value: "housing",
      },
      {
        label: "Refugees",
        value: "refugees",
      },
      {
        label: "LGBTQIA+",
        value: "lgbtqia+",
      },
      {
        label: "Racial Justice",
        value: "racial justice",
      },
      {
        label: "Women's Rights",
        value: "women's rights",
      },
      {
        label: "Children's Rights",
        value: "children's rights",
      },
      {
        label: "Elder Rights",
        value: "elder rights",
      },
      {
        label: "Animal Rights",
        value: "animal rights",
      },
      {
        label: "Labor Rights",
        value: "labor rights",
      },
      {
        label: "Education",
        value: "education",
      },
      {
        label: "Democracy",
        value: "democracy",
      },
      {
        label: "Health",
        value: "health",
      },
      {
        label: "Privacy",
        value: "privacy",
      },
      {
        label: "Peace",
        value: "peace",
      },
      {
        label: "Nutrition",
        value: "nutrition",
      },
      {
        label: "Accessibility",
        value: "accessibility",
      },
      {
        label: "Transparency",
        value: "transparency",
      },
      {
        label: "Expression",
        value: "expression",
      },
      {
        label: "Emergency Relief",
        value: "emergency relief",
      },
      {
        label: "Infrastructure",
        value: "infrastructure",
      },
    ],
  },
};

const getFiltersByPageType = computed(() => {
  for (const filter in filters) {
    const f = filters[filter as keyof typeof filters];
    if (!f.sidebarType.includes(sidebarType)) {
      delete filters[filter as keyof typeof filters];
    }
  }

  return filters;
});
</script>
