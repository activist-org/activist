<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <aside
    id="sidebar-left"
    ref="sidebarWrapper"
    @focus="collapseSidebar(false)"
    @focusout="
      collapseSidebar(true);
      handleFocusOut($event);
    "
    @mouseleave="collapseSidebar(true)"
    @mouseover="collapseSidebar(false)"
    :aria-label="t('i18n.components.sidebar_left.sidebar_left_aria_label')"
    class="absolute z-40 block h-full flex-col border-r border-section-div bg-layer-1 transition-all duration-500 elem-shadow-sm focus-brand md:flex"
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
    role="navigation"
    tabindex="0"
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
      <SearchBar
        @update:model-value="handleChange"
        class="mt-1"
        :location="searchBarLocation"
        :model-value="modelValue"
      />
      <SidebarLeftMainSectionSelectors class="mt-2" />
      <SidebarLeftContent
        v-if="
          sidebarMap === sidebarOrganizationPage ||
          sidebarMap === sidebarEventPage
        "
        class="my-3"
        :logoUrl="placeholderLogo"
        :name="placeholderName ? placeholderName : 'Name'"
        :sidebarType="sidebarMap"
      />
      <!-- TODO: We need to edit the v-else-if once more filters are enabled. -->
      <SidebarLeftFilter
        v-else-if="
          (sidebarMap === sidebarOrganizationsPage ||
            sidebarMap === sidebarEventsPage) &&
          (!sidebar.collapsed || !sidebar.collapsedSwitch)
        "
        class="my-3"
        :sidebarType="sidebarMap"
      />
      <div v-else class="w-full px-1 pt-2">
        <div
          v-if="sidebar.collapsed === true && sidebar.collapsedSwitch === true"
          class="style-cta opacity-100! my-0 flex items-center justify-center rounded-md elem-shadow-sm"
        >
          <Icon class="mt-[0.125em]" :name="IconMap.FILTER" size="2em" />
        </div>
      </div>
    </div>
    <SidebarLeftFooter :sidebarContentScrollable="sidebarContentScrollable" />
  </aside>
</template>

<script setup lang="ts">
const { t } = useI18n();
const sidebar = useSidebar();
const route = useRoute();
const { currentRoute } = useRouter();

const searchBarLocation = SearchBarLocation.SIDEBAR;
const sidebarEventPage = SidebarMap.EVENT_PAGE;
const sidebarOrganizationPage = SidebarMap.ORGANIZATION_PAGE;
const sidebarOrganizationsPage = SidebarMap.ORGANIZATIONS_PAGE;
const sidebarEventsPage = SidebarMap.EVENTS_PAGE;

const routeName = computed(() => {
  if (currentRoute.value.name) {
    return currentRoute.value.name;
  }
  return "";
});
const modelValue = ref(route.query.name as string | undefined);
watch(
  route,
  (newName) => {
    if (newName.query.name && newName.query.name !== modelValue.value) {
      modelValue.value = newName.query.name as string | undefined;
    }
  },
  { immediate: true }
);
onMounted(() => {
  if (route.query.name && route.query.name !== modelValue.value) {
    modelValue.value = route.query.name as string | undefined;
  }
});
const handleChange = (value: string) => {
  modelValue.value = value;
  const query = { ...route.query, name: modelValue.value };
  useRouter().push({ query });
};

const isOrgPage = computed(() =>
  isCurrentRoutePathSubpageOf("organizations", routeName.value.toString())
);
const isEventPage = computed(() =>
  isCurrentRoutePathSubpageOf("events", routeName.value.toString())
);

const pathToSidebarMap = [
  // { path: "search", type: SidebarMap.SEARCH },
  // { path: "home", type: SidebarMap.HOME },
  {
    path: "organizations",
    type: isOrgPage.value
      ? SidebarMap.ORGANIZATION_PAGE
      : SidebarMap.ORGANIZATIONS_PAGE,
  },
  {
    path: "events",
    type: isEventPage.value ? SidebarMap.EVENT_PAGE : SidebarMap.EVENTS_PAGE,
  },
];

watch([isOrgPage, isEventPage], () => {
  if (pathToSidebarMap[0]) {
    pathToSidebarMap[0]["type"] = SidebarMap.ORGANIZATION_PAGE;
  }
  if (pathToSidebarMap[1]) {
    pathToSidebarMap[1]["type"] = SidebarMap.EVENT_PAGE;
  }
});

const sidebarMap = computed(() => {
  const matchingPath = pathToSidebarMap.find((item) =>
    currentRoutePathIncludes(item.path, routeName.value.toString())
  );
  return matchingPath?.type || SidebarMap.MISC;
});

// TODO: Use real name of organization / event when available from backend.
const placeholderName = route.path.split("/").at(-2)?.replaceAll("-", " ");
const placeholderLogo = "";

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
