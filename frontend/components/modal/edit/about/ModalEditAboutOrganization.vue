<template>
  <ModalBase
    @closeModal="handleCloseModal"
    :isOpen="modalShouldClose == false ? modalIsOpen : false"
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
          $t("components._global.get-involved")
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
            $t("components._global.join-organization-link")
          }}</label>
          <p>{{ $t("components.modal-edit-page-text.remember-https") }}</p>
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
import type { OrganizationTextFormData } from "~/types/entities/organization";

const props = defineProps<{
  isOpen: boolean;
}>();

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchByID(id);

const { organization } = organizationStore;

const formData = ref<OrganizationTextFormData>({
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

const modalIsOpen = computed(() => props.isOpen);
const modalShouldClose = ref(false);

const emit = defineEmits(["closeModal"]);
const handleCloseModal = () => {
  modalShouldClose.value = true;
  emit("closeModal");
  modalShouldClose.value = false;
};
</script>
