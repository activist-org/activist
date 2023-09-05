<template>
  <div
    class="px-8 py-8 text-light-text dark:text-dark-text bg-light-content dark:bg-dark-content flex flex-col justify-between items-center gap-8"
  >
    <Head>
      <Title>{{ organization.name }} </Title>
    </Head>

    <div class="w-3/4 h-[260px] mx-auto">
      <ImageOrganization :imgURL="organization?.imageURL" />
    </div>

    <div class="flex flex-col items-center gap-2">
      <h1
        class="font-bold responsive-h1 text-3xl text-light-text dark:text-dark-text"
      >
        {{ organization.name }}
      </h1>

      <h2
        class="font-bold responsive-h2 text-lg text-light-special-text dark:text-dark-special-text text-center"
      >
        {{ organization.tagline }}
      </h2>
    </div>

    <div 
      class="w-full flex flex-col items-center gap-4"
    >
      <MenuLinkWrapper v-for="button in organizationButtons" :to="button.routeURL" :active="button.active" :selected="button.selected">
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
const { id } = useRoute().params;
import { Organization } from "../../types/organization";
import { onMounted } from "vue";

const organization: Organization = {
  name: "tech from below",
  status: "approved",
  tagline: "Technologie von und für soziale Bewegungen",
  location: "Berlin",
  description: "This is the description of tech from below",
  topic: "Technology and Privacy",
  members: 3,
  supporters: 30,
  imageURL: "/images/tech-from-below.svg",
};

const organizationButtons: SidebarLeftSelectorType[] = [
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
    iconURL: "IconGroup",
    selected: useRoute().path.split("/").pop() === "groups" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.resources",
    routeURL: "/organizations/" + id + "/resources",
    iconURL: "IconResource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : true,
    active: true,
  },
  {
    label: "components.sidebar-left-selector.label.faq",
    routeURL: "/organizations/" + id + "/faq",
    iconURL: "IconFAQ",
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
  {
    label: "components.sidebar-left-selector.label.affiliates",
    routeURL: "/organizations/" + id + "/affiliates",
    iconURL: "IconSupport",
    selected: useRoute().path.split("/").pop() === "affiliates" ? true : true,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.tasks",
    routeURL: "/organizations/" + id + "/tasks",
    iconURL: "bi:check-square",
    selected: useRoute().path.split("/").pop() === "tasks" ? true : true,
    active: false,
  },
  {
    label: "components.sidebar-left-selector.label.discussions",
    routeURL: "/organizations/" + id + "/discussions",
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
