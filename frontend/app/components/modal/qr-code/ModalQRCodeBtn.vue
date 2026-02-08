<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- Note: This file doesn't use ModalBase, so we handle modal events in the script block below. -->
<template>
  <button
    v-if="type == 'icon'"
    @click="openModal()"
    @keydown.enter="openModal()"
    :aria-label="$t('i18n.components.modal_qr_code_btn.open_modal_aria_label')"
    class="elem-on-card-style absolute right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md text-primary-text focus-brand sm:h-16 sm:w-16"
  >
    <div class="sm:hidden">
      <Icon
        :alt="$t('i18n.components.modal_qr_code_btn.img_alt_text')"
        class="-mb-1"
        :name="IconMap.QR_CODE"
        size="2em"
      />
    </div>
    <div class="hidden sm:block">
      <Icon
        :alt="$t('i18n.components.modal_qr_code_btn.img_alt_text')"
        class="-mb-1"
        :name="IconMap.QR_CODE"
        size="3em"
      />
    </div>
  </button>
  <div v-else>
    <MetaTagSocialMedia
      @click="openModal()"
      @keydown.enter="openModal()"
      class="dark:hover:distinct-text text-primary-text focus-brand hover:text-distinct-text"
      :iconName="IconMap.QR_CODE"
      iconSize="1.5em"
      tabindex="0"
      :text="$t('i18n.components.modal_qr_code_btn.qr_code')"
    />
    <p
      v-if="reasonForSuggesting"
      class="mt-0.5 text-xs italic text-distinct-text"
      role="note"
    >
      {{ reasonForSuggesting }}
    </p>
  </div>
  <ModalQRCode
    v-if="organization"
    @closeModal="handleCloseModal"
    :organization="organization"
  />
  <ModalQRCode v-if="group" @closeModal="handleCloseModal" :group="group" />
  <ModalQRCode v-if="event" @closeModal="handleCloseModal" :event="event" />
  <ModalQRCode
    v-if="resource"
    @closeModal="handleCloseModal"
    :resource="resource"
  />
  <ModalQRCode v-if="user" @closeModal="handleCloseModal" :user="user" />
</template>

<script setup lang="ts">
defineProps<{
  organization?: Organization;
  group?: Group;
  event?: CommunityEvent;
  resource?: Resource;
  user?: UserActivist;
  type: "icon" | "meta-tag";
  reasonForSuggesting: string;
}>();

const modals = useModals();
const modalName = "ModalsQRCode";
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
