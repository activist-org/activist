<template>
  <div
    class="px-8 py-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content flex flex-col justify-between items-center gap-8"
  >
    <Head>
      <Title>{{ event.name }} </Title>
    </Head>

    <div class="w-3/4 h-[260px] mx-auto">
      <ImageEvent :eventType="event.type" :imgURL="event?.imageURL" />
    </div>

		<div class="flex flex-col items-center gap-2">
			<h1 class="font-bold responsive-h1 text-3xl text-light-text dark:text-dark-text text-center">
				{{ event.name }}
			</h1>
	
			<h2 class="font-bold responsive-h2 text-lg text-light-special-text dark:text-dark-special-text">
				{{ event.tagline }}
			</h2>
		</div>
    
    <div 
      class="w-full flex flex-col items-center gap-4"
    >
      <MenuLinkWrapper v-for="button in eventButtons" :to="button.routeURL" :active="button.active" :selected="button.selected">
        <div
          class="flex items-center w-full text-sm font-medium text-left space-x-2"
        >
          <span class="width-1/6"
            ><Icon v-if="button.iconURL" :name="button.iconURL" class="flex-shrink-0 w-5 h-5"
          /></span>
            <p
              class="select-none width-5/6 whitespace-nowrap hover:light-menu-selection font-bold text-lg"
            >
              {{ $t(button.label) }}
            </p>
        </div>
      </MenuLinkWrapper>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Event } from "../../types/event";
import { onMounted } from "vue";
const { id } = useRoute().params;

const event: Event = {
  name: "Test Event",
  type: "act",
  tagline: "We love to test!",
  organizer: "Testers LLC",
  topic: "Testing and Designing",
  description: "This is a test event for testers.",
  getInvolvedDescription: "Wanna help test?",
  onlineLocation: "Zoom Test Room",
  date: new Date(),
  supporters: 10,
};

const eventButtons: SidebarLeftSelectorType[] = [
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
    iconURL: "IconResource",
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
  {
    label: "components.sidebar-left-selector.label.tasks",
    routeURL: "/events/" + id + "/tasks",
    iconURL: "bi:check-square",
    selected: useRoute().path.split("/").pop() === "tasks" ? true : true,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.discussions",
    routeURL: "/events/" + id + "/discussions",
    iconURL: "octicon:comment-discussion-24",
    selected: useRoute().path.split("/").pop() === "discussions" ? true : true,
    active: false,
  },
];

onMounted(() => {
  redirectBasedOnScreenSize();
});

function redirectBasedOnScreenSize() {
  if (window.innerWidth > 384) {
    navigateTo(`${id}/about`);
  }
}
</script>
