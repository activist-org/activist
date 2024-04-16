<template>
  <div
    v-if="selectedMenuItem"
    class="fixed z-20 h-10 w-full bg-light-menu-selection dark:bg-dark-menu-selection md:hidden"
  >
    <Listbox v-model="selectedMenuItem">
      <ListboxButton
        class="elem-shadow-sm focus-brand relative flex w-full items-center fill-light-layer-1 py-2 pl-5 text-left align-middle text-light-layer-1 dark:fill-dark-layer-1 dark:text-dark-layer-1"
      >
        <Icon
          :name="selectedMenuItem.iconURL"
          class="mr-4 h-5 w-5 align-middle"
          aria-hidden="true"
        />
        <span>{{ $t(selectedMenuItem.label) }}</span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
        >
          <Icon
            name="bi:chevron-expand"
            class="mr-2 h-5 w-5 align-middle"
            aria-hidden="true"
        /></span>
      </ListboxButton>
      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="focus-brand bg-light-menu-selection dark:bg-dark-menu-selection"
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
                class="relative flex cursor-default select-none items-center py-2 pl-5 align-middle"
                :class="{
                  'bg-light-layer-2 fill-light-text text-light-text dark:bg-dark-section-div dark:fill-dark-text dark:text-dark-text':
                    selected && active,
                  'bg-light-layer-1 fill-light-text text-light-text dark:bg-dark-layer-1 dark:fill-dark-text dark:text-dark-text':
                    selected && !active,
                  'bg-light-highlight fill-light-layer-1 text-light-layer-1 dark:bg-dark-highlight dark:fill-dark-layer-1 dark:text-dark-layer-1':
                    !selected && active,
                  'fill-light-layer-1 text-light-layer-1 dark:fill-dark-layer-1 dark:text-dark-layer-1':
                    !active && menuEntry.active,
                  'fill-light-distinct-text text-light-distinct-text dark:fill-dark-distinct-text dark:text-dark-distinct-text':
                    !active && !menuEntry.active,
                }"
              >
                <Icon
                  :name="menuEntry.iconURL"
                  class="mr-4 h-5 w-5 align-middle"
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
