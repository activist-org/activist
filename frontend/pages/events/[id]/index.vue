<template>
  <div
    v-if="windowWidth < BreakpointMap.SMALL"
    class="flex flex-col items-center justify-between gap-8 bg-light-layer-0 px-8 py-8 text-light-text dark:bg-dark-layer-0 dark:text-dark-text"
  >
    <Head>
      <Title>{{ event.name }} </Title>
    </Head>
    <div class="mx-auto h-[260px] w-3/4">
      <ImageEvent
        :eventType="event.type"
        :imgURL="event.iconURL ? event.iconURL : ''"
        :alt="
          $t('_global.entity_logo', {
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
            <span class="sr-only">{{ $t("_global.navigate_to") }}</span>
            {{ $t(button.label) }}
          </p>
        </div>
      </MenuLinkWrapper>
      <BtnRouteInternal
        class="w-max"
        :cta="true"
        linkTo="/"
        label="_global.offer_to_help"
        fontSize="base"
        :rightIcon="IconMap.ARROW_RIGHT"
        iconSize="1.25em"
        ariaLabel="_global.offer_to_help_aria_label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";
import type { MenuSelector } from "~/types/menu/menu-selector";
import { testClimateEvent } from "~/utils/testEntities";
import useMenuEntriesState from "~/composables/useMenuEntriesState";

const event = testClimateEvent;

const { id } = useRoute().params;
const localPath = useLocalePath();

const { eventEntry } = useMenuEntriesState();

const eventButtons: MenuSelector[] = [];

eventEntry.value.forEach((entry) => {
  eventButtons.push(entry);
});

const windowWidth = ref(window.innerWidth);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value > BreakpointMap.SMALL) {
    const { locale } = useI18n();
    const currentRoute = useRoute();

    if (
      currentRoute.path !== `/${locale.value}/events/${id}/about` ||
      currentRoute.path === `/${locale.value}/events/${id}/`
    ) {
      navigateTo(`/${locale.value}/events/${id}/about`);
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
