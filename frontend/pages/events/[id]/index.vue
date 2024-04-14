<template>
  <div
    class="flex flex-col items-center justify-between gap-8 bg-light-layer-0 px-8 py-8 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ event.name }} </Title>
    </Head>
    <div class="mx-auto h-[260px] w-3/4">
      <ImageEvent
        :eventType="event.type"
        :imgURL="event?.imageURL"
        :alt="
          $t('components._global.entity-logo', {
            entity_name: event?.name,
          })
        "
      />
    </div>
    <div class="flex flex-col items-center gap-2">
      <h1
        class="responsive-h1 text-center text-3xl font-bold text-light-text dark:text-dark-text"
      >
        {{ event.name }}
      </h1>
      <h2
        class="responsive-h2 text-lg font-bold text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ event.tagline }}
      </h2>
    </div>
    <div class="flex w-full flex-col items-center gap-4">
      <MenuLinkWrapper
        v-for="[i, button] of eventButtons.entries()"
        :key="i"
        :to="localPath(button.routeURL)"
        :selected="button.selected"
      >
        <div
          class="flex w-full items-center space-x-2 text-left text-sm font-medium"
        >
          <span class="width-1/6"
            ><Icon
              v-if="button.iconURL"
              :name="button.iconURL"
              class="h-5 w-5 flex-shrink-0"
          /></span>
          <p
            class="width-5/6 hover:light-menu-selection select-none whitespace-nowrap text-lg font-bold"
          >
            <span class="sr-only">{{ $t("_global.navigate-to") }}</span>
            {{ $t(button.label) }}
          </p>
        </div>
      </MenuLinkWrapper>
      <BtnRouteInternal
        class="w-max"
        :cta="true"
        linkTo="/"
        label="components.btn-route-internal.offer-to-help"
        fontSize="base"
        rightIcon="bi:arrow-right"
        iconSize="1.25em"
        ariaLabel="components.btn-route-internal.offer-to-help-aria-label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import type { Event } from "~/types/event";
import type { MenuSelector } from "~/types/menu-selector";

definePageMeta({
  layout: "sidebar",
});

const { id } = useRoute().params;
const localPath = useLocalePath();
const event: Event = {
  name: "Test Event",
  type: "action",
  tagline: "We love to test!",
  organizations: ["Testers LLC"],
  topic: "Testing and Designing",
  description: "This is a test event for testers.",
  getInvolvedDescription: "Wanna help test?",
  onlineLocation: "Zoom Test Room",
  date: new Date(),
  supporters: 10,
};

const eventButtons: MenuSelector[] = [
  {
    id: 1,
    label: "_global.about",
    routeURL: "/events/" + id + "/about",
    iconURL: "bi:card-text",
    selected: useRoute().path.split("/").pop() === "about" ? true : true,
  },
  {
    id: 2,
    label: "_global.team",
    routeURL: "/events/" + id + "/team",
    iconURL: "bi:people",
    selected: useRoute().path.split("/").pop() === "team" ? true : true,
  },
  {
    id: 3,
    label: "_global.resources",
    routeURL: "/events/" + id + "/resources",
    iconURL: "IconResource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : true,
  },
  {
    id: 4,
    label: "_global.settings",
    routeURL: "/events/" + id + "/settings",
    iconURL: "bi:gear",
    selected: useRoute().path.split("/").pop() === "settings" ? true : true,
  },
  // {
  //   label: "_global.tasks",
  //   routeURL: "/events/" + id + "/tasks",
  //   iconURL: "bi:check-square",
  //   selected: useRoute().path.split("/").pop() === "tasks" ? false : false,
  //   active: false,
  // },
  // {
  //   label: "_global.discussions",
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
  // Add event listener to handle resizing.
  window.addEventListener("resize", handleResize);

  // Verify that the user is on a mobile device.
  handleResize();
});
</script>
