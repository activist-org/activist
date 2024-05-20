<template>
  <div class="card-style px-5 py-5">
    <div class="relative flex flex-col lg:flex-row">
      <div class="flex items-center gap-5">
        <h3
          v-if="organization || group"
          class="responsive-h3 text-left font-display"
        >
          {{ $t("components._global.get-involved") }}
        </h3>
        <h3 v-else class="responsive-h3 text-left font-display">
          {{ $t("components._global.participate") }}
        </h3>
        <IconEdit @click="openModal()" @keydown.enter="openModal()" />
        <ModalEditPageText
          v-if="organization"
          @closeModal="handleCloseModal"
          :name="organization.name"
          :sectionsToEdit="[
            $t('_global.about'),
            $t('components._global.get-involved'),
            $t('components._global.join-organization-link'),
          ]"
          :textsToEdit="[descriptionText, getInvolvedText, getInvolvedURL]"
          :isOpen="modalIsOpen"
        />
        <ModalEditPageText
          v-if="group"
          @closeModal="handleCloseModal"
          :name="group.name"
          :sectionsToEdit="[
            $t('_global.about'),
            $t('components._global.get-involved'),
            $t('components._global.join-group-link'),
          ]"
          :textsToEdit="[descriptionText, getInvolvedText, getInvolvedURL]"
          :isOpen="modalIsOpen"
        />
        <ModalEditPageText
          v-if="event"
          @closeModal="handleCloseModal"
          :sectionsToEdit="[
            $t('_global.about'),
            $t('components._global.participate'),
            $t('components._global.offer-to-help-link'),
          ]"
          :textsToEdit="[descriptionText, getInvolvedText, getInvolvedURL]"
          :isOpen="modalIsOpen"
        />
      </div>
      <div class="flex space-x-2 pt-2 lg:absolute lg:right-0 lg:pt-0">
        <BtnRouteInternal
          v-if="organization && organization.groups"
          :cta="true"
          :linkTo="'/organizations/' + id + '/groups'"
          label="components.btn-route-internal.view-all-groups"
          fontSize="sm"
          ariaLabel="components.btn-route-internal.view-all-groups-aria-label"
        />
        <BtnRouteInternal
          v-if="organization && organization.getInvolvedURL"
          :cta="true"
          :linkTo="organization.getInvolvedURL"
          label="components.btn-route-internal.join-organization"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.join-organization-aria-label"
        />
        <BtnRouteInternal
          v-else-if="group && group.getInvolvedURL"
          :cta="true"
          :linkTo="group.getInvolvedURL"
          label="components.btn-route-internal.join-group"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.join-group-aria-label"
        />
      </div>
    </div>
    <div v-if="organization" class="mt-4">
      <div v-if="organization.groups">
        <p>
          {{
            $t("components.card-get-involved.working-groups-subtext", {
              entity_name: organization.name,
            })
          }}:
        </p>
        <Feed :organization="organization" />
      </div>
      <div v-else>
        <p>
          {{
            $t("components.card-get-involved.join-organization-subtext", {
              entity_name: organization.name,
            })
          }}.
        </p>
      </div>
    </div>
    <div v-else-if="group" class="space-y-3 pt-3">
      <p>
        {{
          $t("components.card-get-involved.join-group-subtext", {
            org_name: group.name,
          })
        }}.
      </p>
    </div>
    <div v-else-if="event" class="space-y-3 pt-3">
      <p v-if="event.getInvolved">
        {{ event.getInvolved }}
      </p>
      <p v-else>{{ $t("components.card-get-involved.participate-subtext") }}</p>
      <!-- <p>
        {{ $t("components.card-get-involved.legal-disclaimer-subtext") }}
      </p>
      <CardLegalDisclaimer v-if="disclaimer" :disclaimer="disclaimer" /> -->
      <div class="flex w-max pt-2">
        <BtnRouteInternal
          class="w-full"
          :cta="true"
          linkTo="/"
          label="components.btn-route-internal.offer-to-help"
          fontSize="sm"
          :rightIcon="IconMap.ARROW_RIGHT"
          iconSize="1.45em"
          ariaLabel="components.btn-route-internal.offer-to-help-aria-label"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  useDescriptionText,
  useGetInvolvedText,
  useGetInvolvedURL,
} from "~/composables/useAppPageTexts";
import type { Event } from "~/types/event";
import type { Group } from "~/types/group";
import { IconMap } from "~/types/icon-map";
import type { Organization } from "~/types/organization";

const props = defineProps<{
  organization?: Organization;
  group?: Group;
  event?: Event;
  disclaimer?: string;
}>();

const { descriptionText } = useDescriptionText(props);
const { getInvolvedText } = useGetInvolvedText(props);
const { getInvolvedURL } = useGetInvolvedURL(props);

const { id } = useRoute().params;

const modals = useModals();
const modalName = "ModalEditPageText";
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
