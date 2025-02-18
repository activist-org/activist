<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalEditSocialLinks pageType="organization" />
  <ModalEditTextOrganization />
  <div class="flex flex-col bg-layer-0 px-4 text-primary-text xl:px-8">
    <Head>
      <Title>{{ organization.name }}</Title>
    </Head>
    <HeaderAppPage pageType="organization">
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
          ariaLabel="
            i18n._global.support_organization_aria_label
          "
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
            :ariaLabel="$t('i18n._global.share_organization_aria_label')"
          />
        </div>
        <ModalSharePage :cta="true" :organization="organization" />
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
          <MediaImageCarouselFull v-if="!textExpanded || !aboveLargeBP" />
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
import { useModalHandlers } from "~/composables/useModalHandlers";
import { BreakpointMap } from "~/types/breakpoint-map";
import { IconMap } from "~/types/icon-map";

const { openModal: openModalSharePage } = useModalHandlers("ModalSharePage");

const aboveLargeBP = useBreakpoint("lg");

const paramsOrgId = useRoute().params.orgId;
const orgId = typeof paramsOrgId === "string" ? paramsOrgId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(orgId);

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
