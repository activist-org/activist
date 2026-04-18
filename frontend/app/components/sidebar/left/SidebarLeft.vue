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
    :aria-label="$t('i18n.components.sidebar_left.sidebar_left_aria_label')"
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
        :location="SearchBarLocation.SIDEBAR"
        :model-value="modelValue"
      />
      <SidebarLeftMainSectionSelectors class="mt-2" />
      <SidebarLeftContent
        v-if="
          sidebarType === SidebarType.ORGANIZATION_PAGE ||
          sidebarType === SidebarType.EVENT_PAGE ||
          sidebarType === SidebarType.GROUP_PAGE
        "
        class="my-3"
        :logoUrl="placeholderLogo"
        :name="placeholderName ? placeholderName : 'Name'"
        :sidebarType="sidebarType"
      />
      <!-- TODO: We need to edit the v-else-if once more filters are enabled. -->
      <SidebarLeftFilter
        v-else-if="
          (sidebarType === SidebarType.ORGANIZATIONS_PAGE ||
            sidebarType === SidebarType.EVENTS_PAGE ||
            sidebarType === SidebarType.RESOURCES_PAGE) &&
          (!sidebar.collapsed || !sidebar.collapsedSwitch)
        "
        class="my-3"
        :sidebarType="sidebarType"
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
const sidebar = useSidebar();
const route = useRoute();
const { currentRoute } = useRouter();

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
  if (pathToSidebarTypeMap[2]) {
    pathToSidebarTypeMap[2]["type"] = isOrgPage.value
      ? SidebarType.ORGANIZATION_PAGE
      : SidebarType.ORGANIZATIONS_PAGE;
  }
  if (pathToSidebarTypeMap[3]) {
    pathToSidebarTypeMap[3]["type"] = isEventPage.value
      ? SidebarType.EVENT_PAGE
      : SidebarType.EVENTS_PAGE;
  }
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

const content = ref();

const sidebarContentScrollable = useState<boolean>(
  "sidebarContentScrollable",
  () => false
);
const applyTopShadow = ref(false);

/**
 * Sets the scrollable state of the sidebar content based on its height.
 */
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

/**
 * Applies a shadow to the top of the sidebar content if it is not scrolled to the top, providing a visual indication that there is more content to scroll through. This function checks the scroll position of the sidebar content and updates the applyTopShadow reactive reference accordingly, allowing the component to conditionally render the shadow based on whether the user has scrolled down from the top of the content.
 */
function isAtTop(): void {
  if (sidebarContentScrollable && content && content.value) {
    applyTopShadow.value = !(content.value.scrollTop === 0);
  }
}

const sidebarWrapper = ref<HTMLElement | null>(null);

/**
 * Collapses or expands the sidebar based on the provided boolean value. When collapse is true, the sidebar will be collapsed, and when false, it will be expanded. This function also calls setSidebarContentScrollable to ensure that the scrollable state of the sidebar content is updated accordingly after changing the collapsed state of the sidebar.
 * @param collapse A boolean value indicating whether to collapse (true) or expand (false) the sidebar. This parameter is used to update the collapsed state of the sidebar and ensure that the scrollable state of the sidebar content is set correctly after the change.
 */
function collapseSidebar(collapse: boolean): void {
  sidebar.collapsed = collapse;
  setSidebarContentScrollable();
}

/**
 * Handles the focusout event on the sidebar wrapper to determine whether the sidebar should be collapsed or not. If the newly focused element is still within the sidebar wrapper, the sidebar will remain expanded; otherwise, it will be collapsed. This function ensures that the sidebar behaves intuitively when users navigate through it using keyboard or mouse interactions, providing a better user experience by keeping the sidebar open when interacting with its content and collapsing it when focus moves away.
 * @param event The FocusEvent triggered when the focus moves out of the sidebar wrapper. This event contains information about the newly focused element, which is used to determine whether the sidebar should remain expanded or be collapsed based on whether the new focus is still within the sidebar wrapper.
 */
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
