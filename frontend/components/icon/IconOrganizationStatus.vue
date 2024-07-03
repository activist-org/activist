<template>
  <span v-if="status == 2">
    <button
      @click="openModal()"
      @keydown.enter="openModal()"
      class="has-tooltip w-5 cursor-pointer sm:w-6 md:w-7 xl:w-9"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          class="fill-light-accepted-green dark:fill-dark-accepted-green"
          d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417L5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
        />
        <path
          class="fill-light-accepted-green/40 dark:fill-dark-accepted-green/40"
          d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417L5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
        />
        <path
          class="fill-light-accepted-green dark:fill-dark-accepted-green"
          d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
        />
      </svg>
      <TooltipBase
        class="invisible -ml-32 mt-3 max-w-56 md:-ml-36 md:max-w-96"
        :text="
          $t(
            'components.modal-organization-status.approved-tooltip-hover-text',
            {
              entity_name: organization.name,
              year: new Date().toISOString().slice(0, 10),
              num_supporters: 6,
            }
          )
        "
      />
    </button>
    <ModalOrganizationStatus
      @closeModal="handleCloseModal"
      :organization="organization"
      :isOpen="modalIsOpen"
    />
  </span>
  <span v-else>
    <div class="has-tooltip w-5 sm:w-6 md:w-7 xl:w-9">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path
          class="fill-light-warn-yellow dark:fill-dark-warn-yellow"
          d="M7.002 12a1 1 0 1 1 2 0a1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"
        />
        <path
          class="fill-light-warn-yellow/40 dark:fill-dark-warn-yellow/40"
          d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"
        />
        <path
          class="fill-light-warn-yellow dark:fill-dark-warn-yellow"
          d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016a.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06a.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017a.163.163 0 0 1-.054-.06a.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"
        />
      </svg>
      <TooltipBase
        class="invisible -ml-32 mt-3 max-w-56 md:-ml-36 md:max-w-96"
        :text="
          $t('components.icon-organization-status.pending-tooltip-hover-text', {
            entity_name: organization.name,
          })
        "
      />
    </div>
  </span>
</template>

<script setup lang="ts">
import type { Organization } from "~/types/entities/organization";

defineProps<{
  status: number;
  organization: Organization;
}>();
const modals = useModals();
const modalName = "ModalOrganizationStatus";
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
