<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalEditSocialLinks pageType="group" />
  <ModalEditTextGroup />
  <MenuSubPageSelector
    class="pt-2 md:pt-0"
    :selectors="groupSubPages"
    :selectedRoute="0"
  />
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>{{ group.name }}</Title>
    </Head>
    <HeaderAppPage pageType="group">
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteExternal
          v-if="group.getInvolvedUrl"
          class="w-max"
          :cta="true"
          :linkTo="group.getInvolvedUrl"
          label="_global.join_group"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="_global.join_group_aria_label"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          label="_global.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="group.supporters"
          ariaLabel="
            pages.organizations.groups._global.support_group_aria_label
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
          :rightIcon="IconMap.SHARE"
          iconSize="1.45em"
          :ariaLabel="
            $t(i18nMap.pages.organizations.groups.about.share_group_aria_label)
          "
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
          <MediaImageCarouselFull v-if="!textExpanded || !aboveLargeBP" />
        </div>
      </div>
      <CardGetInvolvedGroup :group="group" />
      <CardConnect pageType="group" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";
import type { Group } from "~/types/communities/group";
import { getGroupSubPages } from "~/utils/groupSubPages";
import { i18nMap } from "~/types/i18n-map";

const aboveLargeBP = useBreakpoint("lg");

const paramsGroupId = useRoute().params.groupid;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);

const group: Group = groupStore.group;

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
    shareButtonLabel.value = "_global.share";
  } else {
    shareButtonLabel.value = "pages.organizations.groups.about.share_group";
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

const modals = useModals();
const modalName = "ModalSharePage";
const modalIsOpen = ref(false);

function openModal() {
  modals.openModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName].isOpen;
};
</script>
