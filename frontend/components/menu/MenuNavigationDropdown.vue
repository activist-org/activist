<template>
  <div
    class="fixed z-20 w-full h-10 md:hidden bg-light-menu-selection dark:bg-dark-menu-selection"
  >
    <Listbox
      v-model="selectedMenuItem"
    >
      <ListboxButton
        class="flex items-center align-middle text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct relative w-full py-2 pl-5 text-left shadow-sm shadow-zinc-700 focus-brand"
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
            v-for="button in (sidebarType === SidebarType.ORGANIZATION_PAGE ? menuEntryState.organizationEntry.value : menuEntryState.eventEntry.value)"
            v-slot="{ active, selected }"
            :key="button.id"
            :value="button"
            :disabled="!button.active"
          >
            <NuxtLink :to="button.routeURL">
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
                  !active && button.active,
                'text-light-special-text dark:text-dark-special-text fill-light-special-text dark:fill-dark-special-text':
                  !active && !button.active,
              }">
                <Icon :name="button.iconURL" class="w-5 h-5 mr-4 align-middle" aria-hidden="true" />
                <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">{{ $t(button.label) }}</span>
              </li>
            </NuxtLink>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { SidebarType } from "~/types/sidebar-type";
import useMenuEntriesState from "~/composables/useMenuEntriesState";
import { computed } from "vue";

const route = useRoute();
const { locale } = useI18n();

function currentRoutePathIncludes(path: string): boolean {
  const { locale } = useI18n();

  return route.path.includes(locale.value + path);
}

function isCurrentRoutePathSubpageOf(path: string) {
  return route.path.length >
    (
      route.path.split(locale.value + path, 1) +
      locale.value +
      path
    ).length +
    1 &&
    route.path.split(locale.value + path).pop() !== "search" &&
    route.path.split(locale.value + path).pop() !== "search/";
}

const pathToSidebarTypeMap = [
  { path: "/search", type: SidebarType.SEARCH },
  { path: "/home", type: SidebarType.HOME },
  {
    path: "/organizations",
    type: isCurrentRoutePathSubpageOf("/organizations/") ? SidebarType.ORGANIZATION_PAGE : SidebarType.FILTER_ORGANIZATIONS,
  },
  {
    path: "/events",
    type: isCurrentRoutePathSubpageOf("/events/") ? SidebarType.EVENT_PAGE : SidebarType.FILTER_EVENTS,
  },
];

const sidebarType = pathToSidebarTypeMap.find(item => currentRoutePathIncludes(item.path))?.type || SidebarType.MISC;
const menuEntryState = useMenuEntriesState();

const selectedMenuItem = computed(() => {
  return useRouter().currentRoute.value.fullPath.includes("organizations") ? menuEntryState.organizationEntry.value.find(entry => entry.selected)! :
    menuEntryState.eventEntry.value.find(btn => btn.selected)!
})
</script>
