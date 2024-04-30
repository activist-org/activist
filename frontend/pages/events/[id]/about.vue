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
          rightIcon="bi:arrow-right"
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
          leftIcon="bi:box-arrow-up"
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
          v-if="
            (event.offlineLocation && !textExpanded) ||
            (event.offlineLocation && isUnderLargeBP)
          "
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
import { Breakpoint } from "~/types/breakpoints";
import { testClimateEvent } from "~/utils/testEntities";

definePageMeta({
  layout: "sidebar",
});

const event = testClimateEvent;

const textExpanded = ref(false);
const expandReduceText = () => {
  textExpanded.value = !textExpanded.value;
};

const currentWidth = ref(window.innerWidth);
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
const shareButtonLabel = ref("");

function updateShareBtnLabel() {
  if (currentWidth.value < Breakpoint.SMALL) {
    shareButtonLabel.value = "components.btn-action.share";
  } else {
    shareButtonLabel.value = "components._global.share-group";
  }
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  updateShareBtnLabel();
});

const isUnderLargeBP = ref(false);

const checkUnderLargeBP = () => {
  isUnderLargeBP.value = window.innerWidth < 1024;
};

const handleResize = () => {
  checkUnderLargeBP();

  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  resizeTimeout = setTimeout(updateShareBtnLabel, 100);
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize(); // initial check
});

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>
