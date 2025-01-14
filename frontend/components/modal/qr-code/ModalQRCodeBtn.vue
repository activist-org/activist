<!-- This file doesn't use ModalBase, so we handle modal events in the script block below. -->

<template>
  <button
    v-if="type == 'icon'"
    @click="openModal()"
    @keydown.enter="openModal()"
    class="elem-on-card-style focus-brand absolute right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md sm:h-16 sm:w-16"
    :aria-label="$t('components.modal_qr_code_btn.open_modal_aria_label')"
  >
    <div class="sm:hidden">
      <Icon
        :name="IconMap.QR_CODE"
        size="2em"
        :alt="$t('components.modal_qr_code_btn.img_alt_text')"
      />
    </div>
    <div class="hidden sm:block">
      <Icon
        :name="IconMap.QR_CODE"
        size="3em"
        :alt="$t('components.modal_qr_code_btn.img_alt_text')"
      />
    </div>
  </button>
  <MetaTagSocialMedia
    v-else
    @click="openModal()"
    @keydown.enter="openModal()"
    class="focus-brand dark:hover:distinct-text text-primary-text hover:text-distinct-text"
    :iconName="IconMap.QR_CODE"
    :text="$t('components.modal_qr_code_btn.qr_code')"
    iconSize="1.5em"
    tabindex="0"
  />
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
import type { User } from "~/types/auth/user";
import type { Resource } from "~/types/content/resource";
import type { Group } from "~/types/communities/group";
import type { Organization } from "~/types/communities/organization";
import type { Event } from "~/types/events/event";
import { IconMap } from "~/types/icon-map";

defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
  resource?: Resource;
  user?: User;
  type: "icon" | "meta-tag";
}>();

const modals = useModals();
const modalName = "ModalsQRCode";
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
