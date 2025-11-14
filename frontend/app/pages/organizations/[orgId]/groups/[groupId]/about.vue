<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalSocialLinksGroup />
  <ModalTextGroup />
  <Tabs class="pt-2 md:pt-0" :selectedTab="0" :tabs="groupTabs" />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ group?.name }}</Title>
    </Head>
    <HeaderAppPageGroup>
      <div class="flex space-x-2 pb-3 lg:space-x-3 lg:pb-4">
        <ModalSharePage
          v-if="group"
          @closeModal="handleCloseModal"
          :cta="true"
          :group="group"
          :isOpen="modalIsOpen"
        />
        <BtnRouteExternal
          v-if="group?.texts[0]?.getInvolvedUrl"
          ariaLabel="i18n._global.join_group_aria_label"
          class="w-max"
          :cta="true"
          data-testid="header-join-button"
          fontSize="sm"
          iconSize="1.45em"
          label="i18n._global.join_group"
          :linkTo="group?.texts[0]?.getInvolvedUrl"
          :rightIcon="IconMap.ARROW_RIGHT"
        />
        <!-- <BtnAction
          class="w-max"
          :cta="true"
          :label="i18n._global.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="group.supporters"
        /> -->
        <BtnAction
          @click="openModal()"
          @keydown.enter="openModal()"
          ariaLabel="i18n.pages.organizations.groups.about.share_group_aria_label"
          class="w-max"
          :cta="true"
          data-testid="header-share-button"
          fontSize="sm"
          :hideLabelOnMobile="false"
          iconSize="1.45em"
          :label="shareButtonLabel"
          :rightIcon="IconMap.SHARE"
        />
      </div>
    </HeaderAppPageGroup>
    <div class="space-y-6 pb-6">
      <div
        class="lg:grid lg:grid-cols-3 lg:grid-rows-1"
        :class="{
          'lg:space-x-6': !textExpanded,
        }"
      >
        <CardAboutGroup
          @expand-reduce-text="expandReduceText"
          aboutType="organization"
          class="mb-6 lg:mb-0"
          :class="{
            'lg:col-span-2': !textExpanded,
            'lg:col-span-3': textExpanded,
          }"
          :group="group"
        />
        <div class="h-full w-full">
          <MediaImageCarouselFull
            v-if="!textExpanded || !aboveLargeBP"
            :entityId="group?.id || ''"
            :entityType="'group' as EntityType"
            :images="images || []"
          />
        </div>
      </div>
      <CardGetInvolvedGroup :group="group" />
      <CardConnectGroup />
    </div>
  </div>
</template>

<script setup lang="ts">

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : "";

const { data: group } = useGetGroup(groupId);
const { data: images } = useGetGroupImages(groupId);

const aboveLargeBP = useBreakpoint("lg");

const groupTabs = useGetGroupTabs();

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
  modalIsOpen.value = modals.modals[modalName]?.isOpen ?? false;
}

const handleCloseModal = () => {
  modals.closeModal(modalName);
  modalIsOpen.value = modals.modals[modalName]?.isOpen ?? false;
};
</script>
