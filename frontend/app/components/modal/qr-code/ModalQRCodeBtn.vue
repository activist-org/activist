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
    @closeModal="handleCloseModal"
    :fileName="computedFileName"
    :firstParagraph="firstParagraph"
    :linkUrl="linkUrl"
    :secondParagraph="secondParagraph ?? ''"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  type: "icon" | "meta-tag";
  reasonForSuggesting: string;
  firstParagraph: string;
  linkUrl: string;
  name?: string;
  secondParagraph?: string;
  fileName?: string;
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

const computedFileName = computed(() => {
  if (props.fileName) return props.fileName;
  return "qr_code_" + (props.name ?? "").toLowerCase().replaceAll(" ", "_");
});
</script>
