<template>
  <aside
    class="hidden absolute z-10 flex-col h-full border-r transition-all duration-500 bg-light-distinct dark:bg-dark-distinct sm:flex border-light-section-div dark:border-dark-section-div"
    :class="{
      'w-64': sidebar.collapsed == false || sidebar.collapsedSwitch == false,
      'w-16': sidebar.collapsed == true && sidebar.collapsedSwitch == true,
    }" @mouseover="sidebar.collapsed = false" @mouseleave="sidebar.collapsed = true">
    <SidebarHeader />
    <div class="overflow-x-hidden overflow-y-scroll h-full">
      <SearchBar location="sidebar" class="mt-2" />
      <SidebarMainSectionSelectors class="mt-2" />
      <SidebarIndex :pageType="pageTypeToDisplay" :name="placeholderName" :logoUrl="placeholderLogo" class="mt-2" />
      <SidebarFilters :filters="getFiltersByPageType"/>
    </div>
    <SidebarFooter />
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
defineProps<{
  name?: string;
}>();

const sidebar = useSidebar();
const route = useRoute();

let pageTypeToDisplay = "";
if (route.path.includes("organizations")) {
  pageTypeToDisplay = "organization";
} else if (route.path.includes("events")) {
  pageTypeToDisplay = "event";
} else {
  pageTypeToDisplay = "misc"; // TODO: assign this based on other options
}



const filters = {
  daysAhead: {
    title: 'Days ahead',
    name: 'daysAhead',
    type: 'radio',
    style: 'button',
    allowCustomValue: true,
    customValuePlaceholder: 'Enter a number',
    pageType: ['event'],
    items: [
      {
        label: "1",
        value: "1"
      },
      {
        label: "7",
        value: "7"
      },
      {
        label: "30",
        value: "30"
      },
    ]
  },
  eventType: {
    title: 'Event type',
    name: 'eventType',
    type: 'radio',
    style: 'button',
    pageType: ['event'],
    items: [
      {
        label: 'Learn',
        value: 'learn',
        customColor: 'learn-blue'
      },
      {
        label: 'Act',
        value: 'act',
        customColor: 'act-red'
      },
    ]
  }
  ,
  location: {
    title: 'Location',
    name: 'location',
    type: 'checkbox',
    style: 'button',
    pageType: ['event', 'organization'],
    searchInput: true,
    items: [
      {
        label: 'Online',
        value: 'online'
      },
      {
        label: 'In person',
        value: 'in-person'
      },
    ]
  },
  locationSearch:{
    title: '',
    name: 'locationSearch',
    type: 'search',
    pageType: ['event', 'organization'],
    placeholder: 'Filter by location'
  },
  organizationSearch:{
    title: 'Organization',
    name: 'organizationSearch',
    type: 'search',
    pageType: ['event', 'organization'],
    placeholder: 'Filter by organization',
  },
  topic:
  {
    title: 'Topic',
    type: 'checkbox',
    name: 'topic',
    style: 'simple',
    slide: true,
    pageType: ['event', 'organization', 'resources'],
    items: [
      {
        label: 'AI',
        value: 'ai'
      },
      {
        label: 'Blockchain',
        value: 'blockchain'
      },
      {
        label: 'Cybersecurity',
        value: 'cybersecurity'
      }
    ]
  }

}

const getFiltersByPageType = computed(() => {
  const filteredFilters = {};
  for (const filterKey in filters) {
    const filter = filters[filterKey];
    if (filter.pageType.includes(pageTypeToDisplay)) {
      filteredFilters[filterKey] = filter;
    }
  }
  
  return filteredFilters;
});

// TODO use real name of organization / event when available from backend.
const placeholderName = route.path.split("/").at(-2).replaceAll("-", " ");
const placeholderLogo = "/images/tech-from-below.svg";
</script>
