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
      <SidebarLeftContent
        v-if="
          sidebarType === SidebarType.ORGANIZATION_PAGE ||
          sidebarType === SidebarType.EVENT_PAGE ||
          sidebarType === SidebarType.GROUP_PAGE
        "
        class="my-3"
        :name="placeholderName ? placeholderName : 'Name'"
        :sidebarType="sidebarType"
        :logoUrl="placeholderLogo"
      />
      <!-- TODO: We need to edit the v-else-if once more filters are enabled. -->
      <SidebarLeftFilter
        v-else-if="
          ['EVENTS_PAGE', 'ORGANIZATIONS_PAGE', 'RESOURCES_PAGE'].includes(
            sidebarType
          ) &&
          (!sidebar.collapsed || !sidebar.collapsedSwitch)
        "
        class="my-3"
        :sidebarType="sidebarType"
      />
      <div v-else class="w-full px-1 pt-2">
        <div
          :class="{
            'style-cta elem-shadow-sm my-0 flex items-center justify-center rounded-md !opacity-100':
              sidebar.collapsed == true && sidebar.collapsedSwitch == true,
          }"
        >
          <Icon class="mt-[0.125em]" :name="IconMap.FILTER" size="2em" />
        </div>
      </div>
    </div>
    <SidebarLeftFooter :sidebarContentScrollable="sidebarContentScrollable" />
  </aside>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";
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
      : SidebarType.ORGANIZATIONS_PAGE,
  },
  {
    path: "events",
    type: isEventPage.value ? SidebarType.EVENT_PAGE : SidebarType.EVENTS_PAGE,
  },
];

watch([isOrgPage, isEventPage], () => {
  pathToSidebarTypeMap[2].type = isOrgPage.value
    ? SidebarType.ORGANIZATION_PAGE
    : SidebarType.ORGANIZATIONS_PAGE;
  pathToSidebarTypeMap[3].type = isEventPage.value
    ? SidebarType.EVENT_PAGE
    : SidebarType.EVENTS_PAGE;
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

// const filters = {
//   daysAhead: {
//     sidebarType: [SidebarType.EVENTS_PAGE],
//     title: "Days ahead",
//     name: "daysAhead",
//     type: "radio",
//     style: "btn",
//     allowCustomValue: true,
//     items: [
//       {
//         label: "1",
//         value: "1",
//       },
//       {
//         label: "7",
//         value: "7",
//       },
//       {
//         label: "30",
//         value: "30",
//       },
//     ],
//   },
//   eventType: {
//     sidebarType: [SidebarType.EVENTS_PAGE],
//     title: "Event type",
//     name: "eventType",
//     type: "checkbox",
//     style: "btn",
//     items: [
//       {
//         label: "Learn",
//         value: "learn",
//         customColor: "learn-blue",
//       },
//       {
//         label: "Action",
//         value: "action",
//         customColor: "action-red",
//       },
//     ],
//   },
//   locationType: {
//     sidebarType: [SidebarType.EVENTS_PAGE],
//     title: "Location",
//     name: "locationType",
//     type: "checkbox",
//     style: "btn",
//     searchInput: true,
//     items: [
//       {
//         label: "In person",
//         value: "in-person",
//       },
//       {
//         label: "Online",
//         value: "online",
//       },
//     ],
//   },
//   eventLocationSearch: {
//     sidebarType: [SidebarType.EVENTS_PAGE],
//     title: "",
//     name: "eventLocationSearch",
//     type: "search",
//     placeholder: "i18n.components.sidebar_left.location_search_placeholder",
//   },
//   locationSearch: {
//     sidebarType: [SidebarType.ORGANIZATIONS_PAGE, SidebarType.SEARCH],
//     title: "Location",
//     name: "locationSearch",
//     type: "search",
//     placeholder: "i18n.components.sidebar_left.location_search_placeholder",
//   },
//   organizationSearch: {
//     sidebarType: [SidebarType.EVENTS_PAGE],
//     title: "Organization",
//     name: "organizationSearch",
//     type: "search",
//     placeholder: "i18n.components.sidebar_left.orgs_search_placeholder",
//   },
//   topic: {
//     sidebarType: [
//       SidebarType.EVENTS_PAGE,
//       SidebarType.ORGANIZATIONS_PAGE,
//       SidebarType.RESOURCES_PAGE,
//       SidebarType.SEARCH,
//     ],
//     title: "Topic",
//     type: "checkbox",
//     name: "topic",
//     style: "simple",
//     expandable: true,
//     items: topicsArray,
//   },
// };

// const getFiltersByPageType = computed<Filters>(() => {
//   const filteredFilters: Filters = {};
//   for (const filter in filters) {
//     const f = filters[filter as keyof typeof filters];
//     if (!f.sidebarType.includes(sidebarType.value)) {
//       // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//       delete filteredFilters[filter as keyof typeof filters];
//     }
//   }

//   return filteredFilters;
// });

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
