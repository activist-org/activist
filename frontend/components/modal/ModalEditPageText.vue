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
        class="flex flex-col space-y-3 text-light-text dark:text-dark-text"
      >
        <label for="textarea" class="responsive-h2">{{ s }}</label>
        <textarea
          v-if="
            s !== $t('components._global.join-organization-link') &&
            s !== $t('components._global.join-group-link') &&
            s !== $t('components._global.offer-to-help-link')
          "
          v-model="translatedTexts[i]"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
        />
        <div v-else class="flex flex-col space-y-2">
          <p>{{ $t("components.modal-edit-page-text.remember-https") }}</p>
          <input
            v-model="editedTexts[i]"
            id="textarea"
            class="focus-brand elem-shadow-sm min-h-12 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
          />
        </div>
      </div>
      <BtnAction
        @click="true"
        :cta="true"
        :label="$t('components.modal-edit-page-text.update-texts')"
        fontSize="base"
        :ariaLabel="
          $t('components.modal-edit-page-text.update-texts-aria-label')
        "
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
const props = defineProps<{
  name?: string;
  sectionsToEdit: string[];
  textsToEdit: string[];
  isOpen: boolean;
}>();

const i18n = useI18n();
const editedTexts = computed(() => props.textsToEdit);

const translatedTexts = computed(() => {
  return editedTexts.value.map((text) => {
    if (
      text === "components.card-get-involved.working-groups-subtext" ||
      text === "components.card-get-involved.join-organization-subtext" ||
      text === "components.card-get-involved.join-group-subtext" ||
      text === "components.card-get-involved.participate-subtext"
    ) {
      return i18n.t(text, { entity_name: props.name }) + ".";
    }
    return text;
  });
});

const modals = useModals();
const modalName = "ModalEditPageText";
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName].isOpen);
});

const handleCloseModal = () => {
  modals.closeModal(modalName);
};
</script>
