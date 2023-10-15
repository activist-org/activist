<template>
  <aside
    @mouseover="sidebar.collapsed = false"
    @mouseleave="sidebar.collapsed = true"
    class="absolute z-10 flex-col hidden h-full border-r transition-all duration-500 bg-light-distinct dark:bg-dark-distinct md:flex border-light-section-div dark:border-dark-section-div shadow-sm shadow-zinc-700"
    :class="{
      'w-56': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }"
  >
    <SidebarLeftHeader />
    <div class="h-full overflow-x-hidden overflow-y-scroll">
      <SearchBar class="mt-3" location="sidebar" />
      <SidebarLeftMainSectionSelectors class="mt-2" />
      <SidebarLeftIndex
        v-if="sidebarType === 'organization' || sidebarType === 'event'"
        class="my-3"
        :name="placeholderName"
        :sidebarType="sidebarType"
        :logoUrl="placeholderLogo"
      />
      <SidebarLeftFilters
        v-else
        :class="{
          'mx-3 py-4':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'mx-2 py-3':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
        :filters="getFiltersByPageType"
      />
    </div>
    <SidebarLeftFooter />
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  name?: string;
}>();

const sidebar = useSidebar();
const route = useRoute();
const { locale } = useI18n();

let sidebarType = "";
if (route.path.includes(locale.value + "/search")) {
  sidebarType = "search";
} else if (route.path.includes(locale.value + "/home")) {
  sidebarType = "home";
} else if (route.path.includes(locale.value + "/organizations")) {
  // We're in /organizations.
  if (
    // Check to see if we're on a sub page where we need id information.
    route.path.length >
      (
        route.path.split(locale.value + "/organizations/", 1) +
        locale.value +
        "/organizations/"
      ).length +
        1 &&
    route.path.split(locale.value + "/organizations/").pop() !== "search" &&
    route.path.split(locale.value + "/organizations/").pop() !== "search/"
  ) {
    sidebarType = "organization";
  } else {
    // We're on /organizations itself or /organizations/search.
    sidebarType = "filter organizations";
  }
} else if (route.path.includes(locale.value + "/events")) {
  // We're in /events.
  if (
    // Check to see if we're on a sub page where we need id information.
    route.path.length >
      (
        route.path.split(locale.value + "/events/", 1) +
        locale.value +
        "/events/"
      ).length +
        1 &&
    route.path.split(locale.value + "/events/").pop() !== "search" &&
    route.path.split(locale.value + "/events/").pop() !== "search/"
  ) {
    sidebarType = "event";
  } else {
    // We're on /events itself or /events/search.
    sidebarType = "filter events";
  }
} else {
  // TODO: Handle this state.
  sidebarType = "misc";
}

// TODO: Use real name of organization / event when available from backend.
const placeholderName = route.path.split("/").at(-2)?.replaceAll("-", " ");
const placeholderLogo = "/images/tech-from-below.svg";

const filters = {
  daysAhead: {
    sidebarType: ["filter events"],
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
    sidebarType: ["filter events"],
    title: "Event type",
    name: "eventType",
    type: "checkbox",
    style: "btn",
    items: [
      {
        label: "Act",
        value: "act",
        customColor: "act-red",
      },
      {
        label: "Learn",
        value: "learn",
        customColor: "learn-blue",
      },
    ],
  },
  locationType: {
    sidebarType: ["filter events"],
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
    sidebarType: ["filter events"],
    title: "",
    name: "eventLocationSearch",
    type: "search",
    placeholder: "components.sidebar-left.location-search-placeholder",
  },
  locationSearch: {
    sidebarType: ["filter organizations", "search"],
    title: "Location",
    name: "locationSearch",
    type: "search",
    placeholder: "components.sidebar-left.location-search-placeholder",
  },
  organizationSearch: {
    sidebarType: ["filter events"],
    title: "Organization",
    name: "organizationSearch",
    type: "search",
    placeholder: "components.sidebar-left.orgs-search-placeholder",
  },
  topic: {
    sidebarType: [
      "filter events",
      "filter organizations",
      "filter resources",
      "search",
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
  for (const key in filters) {
    const f = filters[key as keyof typeof filters];
    if (!f.sidebarType.includes(sidebarType)) {
      delete filters[key as keyof typeof filters];
    }
  }

  return filters;
});
</script>
