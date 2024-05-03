<template>
  <div
    v-if="windowWidth < BreakpointMap.SMALL"
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
        :rightIcon="IconMap.ARROW_RIGHT"
        iconSize="1.25em"
        ariaLabel="components.btn-route-internal.offer-to-help-aria-label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import useRouteToName from "~/composables/useRouteToName";
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";
import type { MenuSelector } from "~/types/menu-selector";
import { testTechOrg } from "~/utils/testEntities";

definePageMeta({
  layout: "sidebar",
});

const emit = defineEmits(["routeToName"]);
useRouteToName(emit);

const organization = testTechOrg;

const { id } = useRoute().params;
const localePath = useLocalePath();

const organizationButtons: MenuSelector[] = [
  {
    id: 1,
    label: "_global.about",
    routeURL: "/organizations/" + id + "/about",
    iconURL: `${IconMap.ABOUT}`,
    selected: useRoute().path.split("/").pop() === "about" ? true : true,
  },
  {
    id: 2,
    label: "_global.events",
    routeURL: "/organizations/" + id + "/events",
    iconURL: `${IconMap.EVENT}`,
    selected: useRoute().path.split("/").pop() === "events" ? true : true,
  },
  {
    id: 3,
    label: "_global.groups",
    routeURL: "/organizations/" + id + "/groups",
    iconURL: `${IconMap.GROUP}`,
    selected: useRoute().path.split("/").pop() === "groups" ? true : true,
  },
  {
    id: 4,
    label: "_global.resources",
    routeURL: "/organizations/" + id + "/resources",
    iconURL: `${IconMap.RESOURCE}`,
    selected: useRoute().path.split("/").pop() === "resources" ? true : true,
  },
  {
    id: 5,
    label: "_global.faq",
    routeURL: "/organizations/" + id + "/faq",
    iconURL: `${IconMap.FAQ}`,
    selected: useRoute().path.split("/").pop() === "faq" ? true : true,
  },
  // {
  //   id: X,
  //   label: "_global.team",
  //   routeURL: "/organizations/" + id + "/team",
  //   iconURL: `${IconMap.PEOPLE}`,
  //   selected: useRoute().path.split("/").pop() === "team" ? true : true,
  // },
  {
    id: 6,
    label: "_global.affiliates",
    routeURL: "/organizations/" + id + "/affiliates",
    iconURL: `${IconMap.SUPPORT}`,
    selected: useRoute().path.split("/").pop() === "affiliates" ? true : true,
  },
  {
    id: 7,
    label: "_global.tasks",
    routeURL: "/organizations/" + id + "/tasks",
    iconURL: `${IconMap.TASK}`,
    selected: useRoute().path.split("/").pop() === "tasks" ? true : true,
  },
  {
    id: 8,
    label: "_global.discussions",
    routeURL: "/organizations/" + id + "/discussions",
    iconURL: `${IconMap.DISCUSSION}`,
    selected: useRoute().path.split("/").pop() === "discussions" ? true : true,
  },
  {
    id: 9,
    label: "_global.settings",
    routeURL: "/organizations/" + id + "/settings",
    iconURL: `${IconMap.SETTINGS}`,
    selected: useRoute().path.split("/").pop() === "settings" ? true : true,
  },
];

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > BreakpointMap.SMALL) {
    const { locale } = useI18n();
    const currentRoute = useRoute();

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

onUpdated(() => {
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
