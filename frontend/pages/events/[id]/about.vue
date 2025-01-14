<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>{{ event.name }}</Title>
    </Head>
    <HeaderAppPage pageType="event">
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteExternal
          v-if="event.getInvolvedUrl"
          class="w-max"
          :cta="true"
          :linkTo="event.getInvolvedUrl"
          label="_global.offer_to_help"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="_global.offer_to_help_aria_label"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          label="_global.support"
          :hideLabelOnMobile="true"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="event.supportingUsers.length"
          ariaLabel="_global.support_event_aria_label"
        /> -->
        <BtnAction
          @click="openModalSharePage()"
          @keydown.enter="openModalSharePage()"
          class="w-max"
          :cta="true"
          :label="$t(shareButtonLabel)"
          :hideLabelOnMobile="false"
          fontSize="sm"
          :rightIcon="IconMap.SHARE"
          iconSize="1.45em"
          :ariaLabel="$t('_global.share_event_aria_label')"
        />
        <ModalSharePage :cta="true" :event="event" />
      </div>
    </HeaderAppPage>
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
          :markerColors="event.type === 'learn' ? ['#2176AE'] : ['#BA3D3B']"
          :eventNames="[event.name]"
          :eventLocations="[event.offlineLocation]"
        />
      </div>
      <CardAboutEvent :event="event" />
      <CardGetInvolvedEvent
        :event="event"
        disclaimer="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      />
      <CardConnect pageType="event" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";

const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(id);

const { event } = eventStore;

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

const windowWidth = ref(window.innerWidth);

const shareButtonLabel = ref("");

function updateShareBtnLabel() {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value < BreakpointMap.SMALL) {
    shareButtonLabel.value = "_global.share";
  } else {
    shareButtonLabel.value = "_global.share_event";
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
