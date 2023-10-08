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
        <imageorganization :imgURL="logoUrl" />
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
        <imageevent eventType="act" />
      </div>
      <p
        v-if="sidebar.collapsed == false || sidebar.collapsedSwitch == false"
        class="mt-2 text-xl font-bold text-center"
      >
        {{ name }}
      </p>
      <p
        v-if="sidebar.collapsed == true && sidebar.collapsedSwitch == true"
        class="mt-1 text-lg font-bold text-center"
      >
        {{ nameAbbreviation }}
      </p>
      <ul class="flex flex-col w-full px-1 mt-2 mb-1">
        <li
          v-if="sidebarType === 'organization'"
          v-for="button in organizationButtons"
        >
          <sidebarleftselector
            :label="button.label"
            :routeURL="button.routeURL"
            :iconURL="button.iconURL"
            :selected="button.selected"
            :active="button.active"
          />
        </li>
        <li v-if="sidebarType === 'event'" v-for="button in eventButtons">
          <sidebarleftselector
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
import { menuselector } from "../../../types/menu-selector";

const sidebar = useSidebar();

const props = defineProps<{
  name: string;
  sidebarType: "organization" | "event";
  logoUrl?: string;
}>();

const nameAbbreviation = props.name
  .split(" ")
  .map(function (item) {
    return item[0];
  })
  .join("");

const { id } = useRoute().params;

const organizationButtons: menuselector[] = [
  {
    label: "components.sidebar-left-selector.label.about",
    routeURL: "/organizations/" + id + "/about",
    iconURL: "bi:card-text",
    selected: useRoute().path.split("/").pop() === "about" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.events",
    routeURL: "/organizations/" + id + "/events",
    iconURL: "bi:calendar-check",
    selected: useRoute().path.split("/").pop() === "events" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.groups",
    routeURL: "/organizations/" + id + "/groups",
    iconURL: "icongroup",
    selected: useRoute().path.split("/").pop() === "groups" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/organizations/" + id + "/resources",
    iconURL: "iconresource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.faq",
    routeURL: "/organizations/" + id + "/faq",
    iconURL: "iconfaq",
    selected: useRoute().path.split("/").pop() === "faq" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.settings",
    routeURL: "/organizations/" + id + "/settings",
    iconURL: "bi:gear",
    selected: useRoute().path.split("/").pop() === "settings" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.affiliates",
    routeURL: "/organizations/" + id + "/affiliates",
    iconURL: "iconsupport",
    selected: useRoute().path.split("/").pop() === "affiliates" ? true : false,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.tasks",
    routeURL: "/organizations/" + id + "/tasks",
    iconURL: "bi:check-square",
    selected: useRoute().path.split("/").pop() === "tasks" ? true : false,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.discussions",
    routeURL: "/organizations/" + id + "/discussions",
    iconURL: "octicon:comment-discussion-24",
    selected: useRoute().path.split("/").pop() === "discussions" ? true : false,
    active: false,
  },
];

const eventButtons: menuselector[] = [
  {
    label: "components.sidebar-left-selector.label.about",
    routeURL: "/events/" + id + "/about",
    iconURL: "bi:card-text",
    selected: useRoute().path.split("/").pop() === "about" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.team",
    routeURL: "/events/" + id + "/team",
    iconURL: "bi:people",
    selected: useRoute().path.split("/").pop() === "team" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/events/" + id + "/resources",
    iconURL: "iconresource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.settings",
    routeURL: "/events/" + id + "/settings",
    iconURL: "bi:gear",
    selected: useRoute().path.split("/").pop() === "settings" ? true : false,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.tasks",
    routeURL: "/events/" + id + "/tasks",
    iconURL: "bi:check-square",
    selected: useRoute().path.split("/").pop() === "tasks" ? true : false,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.discussions",
    routeURL: "/events/" + id + "/discussions",
    iconURL: "octicon:comment-discussion-24",
    selected: useRoute().path.split("/").pop() === "discussions" ? true : false,
    active: false,
  },
];
</script>
