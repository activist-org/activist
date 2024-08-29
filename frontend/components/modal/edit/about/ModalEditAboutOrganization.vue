<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalIsOpen"
    :modalName="modalName"
  >
    <div class="flex flex-col space-y-7">
      <div class="flex flex-col space-y-3 text-light-text dark:text-dark-text">
        <label for="textarea" class="responsive-h2">{{
          $t("_global.about")
        }}</label>
        <textarea
          v-model="formData.description"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
        />
      </div>
      <div class="flex flex-col space-y-3 text-light-text dark:text-dark-text">
        <label for="textarea" class="responsive-h2">{{
          $t("components._global.get_involved")
        }}</label>
        <textarea
          v-model="formData.getInvolved"
          id="textarea"
          class="focus-brand elem-shadow-sm min-h-32 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
        />
      </div>
      <div class="flex flex-col space-y-3 text-light-text dark:text-dark-text">
        <div class="flex flex-col space-y-2">
          <label for="input" class="responsive-h2">{{
            $t("components.modal.edit._global.join_organization_link")
          }}</label>
          <p>{{ $t("components.modal.edit._global.remember_https") }}</p>
          <input
            v-model="formData.getInvolvedURL"
            id="textarea"
            class="focus-brand elem-shadow-sm min-h-12 rounded-md bg-light-layer-2 px-3 py-2 dark:bg-dark-layer-2"
          />
        </div>
      </div>
      <BtnAction
        @click="handleSubmit()"
        :cta="true"
        :label="$t('components.modal.edit._global.update_texts')"
        fontSize="base"
        :ariaLabel="
          $t('components.modal.edit._global.update_texts_aria_label')
        "
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import type { OrganizationUpdateTextFormData } from "~/types/entities/organization";

const props = defineProps<{
  isOpen: boolean;
}>();

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchByID(id);

const { organization } = organizationStore;

const formData = ref<OrganizationUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedURL: "",
});

onMounted(() => {
  formData.value.description = organization.description;
  formData.value.getInvolved = organization.getInvolved;
  formData.value.getInvolvedURL = organization.getInvolvedURL;
});

async function handleSubmit() {
  const response = await organizationStore.updateTexts(
    organization,
    formData.value
  );
  if (response) {
    handleCloseModal();
  }
}

const modals = useModals();
const modalName = "ModalEditAboutOrganization";
let modalIsOpen = computed(() => props.isOpen);

onMounted(() => {
  modalIsOpen = computed(() => modals.modals[modalName].isOpen);
});

const handleCloseModal = () => {
  modals.closeModal(modalName);
};
</script>
