<template>
  <div
    class="fixed z-20 w-full h-10 md:hidden bg-light-menu-selection dark:bg-dark-menu-selection"
  >
    <Listbox
      v-if="sidebarType === 'organization'"
      v-model="selectedOrganization"
    >
      <ListboxButton
        class="flex items-center align-middle text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct relative w-full py-2 pl-5 text-left shadow-sm shadow-zinc-700 focus-brand"
      >
        <Icon
          :name="selectedOrganization.iconURL"
          class="w-5 h-5 mr-4 align-middle"
          aria-hidden="true"
        />
        <span>{{ $t(selectedOrganization.label) }}</span>
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
            v-for="option in organizationButtons"
            v-slot="{ active, selected }"
            :key="option.id"
            :value="option"
            :disabled="!option.active"
          >
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
                  !active && option.active,
                'text-light-special-text dark:text-dark-special-text fill-light-special-text dark:fill-dark-special-text':
                  !active && !option.active,
              }"
            >
              <Icon
                :name="option.iconURL"
                class="w-5 h-5 mr-4 align-middle"
                aria-hidden="true"
              />
              <span
                class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >{{ $t(option.label) }}</span
              >
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
    <Listbox v-if="sidebarType === 'event'" v-model="selectedEvent">
      <ListboxButton
        class="flex items-center align-middle text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct relative w-full py-2 pl-5 text-left shadow-sm shadow-zinc-700 focus-brand"
      >
        <Icon
          :name="selectedEvent.iconURL"
          class="w-5 h-5 mr-4 align-middle"
          aria-hidden="true"
        />
        <span>{{ $t(selectedEvent.label) }}</span>
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
            v-for="option in eventButtons"
            v-slot="{ active, selected }"
            :key="option.id"
            :value="option"
            :disabled="!option.active"
          >
            <li
              class="flex items-center align-middle relative cursor-default select-none py-2 pl-5"
              :class="{
                'bg-light-section-div dark:bg-dark-section-div text-light-text dark:text-dark-text fill-light-text dark:fill-dark-text':
                  selected && active,
                'bg-light-distinct dark:bg-dark-distinct text-light-text dark:text-dark-text fill-light-text dark:fill-dark-text':
                  selected && !active,
                'bg-light-highlight dark:bg-dark-highlight text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct':
                  !selected && active,
                'text-light-distinct dark:text-dark-distinct fill-light-distinct dark:fill-dark-distinct':
                  !active && option.active,
                'text-light-special-text dark:text-dark-special-text fill-light-special-text dark:fill-dark-special-text':
                  !active && !option.active,
              }"
            >
              <Icon
                :name="option.iconURL"
                class="w-5 h-5 mr-4 align-middle"
                aria-hidden="true"
              />
              <span
                class="block truncate"
                :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >{{ $t(option.label) }}</span
              >
            </li>
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
import { MenuSelector } from "~/types/menu-selector";

const route = useRoute();
const { id } = useRoute().params;
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

const organizationButtons: MenuSelector[] = [
  {
    id: 1,
    label: "components.sidebar-left-selector.label.about",
    routeURL: "/organizations/" + id + "/about",
    iconURL: "bi:card-text",
    selected: useRoute().path.split("/").pop() === "about" ? true : false,
    active: true,
  },
  {
    id: 2,
    label: "components.sidebar-left-selector.label.events",
    routeURL: "/organizations/" + id + "/events",
    iconURL: "bi:calendar-check",
    selected: useRoute().path.split("/").pop() === "events" ? true : false,
    active: true,
  },
  {
    id: 3,
    label: "components.sidebar-left-selector.label.groups",
    routeURL: "/organizations/" + id + "/groups",
    iconURL: "IconGroup",
    selected: useRoute().path.split("/").pop() === "groups" ? true : false,
    active: true,
  },
  {
    id: 4,
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/organizations/" + id + "/resources",
    iconURL: "IconResource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : false,
    active: true,
  },
  {
    id: 5,
    label: "components.sidebar-left-selector.label.faq",
    routeURL: "/organizations/" + id + "/faq",
    iconURL: "IconFAQ",
    selected: useRoute().path.split("/").pop() === "faq" ? true : false,
    active: true,
  },
  {
    id: 6,
    label: "components.sidebar-left-selector.label.settings",
    routeURL: "/organizations/" + id + "/settings",
    iconURL: "bi:gear",
    selected: useRoute().path.split("/").pop() === "settings" ? true : false,
    active: true,
  },
  {
    id: 7,
    label: "components.sidebar-left-selector.label.affiliates",
    routeURL: "/organizations/" + id + "/affiliates",
    iconURL: "IconSupport",
    selected: useRoute().path.split("/").pop() === "affiliates" ? true : false,
    active: false,
  },
  {
    id: 8,
    label: "components.sidebar-left-selector.label.tasks",
    routeURL: "/organizations/" + id + "/tasks",
    iconURL: "bi:check-square",
    selected: useRoute().path.split("/").pop() === "tasks" ? true : false,
    active: false,
  },
  {
    id: 9,
    label: "components.sidebar-left-selector.label.discussions",
    routeURL: "/organizations/" + id + "/discussions",
    iconURL: "octicon:comment-discussion-24",
    selected: useRoute().path.split("/").pop() === "discussions" ? true : false,
    active: false,
  },
];

const eventButtons: MenuSelector[] = [
  {
    id: 1,
    label: "components.sidebar-left-selector.label.about",
    routeURL: "/events/" + id + "/about",
    iconURL: "bi:card-text",
    selected: useRoute().path.split("/").pop() === "about" ? true : false,
    active: true,
  },
  {
    id: 2,
    label: "components.sidebar-left-selector.label.team",
    routeURL: "/events/" + id + "/team",
    iconURL: "bi:people",
    selected: useRoute().path.split("/").pop() === "team" ? true : false,
    active: true,
  },
  {
    id: 3,
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/events/" + id + "/resources",
    iconURL: "IconResource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : false,
    active: true,
  },
  {
    id: 4,
    label: "components.sidebar-left-selector.label.settings",
    routeURL: "/events/" + id + "/settings",
    iconURL: "bi:gear",
    selected: useRoute().path.split("/").pop() === "settings" ? true : false,
    active: true,
  },
  {
    id: 5,
    label: "components.sidebar-left-selector.label.tasks",
    routeURL: "/events/" + id + "/tasks",
    iconURL: "bi:check-square",
    selected: useRoute().path.split("/").pop() === "tasks" ? true : false,
    active: false,
  },
  {
    id: 6,
    label: "components.sidebar-left-selector.label.discussions",
    routeURL: "/events/" + id + "/discussions",
    iconURL: "octicon:comment-discussion-24",
    selected: useRoute().path.split("/").pop() === "discussions" ? true : false,
    active: false,
  },
];

const selectedOrganization = ref(organizationButtons[0]);
const selectedEvent = ref(eventButtons[0]);
</script>
