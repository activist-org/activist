<template>
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="0"
  />
  <div
    class="flex flex-col bg-light-layer-0 px-4 text-light-text dark:bg-dark-layer-0 dark:text-dark-text xl:px-8"
  >
    <Head>
      <Title>{{ group.name }}</Title>
    </Head>
    <HeaderAppPage :group="group">
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteExternal
          v-if="group.getInvolvedURL"
          class="w-max"
          :cta="true"
          :linkTo="group.getInvolvedURL"
          label="components.btn-route-internal.join-group"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.join-group-aria-label"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          label="components.btn-action.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="group.supporters"
          ariaLabel="
            components.btn-action.support-group-aria-label
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
          :ariaLabel="$t('components._global.share-group-aria-label')"
        />
        <ModalSharePage
          @closeModal="handleCloseModal"
          :cta="true"
          :group="group"
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
        <CardAboutGroup
          @expand-reduce-text="expandReduceText"
          class="mb-6 lg:mb-0"
          :class="{
            'lg:col-span-2': !textExpanded,
            'lg:col-span-3': textExpanded,
          }"
          aboutType="organization"
          :group="group"
        />
        <div class="h-full w-full">
          <MediaImageCarouselFull :class="{ 'lg:hidden': textExpanded }" />
        </div>
      </div>
      <CardGetInvolvedGroup :group="group" />
      <CardConnect pageType="group" />
      <!-- <CardDonate :userIsAdmin="true" :donationPrompt="group.donationPrompt" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import type { Group, GroupText } from "~/types/entities/group";
import { IconMap } from "~/types/icon-map";
import { getGroupSubPages } from "~/utils/groupSubPages";

const { id } = useRoute().params;

const [resOrg, resOrgTexts] = await Promise.all([
  useAsyncData(async () => await fetchWithToken(`/entities/groups/${id}`, {})),
  useAsyncData(
    async () => await fetchWithToken(`/entities/group_texts?org_id=${id}`, {})
  ),
]);

const group = resOrg.data as unknown as Group;
const groupTexts = resOrgTexts.data as unknown as GroupText;
const texts = groupTexts;

const groupSubPages = getGroupSubPages();

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
