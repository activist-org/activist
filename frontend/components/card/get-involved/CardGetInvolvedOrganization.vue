<template>
  <CardGetInvolved>
    <div class="flex items-center gap-5">
      <h3 class="responsive-h3 text-left font-display">
        {{ $t("components._global.get_involved") }}
      </h3>
      <IconEdit @click="openModal()" @keydown.enter="openModal()" />
      <ModalEditAboutOrganization
        @closeModal="handleCloseModal"
        :organization="organization"
        :description="organization.description"
        :getInvolved="organization.getInvolved"
        :getInvolvedURL="organization.getInvolvedURL"
        :isOpen="modalIsOpen"
      />
    </div>
    <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
      <BtnRouteInternal
        v-if="organization.groups && organization.groups.length > 0"
        :cta="true"
        :linkTo="'/organizations/' + id + '/groups'"
        label="components.btn_route_internal.view_all_groups"
        fontSize="sm"
        ariaLabel="components.btn_route_internal.view_all_groups_aria_label"
      />
      <BtnRouteInternal
        v-if="organization && organization.getInvolvedURL"
        :cta="true"
        :linkTo="organization.getInvolvedURL"
        label="components.btn_route_internal.join_organization"
        fontSize="sm"
        :rightIcon="IconMap.ARROW_RIGHT"
        iconSize="1.45em"
        ariaLabel="components.btn_route_internal.join_organization_aria_label"
      />
    </div>
    <div class="mt-4">
      <div v-if="organization.groups && organization.groups.length > 0">
        <p>
          {{
            $t("components.card_get_involved.working_groups_subtext", {
              entity_name: organization.name,
            })
          }}:
        </p>
        <Feed :organization="organization" />
      </div>
      <div v-else>
        <p v-if="organization.getInvolved">
          {{ organization.getInvolved }}
        </p>
        <p v-else>
          {{
            $t("components.card_get_involved.join_organization_subtext", {
              entity_name: organization.name,
            })
          }}.
        </p>
      </div>
    </div>
  </CardGetInvolved>
</template>

<script setup lang="ts">
import { IconMap } from "~/types/icon-map";

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchByID(id);

const { organization } = organizationStore;

const modals = useModals();
const modalName = "ModalEditAboutOrganization";
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
