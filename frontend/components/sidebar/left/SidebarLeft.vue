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
    <sidebarleftheader />
    <div class="h-full overflow-x-hidden overflow-y-scroll">
      <searchbar class="mt-2" location="sidebar" />
      <sidebarleftmainsectionselectors class="mt-2" />
      <sidebarleftindex
        v-if="sidebarType === 'organization' || sidebarType === 'event'"
        class="my-3"
        :name="placeholderName"
        :sidebarType="sidebarType"
        :logoUrl="placeholderLogo"
      />
      <sidebarleftfilters
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
    <sidebarleftfooter />
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
  // we're in /organizations.
  if (
    // check to see if we're on a sub page where we need id information.
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
    // we're on /organizations itself or /organizations/search.
    sidebarType = "filter organizations";
  }
} else if (route.path.includes(locale.value + "/events")) {
  // we're in /events.
  if (
    // check to see if we're on a sub page where we need id information.
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
    // we're on /events itself or /events/search.
    sidebarType = "filter events";
  }
} else {
  // todo: handle this state.
  sidebarType = "misc";
}

// todo: use real name of organization / event when available from backend.
const placeholderName = route.path.split("/").at(-2)?.replaceAll("-", " ");
const placeholderLogo = "/images/tech-from-below.svg";

const filters = {
  daysAhead: {
    title: "days ahead",
    name: "daysAhead",
    type: "radio",
    style: "button",
    allowCustomValue: true,
    customValuePlaceholder: "enter number",
    sidebarType: ["filter events"],
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
    title: "event type",
    name: "eventType",
    type: "checkbox",
    style: "button",
    sidebarType: ["filter events"],
    items: [
      {
        label: "learn",
        value: "learn",
        customColor: "learn-blue",
      },
      {
        label: "act",
        value: "act",
        customColor: "act-red",
      },
    ],
  },
  location: {
    title: "location",
    name: "location",
    type: "checkbox",
    style: "button",
    sidebarType: ["filter events"],
    searchInput: true,
    items: [
      {
        label: "in person",
        value: "in-person",
        customColor: "learn-blue",
      },
      {
        label: "online",
        value: "online",
        customColor: "learn-blue",
      },
    ],
  },
  eventLocationSearch: {
    title: "",
    name: "eventLocationSearch",
    type: "search",
    sidebarType: ["filter events"],
    placeholder: "filter by location",
  },
  locationSearch: {
    title: "location",
    name: "locationSearch",
    type: "search",
    sidebarType: ["filter organizations", "search"],
    placeholder: "filter by location",
  },
  organizationSearch: {
    title: "organization",
    name: "organizationSearch",
    type: "search",
    sidebarType: ["filter events"],
    placeholder: "filter by orgs",
  },
  topic: {
    title: "topic",
    type: "checkbox",
    name: "topic",
    style: "simple",
    expandable: true,
    sidebarType: [
      "filter events",
      "filter organizations",
      "filter resources",
      "search",
    ],
    items: [
      {
        label: "environment",
        value: "environment",
      },
      {
        label: "housing",
        value: "housing",
      },
      {
        label: "refugees",
        value: "refugees",
      },
      {
        label: "lgbtqia+",
        value: "lgbtqia+",
      },
      {
        label: "racial justice",
        value: "racial justice",
      },
      {
        label: "women's rights",
        value: "women's rights",
      },
      {
        label: "children's rights",
        value: "children's rights",
      },
      {
        label: "elder rights",
        value: "elder rights",
      },
      {
        label: "animal rights",
        value: "animal rights",
      },
      {
        label: "labor rights",
        value: "labor rights",
      },
      {
        label: "education",
        value: "education",
      },
      {
        label: "democracy",
        value: "democracy",
      },
      {
        label: "health",
        value: "health",
      },
      {
        label: "privacy",
        value: "privacy",
      },
      {
        label: "peace",
        value: "peace",
      },
      {
        label: "nutrition",
        value: "nutrition",
      },
      {
        label: "accessibility",
        value: "accessibility",
      },
      {
        label: "transparency",
        value: "transparency",
      },
      {
        label: "expression",
        value: "expression",
      },
      {
        label: "emergency relief",
        value: "emergency relief",
      },
      {
        label: "infrastructure",
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
