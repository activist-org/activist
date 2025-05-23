<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalEditSocialLinks pageType="event" />
  <ModalEditTextEvent />
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>{{ event.name }}</Title>
    </Head>
    <HeaderAppPageEvent>
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteExternal
          v-if="event.getInvolvedUrl"
          class="w-max"
          :cta="true"
          :linkTo="event.getInvolvedUrl"
          label="i18n._global.offer_to_help"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="i18n._global.offer_to_help_aria_label"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          label="i18n._global.support"
          :hideLabelOnMobile="true"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="event.supportingUsers.length"
          ariaLabel="i18n._global.support_event_aria_label"
        /> -->
        <BtnAction
          @click="openModalSharePage()"
          @keydown.enter="openModalSharePage()"
          class="w-max"
          :cta="true"
          label="shareButtonLabel"
          :hideLabelOnMobile="false"
          fontSize="sm"
          :rightIcon="IconMap.SHARE"
          iconSize="1.45em"
          ariaLabel="i18n._global.share_event_aria_label"
        />
        <ModalSharePage :cta="true" :event="event" />
      </div>
    </HeaderAppPageEvent>
    <div class="space-y-6 pb-6">
      <div
        class="lg:grid lg:grid-cols-3 lg:grid-rows-1"
        :class="{
          'lg:mr-6 lg:space-x-6': !textExpanded,
        }"
      >
        <CardDetails
          @expand-reduce-text="expandReduceText"
          class="mb-6 lg:mb-0"
          :class="{
            'lg:col-span-2': !textExpanded,
            'lg:col-span-3': textExpanded,
          }"
          :event="event"
        />
        <MediaMap
          v-if="event.offlineLocation && !textExpanded"
          class="h-[17.5rem] w-full"
          :eventNames="[event.name]"
          :eventTypes="[event.type]"
          :eventLocations="[event.offlineLocation]"
          :type="MapType.POINT"
        />
      </div>
      <CardAboutEvent :event="event" />
      <CardGetInvolvedEvent
        :event="event"
        disclaimer="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      />
      <CardConnectEvent />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from "~/types/events/event";

import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";
import { MapType } from "~/types/map";

const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");

defineProps<{
  event: Event;
}>();

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

const windowWidth = ref(window.innerWidth);

const shareButtonLabel = ref("");

function updateShareBtnLabel() {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value < BreakpointMap.SMALL) {
    shareButtonLabel.value = "i18n._global.share";
  } else {
    shareButtonLabel.value = "i18n._global.share_event";
  }
}

onMounted(() => {
  window.addEventListener("resize", updateShareBtnLabel);
  updateShareBtnLabel();
});

onUpdated(() => {
  updateShareBtnLabel();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateShareBtnLabel);
});
</script>
