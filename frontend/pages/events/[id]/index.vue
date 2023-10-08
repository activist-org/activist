<template>
  <div
    class="flex flex-col items-center justify-between px-8 py-8 gap-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content"
  >
    <head>
      <title>{{ event.name }} </title>
    </head>
    <div class="w-3/4 h-[260px] mx-auto">
      <imageevent :eventType="event.type" :imgURL="event?.imageURL" />
    </div>
    <div class="flex flex-col items-center gap-2">
      <h1
        class="text-3xl font-bold text-center responsive-h1 text-light-text dark:text-dark-text"
      >
        {{ event.name }}
      </h1>
      <h2
        class="text-lg font-bold responsive-h2 text-light-special-text dark:text-dark-special-text"
      >
        {{ event.tagline }}
      </h2>
    </div>
    <div class="flex flex-col items-center w-full gap-4">
      <menulinkwrapper
        v-for="button in eventButtons"
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
import { event } from "../../../types/event";
import { menuselector } from "../../../types/menu-selector";

definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;

const event: event = {
  name: "test event",
  type: "act",
  tagline: "we love to test!",
  organizer: "testers llc",
  topic: "testing and designing",
  description: "this is a test event for testers.",
  getInvolvedDescription: "wanna help test?",
  onlineLocation: "zoom test room",
  date: new date(),
  supporters: 10,
};

const eventButtons: menuselector[] = [
  {
    label: "components.sidebar-left-selector.label.about",
    routeURL: "/events/" + id + "/about",
    iconURL: "bi:card-text",
    selected: useRoute().path.split("/").pop() === "about" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.team",
    routeURL: "/events/" + id + "/team",
    iconURL: "bi:people",
    selected: useRoute().path.split("/").pop() === "team" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/events/" + id + "/resources",
    iconURL: "iconresource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.settings",
    routeURL: "/events/" + id + "/settings",
    iconURL: "bi:gear",
    selected: useRoute().path.split("/").pop() === "settings" ? true : true,
    active: true,
  },
  // {
  //   label: "components.sidebar-left-selector.label.tasks",
  //   routeURL: "/events/" + id + "/tasks",
  //   iconURL: "bi:check-square",
  //   selected: useRoute().path.split("/").pop() === "tasks" ? false : false,
  //   active: false,
  // },
  // {
  //   label: "components.sidebar-left-selector.label.discussions",
  //   routeURL: "/events/" + id + "/discussions",
  //   iconURL: "octicon:comment-discussion-24",
  //   selected:
  //     useRoute().path.split("/").pop() === "discussions" ? false : false,
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
