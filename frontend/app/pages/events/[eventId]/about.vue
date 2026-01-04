<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalSocialLinksEvent />
  <ModalTextEvent />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ event?.name }}</Title>
    </Head>
    <HeaderAppPageEvent>
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <ModalSharePage v-if="event" :cta="true" :event="event" />
        <BtnRouteExternal
          v-if="event?.texts[0]?.getInvolvedUrl"
          ariaLabel="i18n._global.offer_to_help_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.45em"
          label="i18n._global.offer_to_help"
          :linkTo="event?.texts[0]?.getInvolvedUrl"
          :rightIcon="IconMap.ARROW_RIGHT"
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
          ariaLabel="i18n._global.share_event_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          :hideLabelOnMobile="false"
          iconSize="1.45em"
          :label="shareButtonLabel"
          :rightIcon="IconMap.SHARE"
        />
        <BtnAction
          @click="downloadCalendarEntry"
          @keydown.enter="downloadCalendarEntry"
          ariaLabel="i18n._global.subscribe_to_event_aria_label"
          class="w-max"
          :cta="true"
          fontSize="sm"
          iconSize="1.25em"
          label="i18n.pages.events.about.subscribe_to_event"
          :rightIcon="IconMap.DATE"
        />
      </div>
    </HeaderAppPageEvent>
    <div class="space-y-6 pb-6">
      <div
        class="lg:grid lg:grid-cols-3 lg:grid-rows-1"
        :class="{
          'lg:space-x-6': !textExpanded,
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
        <MediaMapEvent
          v-if="event?.physicalLocation && !textExpanded"
          class="h-70 w-full"
          :event="event"
        />
      </div>
      <CardAboutEvent :event="event" />
      <CardGetInvolvedEvent
        disclaimer="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
        :event="event"
      />
      <CardConnectEvent />
    </div>
  </div>
</template>

<script setup lang="ts">
const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);

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

const downloadCalendarEntry = () => {};

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
