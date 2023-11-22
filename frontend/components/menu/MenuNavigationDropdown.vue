<template>
  <div
    v-if="selectedMenuItem"
    class="fixed z-20 w-full h-10 md:hidden bg-light-menu-selection dark:bg-dark-menu-selection"
  >
    <Listbox v-model="selectedMenuItem">
      <ListboxButton
        class="flex items-center align-middle text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct relative w-full py-2 pl-5 text-left elem-shadow-sm focus-brand"
      >
        <Icon
          :name="selectedMenuItem.iconURL"
          class="w-5 h-5 mr-4 align-middle"
          aria-hidden="true"
        />
        <span>{{ $t(selectedMenuItem.label) }}</span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
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
                class="flex items-center align-middle relative cursor-default select-none py-2 pl-5"
                :class="{
                  'bg-light-header dark:bg-dark-section-div text-light-text dark:text-dark-text fill-light-text dark:fill-dark-text':
                    selected && active,
                  'bg-light-distinct dark:bg-dark-distinct text-light-text dark:text-dark-text fill-light-text dark:fill-dark-text':
                    selected && !active,
                  'bg-light-highlight dark:bg-dark-highlight text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct':
                    !selected && active,
                  'text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct':
                    !active && menuEntry.active,
                  'text-light-special-text dark:text-dark-special-text fill-light-special-text dark:fill-dark-special-text':
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
import useMenuEntriesState from "~/composables/useMenuEntriesState";
import MenuEntry from "~/types/menu-entry";
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
