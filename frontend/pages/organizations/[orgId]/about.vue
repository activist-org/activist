<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalSocialLinksOrganization />
  <ModalTextOrganization />
  <div class="flex flex-col bg-layer-0 px-4 xl:px-8">
    <Head>
      <Title>{{ organization.name }}</Title>
    </Head>
    <HeaderAppPageOrganization>
      <div class="flex pb-3 lg:pb-4">
        <div class="flex space-x-2 lg:space-x-3">
          <BtnRouteExternal
            v-if="organization.getInvolvedUrl"
            class="w-max"
            :cta="true"
            :linkTo="organization.getInvolvedUrl"
            label="i18n._global.join_organization"
            fontSize="sm"
            :rightIcon="IconMap.ARROW_RIGHT"
            iconSize="1.45em"
            ariaLabel="i18n._global.join_organization_aria_label"
          />
          <!-- <BtnAction
          class="w-max"
          :cta="true"
          label="i18n._global.support"
          fontSize="sm"
          leftIcon="IconSupport"
          iconSize="1.45em"
          :counter="organization.supporters.length"
          ariaLabel="i18n._global.support_organization_aria_label"
        /> -->
          <BtnAction
            @click="openModalSharePage()"
            @keydown.enter="openModalSharePage()"
            class="w-max"
            :cta="true"
            :label="shareButtonLabel"
            :hideLabelOnMobile="false"
            fontSize="sm"
            :rightIcon="IconMap.SHARE"
            iconSize="1.45em"
            ariaLabel="i18n._global.share_organization_aria_label"
          />
        </div>
        <ModalSharePage :cta="true" :organization="organization" />
      </div>
    </HeaderAppPageOrganization>
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
          <MediaImageCarouselFull
            v-if="!textExpanded || !aboveLargeBP"
            :fileUploadEntity="FileUploadEntity.ORGANIZATION_CAROUSEL"
          />
        </div>
      </div>
      <CardGetInvolvedOrganization />
      <CardConnectOrganization />
      <!-- <CardDonate
        v-if="organization.status === 2"
        :userIsAdmin="true"
        :donationPrompt="organization.donationPrompt"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/communities/organization";

import { BreakpointMap } from "~/types/breakpoint-map";
import { FileUploadEntity } from "~/types/content/file-upload-entity";
import { IconMap } from "~/types/icon-map";

defineProps<{
  organization: Organization;
}>();

const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");

const aboveLargeBP = useBreakpoint("lg");

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
    shareButtonLabel.value = "i18n._global.share_organization";
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
