<template>
  <div
    v-if="windowWidth < Breakpoint.SMALL"
    class="flex flex-col items-center justify-between gap-8 bg-light-layer-0 px-8 py-8 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ organization.name }} </Title>
    </Head>
    <div class="mx-auto h-[260px] w-3/4">
      <ImageOrganization
        :imgURL="organization?.iconURL"
        :alt="
          $t('components._global.entity-logo', {
            entity_name: organization?.name,
          })
        "
      />
    </div>
    <div class="flex flex-col items-center gap-2">
      <h1
        class="responsive-h1 text-3xl font-bold text-light-text dark:text-dark-text"
      >
        {{ organization.name }}
      </h1>
      <h2
        class="responsive-h2 text-center text-lg font-bold text-light-distinct-text dark:text-dark-distinct-text"
      >
        {{ organization.tagline }}
      </h2>
    </div>
    <div class="flex w-full flex-col items-center gap-4">
      <MenuLinkWrapper
        v-for="button in organizationButtons"
        :key="button.id"
        :to="localePath(button.routeURL)"
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
import { Breakpoint } from "~/types/breakpoints";
import type { MenuSelector } from "~/types/menu-selector";

import { testTechOrg } from "~/utils/testEntities";

definePageMeta({
  layout: "sidebar",
});

const organization = testTechOrg;

const { id } = useRoute().params;
const localePath = useLocalePath();

const organizationButtons: MenuSelector[] = [
  {
    id: 1,
    label: "_global.about",
    routeURL: "/organizations/" + id + "/about",
    iconURL: "bi:card-text",
    selected: useRoute().path.split("/").pop() === "about" ? true : true,
  },
  {
    id: 2,
    label: "_global.events",
    routeURL: "/organizations/" + id + "/events",
    iconURL: "bi:calendar-check",
    selected: useRoute().path.split("/").pop() === "events" ? true : true,
  },
  {
    id: 3,
    label: "_global.groups",
    routeURL: "/organizations/" + id + "/groups",
    iconURL: "IconGroup",
    selected: useRoute().path.split("/").pop() === "groups" ? true : true,
  },
  {
    id: 4,
    label: "_global.resources",
    routeURL: "/organizations/" + id + "/resources",
    iconURL: "IconResource",
    selected: useRoute().path.split("/").pop() === "resources" ? true : true,
  },
  {
    id: 5,
    label: "_global.faq",
    routeURL: "/organizations/" + id + "/faq",
    iconURL: "IconFAQ",
    selected: useRoute().path.split("/").pop() === "faq" ? true : true,
  },
  {
    id: 6,
    label: "_global.team",
    routeURL: "/organizations/" + id + "/team",
    iconURL: "bi:people",
    selected: useRoute().path.split("/").pop() === "team" ? true : true,
  },
  {
    id: 7,
    label: "_global.affiliates",
    routeURL: "/organizations/" + id + "/affiliates",
    iconURL: "IconSupport",
    selected: useRoute().path.split("/").pop() === "affiliates" ? true : true,
  },
  {
    id: 8,
    label: "_global.tasks",
    routeURL: "/organizations/" + id + "/tasks",
    iconURL: "bi:check-square",
    selected: useRoute().path.split("/").pop() === "tasks" ? true : true,
  },
  {
    id: 9,
    label: "_global.discussions",
    routeURL: "/organizations/" + id + "/discussions",
    iconURL: "octicon:comment-discussion-24",
    selected: useRoute().path.split("/").pop() === "discussions" ? true : true,
  },
  {
    id: 10,
    label: "_global.settings",
    routeURL: "/organizations/" + id + "/settings",
    iconURL: "bi:gear",
    selected: useRoute().path.split("/").pop() === "settings" ? true : true,
  },
];

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > Breakpoint.SMALL) {
    const { locale } = useI18n();
    const currentRoute = useRoute();

    console.log(`Hey 1: ${currentRoute.path}`);
    if (
      currentRoute.path !== `/${locale.value}/organizations/${id}/about` ||
      currentRoute.path === `/${locale.value}/organizations/${id}/`
    ) {
      navigateTo(`/${locale.value}/organizations/${id}/about`);
    }
  }
};

onMounted(() => {
  handleResize();

  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
