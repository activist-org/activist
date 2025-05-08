<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :modalName="modalName"
  >
    <div class="flex flex-col space-y-7">
      <div
        v-for="(s, i) in sectionsToEdit"
        :key="i"
        class="flex flex-col space-y-3 text-primary-text"
      >
        <label for="textarea" class="responsive-h2">{{ s }}</label>
        <textarea
          v-if="
            s !==
              $t('i18n.components.modal.edit._global.join_organization_link') &&
            s !== $t('i18n.components.modal.edit._global.join_group_link') &&
            s !== $t('i18n.components.modal.edit._global.offer_to_help_link')
          "
          v-model="translatedTexts[i]"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-layer-2 px-3 py-2"
        />
        <div v-else class="flex flex-col space-y-2">
          <p>{{ $t("i18n.components.modal.edit._global.remember_https") }}</p>
          <input
            v-model="editedTexts[i]"
            id="textarea"
            class="focus-brand elem-shadow-sm min-h-12 rounded-md bg-layer-2 px-3 py-2"
          />
        </div>
      </div>
      <BtnAction
        @click="true"
        :cta="true"
        label="i18n.components.modal.edit._global.update_texts"
        fontSize="base"
        ariaLabel="i18n.components.modal.edit._global.update_texts_aria_label"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import type { FaqEntry } from "~/types/content/faq-entry";

const props = defineProps<{
  name?: string;
  faqEntry: FaqEntry;
  sectionsToEdit: string[];
  textsToEdit: string[];
  isOpen: boolean;
}>();

const i18n = useI18n();
const editedTexts = computed(() => props.textsToEdit);

const translatedTexts = computed(() => {
  return editedTexts.value.map((text) => {
    if (
      text === "i18n.components._global.working_groups_subtext" ||
      text === "i18n.components._global.join_organization_subtext" ||
      text === "i18n.components._global.join_group_subtext" ||
      text === "i18n.components._global.participate_subtext"
    ) {
      return i18n.t(text, { entity_name: props.name }) + ".";
    }
    return text;
  });
});

const modals = useModals();
const modalName = "ModalEditFAQEntry";
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName].isOpen);
});

const handleCloseModal = () => {
  modals.closeModal(modalName);
};
</script>
