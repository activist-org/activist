<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <template v-for="(state, modalName) in modalStore.modals" :key="modalName">
    <!-- Only render the component if it is registered and open -->
    <component
      :is="modalRegistry[modalName]"
      v-if="state.isOpen && modalRegistry[modalName]"
      @close="modalStore.closeModal(modalName)"
      v-bind="{ ...(state.props || {}) }"
    />
  </template>
</template>

<script setup lang="ts">
const modalStore = useModals();

// Map string names to actual Vue components here.
const modalRegistry: Record<string, Component> = {
  ModalQRCode: defineAsyncComponent(() => import("./qr-code/ModalQRCode.vue")),
  ModalCreateEvent: defineAsyncComponent(
    () => import("./create/ModalCreateEvent.vue")
  ),
  ModalCreateGroup: defineAsyncComponent(
    () => import("./create/ModalCreateGroup.vue")
  ),
  ModalCreateOrganization: defineAsyncComponent(
    () => import("./create/ModalCreateOrganization.vue")
  ),
  ModalSharePage: defineAsyncComponent(() => import("./ModalSharePage.vue")),
  ModalCommandPalette: defineAsyncComponent(
    () => import("./ModalCommandPalette.vue")
  ),
  ModalFaqEntryEvent: defineAsyncComponent(
    () => import("./faq-entry/ModalFaqEntryEvent.vue")
  ),
  ModalFaqEntryGroup: defineAsyncComponent(
    () => import("./faq-entry/ModalFaqEntryGroup.vue")
  ),
  ModalFaqEntryOrganization: defineAsyncComponent(
    () => import("./faq-entry/ModalFaqEntryOrganization.vue")
  ),
  ModalResourceEvent: defineAsyncComponent(
    () => import("./resource/ModalResourceEvent.vue")
  ),
  ModalResourceGroup: defineAsyncComponent(
    () => import("./resource/ModalResourceGroup.vue")
  ),
  ModalResourceOrganization: defineAsyncComponent(
    () => import("./resource/ModalResourceOrganization.vue")
  ),
  ModalSocialLinksEvent: defineAsyncComponent(
    () => import("./social-links/ModalSocialLinksEvent.vue")
  ),
  ModalSocialLinksGroup: defineAsyncComponent(
    () => import("./social-links/ModalSocialLinksGroup.vue")
  ),
  ModalSocialLinksOrganization: defineAsyncComponent(
    () => import("./social-links/ModalSocialLinksOrganization.vue")
  ),
  ModalTextEvent: defineAsyncComponent(
    () => import("./text/ModalTextEvent.vue")
  ),
  ModalTextGroup: defineAsyncComponent(
    () => import("./text/ModalTextGroup.vue")
  ),
  ModalTextOrganization: defineAsyncComponent(
    () => import("./text/ModalTextOrganization.vue")
  ),
  ModalUploadImageIcon: defineAsyncComponent(
    () => import("./upload-image/ModalUploadImageIcon.vue")
  ),
  ModalUploadImageOrganization: defineAsyncComponent(
    () => import("./upload-image/ModalUploadImageOrganization.vue")
  ),
  ModalUploadImageGroup: defineAsyncComponent(
    () => import("./upload-image/ModalUploadImageGroup.vue")
  ),
  ModalMediaImage: defineAsyncComponent(() => import("./ModalMediaImage.vue")),
  ModalResourceDeleteEvent: defineAsyncComponent(
    () => import("./resource/delete/ModalResourceDeleteEvent.vue")
  ),
  ModalResourceDeleteGroup: defineAsyncComponent(
    () => import("./resource/delete/ModalResourceDeleteGroup.vue")
  ),
  ModalResourceDeleteOrganization: defineAsyncComponent(
    () => import("./resource/delete/ModalResourceDeleteOrganization.vue")
  ),
  ModalFaqEntryDeleteEvent: defineAsyncComponent(
    () => import("./faq-entry/delete/ModalFaqEntryDeleteEvent.vue")
  ),
  ModalFaqEntryDeleteGroup: defineAsyncComponent(
    () => import("./faq-entry/delete/ModalFaqEntryDeleteGroup.vue")
  ),
  ModalFaqEntryDeleteOrganization: defineAsyncComponent(
    () => import("./faq-entry/delete/ModalFaqEntryDeleteOrganization.vue")
  ),
  ModalAlert: defineAsyncComponent(() => import("./ModalAlert.vue")),
};
</script>
