<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div
    v-if="windowWidth < BreakpointMap.SMALL"
    class="flex flex-col items-center justify-between gap-8 bg-layer-0 px-8 py-8 text-primary-text"
  >
    <Head>
      <Title>{{ event.name }} </Title>
    </Head>
    <div class="mx-auto h-[260px] w-3/4">
      <ImageEvent
        :eventType="event.type"
        :imgUrl="event.iconUrl.fileObject ? event.iconUrl.fileObject : ''"
        :alt="
          $t('i18n._global.entity_logo', {
            entity_name: event?.name,
          })
        "
      />
    </div>
    <div class="flex flex-col items-center gap-2">
      <h1
        class="responsive-h1 text-center text-3xl font-bold text-primary-text"
      >
        {{ event.name }}
      </h1>
      <h2 class="responsive-h2 text-lg font-bold text-distinct-text">
        {{ event.tagline }}
      </h2>
    </div>
    <div class="flex w-full flex-col items-center gap-4">
      <MenuLinkWrapper
        v-for="[i, button] of eventButtons.entries()"
        :key="i"
        :to="localPath(button.routeUrl)"
        :selected="button.selected"
      >
        <div
          class="flex w-full items-center space-x-2 text-left text-sm font-medium"
        >
          <span class="width-1/6">
            <Icon
              v-if="button.iconUrl"
              :name="button.iconUrl"
              class="h-5 w-5 flex-shrink-0"
            />
          </span>
          <p
            class="width-5/6 hover:menu-selection select-none whitespace-nowrap text-lg font-bold"
          >
            <span class="sr-only">{{ $t("i18n._global.navigate_to") }}</span>
            {{ $t(button.label) }}
          </p>
        </div>
      </MenuLinkWrapper>
      <BtnRouteInternal
        class="w-max"
        :cta="true"
        linkTo="/"
        label="i18n._global.offer_to_help"
        fontSize="base"
        :rightIcon="IconMap.ARROW_RIGHT"
        iconSize="1.25em"
        ariaLabel="i18n._global.offer_to_help_aria_label"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuSelector } from "~/types/menu/menu-selector";

import useMenuEntriesState from "~/composables/useMenuEntriesState";
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);

const { event } = eventStore;

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
      currentRoute.path !== `/${locale.value}/events/${eventId}/about` ||
      currentRoute.path === `/${locale.value}/events/${eventId}/`
    ) {
      navigateTo(`/${locale.value}/events/${eventId}/about`);
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
