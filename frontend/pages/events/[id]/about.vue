<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ event.name }}</Title>
    </Head>
    <HeaderAppPage :event="event">
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteExternal
          v-if="event.getInvolvedURL"
          class="w-max"
          :cta="true"
          :linkTo="event.getInvolvedURL"
          label="components.btn-route-internal.offer-to-help"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.offer-to-help-aria-label"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.support"
          :hideLabelOnMobile="true"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="event.supportingUsers.length"
          ariaLabel="components.btn-action.support-event-aria-label"
        /> -->
        <BtnAction
          @click="openModal()"
          @keydown.enter="openModal()"
          class="w-max"
          :cta="true"
          :label="$t(shareButtonLabel)"
          :hideLabelOnMobile="false"
          fontSize="sm"
          :leftIcon="IconMap.SHARE"
          iconSize="1.45em"
          :ariaLabel="$t('components._global.share-event-aria-label')"
        />
        <ModalSharePage
          @closeModal="handleCloseModal"
          :cta="true"
          :event="event"
          :isOpen="modalIsOpen"
        />
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
          aboutType="event"
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
      <CardAbout aboutType="event" :event="event" />
      <CardGetInvolved
        :event="event"
        disclaimer="Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
      />
      <CardConnect :social-links="event.socialLinks" :userIsAdmin="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";
import { testClimateEvent } from "~/utils/testEntities";

const event = testClimateEvent;

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

const windowWidth = ref(window.innerWidth);

const shareButtonLabel = ref("");

function updateShareBtnLabel() {
  windowWidth.value = window.innerWidth;
  if (windowWidth.value < BreakpointMap.SMALL) {
    shareButtonLabel.value = "components.btn-action.share";
  } else {
    shareButtonLabel.value = "components._global.share-group";
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

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>
