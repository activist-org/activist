<template>
  <div
    class="flex flex-col items-center justify-between px-8 py-8 gap-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ organization.name }} </title>
    </head>
    <div class="w-3/4 h-[260px] mx-auto">
      <imageorganization :imgURL="organization?.imageURL" />
    </div>
    <div class="flex flex-col items-center gap-2">
      <h1
        class="text-3xl font-bold responsive-h1 text-light-text dark:text-dark-text"
      >
        {{ organization.name }}
      </h1>
      <h2
        class="text-lg font-bold text-center responsive-h2 text-light-special-text dark:text-dark-special-text"
      >
        {{ organization.tagline }}
      </h2>
    </div>
    <div class="flex flex-col items-center w-full gap-4">
      <menulinkwrapper
        v-for="button in organizationButtons"
        :to="button.routeURL"
        :active="button.active"
        :selected="button.selected"
      >
        <div
          class="flex items-center w-full text-sm font-medium text-left space-x-2"
        >
          <span class="width-1/6"
            ><icon
              v-if="button.iconURL"
              :name="button.iconURL"
              class="flex-shrink-0 w-5 h-5"
          /></span>
          <p
            class="text-lg font-bold select-none width-5/6 whitespace-nowrap hover:light-menu-selection"
          >
            {{ $t(button.label) }}
          </p>
        </div>
      </menulinkwrapper>
      <btnlabeled
        class="w-max"
        :cta="true"
        linkTo="/"
        label="components.btn-labeled.offer-to-help"
        fontSize="base"
        rightIcon="bi:arrow-right"
        iconSize="1.25em"
        ariaLabel="components.btn-labeled.offer-to-help-aria-label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { menuselector } from "../../../types/menu-selector";
import { organization } from "../../../types/organization";

definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;

const organization: organization = {
  name: "tech from below",
  status: "approved",
  tagline: "technologie von und für soziale bewegungen",
  location: "berlin",
  description: "this is the description of tech from below",
  topic: "technology and privacy",
  members: 3,
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
};

const organizationButtons: menuselector[] = [
  {
    label: "components.sidebar-left-selector.label.about",
    routeURL: "/organizations/" + id + "/about",
    iconURL: "bi:card-text",
    selected: useRoute().path.split("/").pop() === "about" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.events",
    routeURL: "/organizations/" + id + "/events",
    iconURL: "bi:calendar-check",
    selected: useRoute().path.split("/").pop() === "events" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.groups",
    routeURL: "/organizations/" + id + "/groups",
    iconURL: "icongroup",
    selected: useRoute().path.split("/").pop() === "groups" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/organizations/" + id + "/resources",
    iconURL: "iconresource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.faq",
    routeURL: "/organizations/" + id + "/faq",
    iconURL: "iconfaq",
    selected: useRoute().path.split("/").pop() === "faq" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.settings",
    routeURL: "/organizations/" + id + "/settings",
    iconURL: "bi:gear",
    selected: useRoute().path.split("/").pop() === "settings" ? true : true,
    active: true,
  },
  // {
  //   label: "components.sidebar-left-selector.label.affiliates",
  //   routeURL: "/organizations/" + id + "/affiliates",
  //   iconURL: "iconsupport",
  //   selected: useRoute().path.split("/").pop() === "affiliates" ? true : true,
  //   active: false,
  // },
  // {
  //   label: "components.sidebar-left-selector.label.tasks",
  //   routeURL: "/organizations/" + id + "/tasks",
  //   iconURL: "bi:check-square",
  //   selected: useRoute().path.split("/").pop() === "tasks" ? true : true,
  //   active: false,
  // },
  // {
  //   label: "components.sidebar-left-selector.label.discussions",
  //   routeURL: "/organizations/" + id + "/discussions",
  //   iconURL: "octicon:comment-discussion-24",
  //   selected: useRoute().path.split("/").pop() === "discussions" ? true : true,
  //   active: false,
  // },
];

const handleResize = () => {
  if (window.innerWidth > 640) {
    window.removeEventListener("resize", handleResize);
    navigateTo(`${id}/about`);
  }
};

onMounted(() => {
  // add event listener to handle resizing.
  window.addEventListener("resize", handleResize);

  // verify that the user is on a mobile device.
  handleResize();
});
</script>
