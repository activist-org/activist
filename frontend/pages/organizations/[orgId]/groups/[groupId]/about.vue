<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalSocialLinksGroup />
  <ModalTextGroup />
  <Tabs class="pt-2 md:pt-0" :tabs="groupTabs" :selectedTab="0" />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ group.name }}</Title>
    </Head>
    <HeaderAppPageGroup>
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <BtnRouteExternal
          v-if="group.getInvolvedUrl"
          class="w-max"
          :cta="true"
          :linkTo="group.getInvolvedUrl"
          label="i18n._global.join_group"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="i18n._global.join_group_aria_label"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          :label="i18n._global.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="group.supporters"
          ariaLabel="i18n.pages.organizations.groups._global.support_group_aria_label"
        /> -->
        <BtnAction
          @click="openModal()"
          @keydown.enter="openModal()"
          class="w-max"
          :cta="true"
          :label="shareButtonLabel"
          :hideLabelOnMobile="false"
          fontSize="sm"
          :rightIcon="IconMap.SHARE"
          iconSize="1.45em"
          ariaLabel="i18n.pages.organizations.groups.about.share_group_aria_label"
        />
        <ModalSharePage
          @closeModal="handleCloseModal"
          :cta="true"
          :group="group"
          :isOpen="modalIsOpen"
        />
      </div>
    </HeaderAppPageGroup>
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
          <MediaImageCarouselFull
            v-if="!textExpanded || !aboveLargeBP"
            :entityType="'group' as EntityType"
            :images="group.images || []"
            :entityId="group.id"
          />
        </div>
      </div>
      <CardGetInvolvedGroup :group="group" />
      <CardConnectGroup />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Group } from "~/types/communities/group";
import type { EntityType } from "~/types/entity";

import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";

defineProps<{
  group: Group;
}>();

const aboveLargeBP = useBreakpoint("lg");

const groupTabs = getGroupTabs();

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
    shareButtonLabel.value =
      "i18n.pages.organizations.groups.about.share_group";
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
