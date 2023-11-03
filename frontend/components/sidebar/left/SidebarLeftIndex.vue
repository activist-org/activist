<template>
  <div
    class="mx-1 transition-all duration-500 text-light-text dark:text-dark-text"
  >
    <div class="flex flex-col items-center">
      <div
        v-if="sidebarType === 'organization'"
        :class="{
          'w-32 h-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-10 h-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
        :alt="name + ' logo'"
      >
        <ImageOrganization :imgURL="logoUrl" />
      </div>
      <div
        v-else-if="sidebarType === 'event'"
        :class="{
          'w-32 h-32':
            sidebar.collapsed == false || sidebar.collapsedSwitch == false,
          'w-10 h-10':
            sidebar.collapsed == true && sidebar.collapsedSwitch == true,
        }"
        :alt="name + ' logo'"
      >
        <ImageEvent eventType="action" />
      </div>
      <ul class="flex flex-col w-full px-1 mt-4 mb-1">
        <li
          v-if="sidebarType === 'organization'"
          v-for="button in organizationButtons"
        >
          <SidebarLeftSelector
            :label="button.label"
            :routeURL="button.routeURL"
            :iconURL="button.iconURL"
            :selected="button.selected"
            :active="button.active"
          />
        </li>
        <li v-if="sidebarType === 'event'" v-for="button in eventButtons">
          <SidebarLeftSelector
            :label="button.label"
            :routeURL="button.routeURL"
            :iconURL="button.iconURL"
            :selected="button.selected"
            :active="button.active"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MenuSelector } from "~/types/menu-selector";

defineProps<{
  name: string;
  sidebarType: "organization" | "event";
  logoUrl?: string;
}>();

const sidebar = useSidebar();

const { id } = useRoute().params;

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
</script>
