<template>
  <button
    v-if="type == 'icon'"
    @click="openModal()"
    @keydown.enter="openModal()"
    class="elem-on-card-style focus-brand absolute right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md sm:h-16 sm:w-16"
    :aria-label="$t('components.qr-code-btn.open-modal-aria-label')"
  >
    <div class="sm:hidden">
      <Icon
        name="bi:qr-code-scan"
        size="2em"
        :alt="$t('components.modal-qr-code.img-alt-text')"
      />
    </div>
    <div class="hidden sm:block">
      <Icon
        name="bi:qr-code-scan"
        size="3em"
        :alt="$t('components.modal-qr-code.img-alt-text')"
      />
    </div>
  </button>
  <MetaTagSocialMedia
    v-else
    @click="openModal()"
    @keydown.enter="openModal()"
    class="focus-brand dark:hover:dark-distinct-text text-light-text hover:text-light-distinct-text dark:text-dark-text"
    iconName="bi:qr-code-scan"
    :text="$t('components.meta-social-media-tag.qr-code')"
    iconSize="1.5em"
    tabindex="0"
  />
  <ModalQRCode
    v-if="organization"
    @closeModal="handleCloseModal"
    :organization="organization"
    :isOpen="modalIsOpen"
  />
  <ModalQRCode
    v-if="group"
    @closeModal="handleCloseModal"
    :group="group"
    :isOpen="modalIsOpen"
  />
  <ModalQRCode
    v-if="event"
    @closeModal="handleCloseModal"
    :event="event"
    :isOpen="modalIsOpen"
  />
</template>

<script setup lang="ts">
import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import type { Organization } from "~/types/organization";

defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
  type: "icon" | "meta-tag";
}>();

const modalIsOpen = ref(false);

function openModal() {
  modalIsOpen.value = true;
}

const handleCloseModal = () => {
  modalIsOpen.value = false;
};
</script>
