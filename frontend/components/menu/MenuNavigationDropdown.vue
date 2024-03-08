<template>
  <div
    v-if="selectedMenuItem"
    class="fixed z-[9] w-full h-10 md:hidden bg-light-menu-selection dark:bg-dark-menu-selection"
  >
    <Listbox v-model="selectedMenuItem">
      <ListboxButton
        class="relative flex items-center w-full py-2 pl-5 text-left align-middle text-light-layer-1 dark:text-dark-layer-1 fill-light-layer-1 dark:fill-dark-layer-1 elem-shadow-sm focus-brand"
      >
        <Icon
          :name="selectedMenuItem.iconURL"
          class="w-5 h-5 mr-4 align-middle"
          aria-hidden="true"
        />
        <span>{{ $t(selectedMenuItem.label) }}</span>
        <span
          class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
        >
          <Icon
            name="bi:chevron-expand"
            class="w-5 h-5 mr-2 align-middle"
            aria-hidden="true"
        /></span>
      </ListboxButton>
      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="bg-light-menu-selection dark:bg-dark-menu-selection focus-brand"
        >
          <ListboxOption
            v-for="menuEntry in sidebarType === SidebarType.ORGANIZATION_PAGE
              ? menuEntryState.organizationEntry.value
              : menuEntryState.eventEntry.value"
            v-slot="{ active, selected }"
            :key="menuEntry.id"
            :value="menuEntry"
            :disabled="!menuEntry.active"
          >
            <NuxtLink @click="handleItemClick(menuEntry)">
              <li
                class="relative flex items-center py-2 pl-5 align-middle cursor-default select-none"
                :class="{
                  'bg-light-layer-2 dark:bg-dark-section-div text-light-text dark:text-dark-text fill-light-text dark:fill-dark-text':
                    selected && active,
                  'bg-light-layer-1 dark:bg-dark-layer-1 text-light-text dark:text-dark-text fill-light-text dark:fill-dark-text':
                    selected && !active,
                  'bg-light-highlight dark:bg-dark-highlight text-light-layer-1 dark:text-dark-layer-1 fill-light-layer-1 dark:fill-dark-layer-1':
                    !selected && active,
                  'text-light-layer-1 dark:text-dark-layer-1 fill-light-layer-1 dark:fill-dark-layer-1':
                    !active && menuEntry.active,
                  'text-light-distinct-text dark:text-dark-distinct-text fill-light-distinct-text dark:fill-dark-distinct-text':
                    !active && !menuEntry.active,
                }"
              >
                <Icon
                  :name="menuEntry.iconURL"
                  class="w-5 h-5 mr-4 align-middle"
                  aria-hidden="true"
                />
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                  >{{ $t(menuEntry.label) }}</span
                >
              </li>
            </NuxtLink>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import type MenuEntry from "~/types/menu-entry";
import { SidebarType } from "~/types/sidebar-type";

const route = useRoute();
const { locale } = useI18n();

function currentRoutePathIncludes(path: string): boolean {
  const { locale } = useI18n();

  return route.path.includes(locale.value + path);
}
const handleItemClick = (menuEntry: MenuEntry) => {
  console.log("Clicked item:", menuEntry);
  console.log("Router:", useRouter());
  const router = useRouter();
  console.log("Current route:", router.currentRoute.value.fullPath);
  console.log("Target route:", menuEntry.routeURL);
  router.push(menuEntry.routeURL);
};
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
const menuEntryState = useMenuEntriesState();
const selectedMenuItem = ref<MenuEntry | undefined>(undefined);

watchEffect(() => {
  selectedMenuItem.value = useRouter().currentRoute.value.fullPath.includes(
    "organizations"
  )
    ? menuEntryState.organizationEntry.value.find((e) => e.selected)
    : menuEntryState.eventEntry.value.find((e) => e.selected);
});
</script>
