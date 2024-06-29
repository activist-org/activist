<template>
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ organization.name }}</Title>
    </Head>
    <HeaderAppPage pageType="organization">
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteExternal
          v-if="organization.getInvolvedURL"
          class="w-max"
          :cta="true"
          :linkTo="organization.getInvolvedURL"
          label="components.btn-route-internal.join-organization"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.join-organization-aria-label"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="organization.supporters.length"
          ariaLabel="
            components.btn-action.support-organization-aria-label
          "
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
          :ariaLabel="$t('components._global.share-organization-aria-label')"
        />
        <ModalSharePage
          @closeModal="handleCloseModal"
          :cta="true"
          :organization="organization"
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
        <CardAboutOrganization
          @expand-reduce-text="expandReduceText"
          class="mb-6 lg:mb-0"
          :class="{
            'lg:col-span-2': !textExpanded,
            'lg:col-span-3': textExpanded,
          }"
        />
        <div class="h-full w-full">
          <MediaImageCarouselFull :class="{ 'lg:hidden': textExpanded }" />
        </div>
      </div>
      <CardGetInvolvedOrganization />
      <CardConnect pageType="organization" />
      <!-- <CardDonate
        v-if="organization.status === 2"
        :userIsAdmin="true"
        :donationPrompt="organization.donationPrompt"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchByID(id);

const { organization } = organizationStore;

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
    shareButtonLabel.value = "components._global.share-organization";
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
