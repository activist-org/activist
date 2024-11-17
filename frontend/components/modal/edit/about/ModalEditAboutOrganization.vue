<template>
  <ModalBase :modalName="modalName">
    <div class="flex flex-col space-y-7">
      <div class="text-primary-text flex flex-col space-y-3">
        <label for="textarea" class="responsive-h2">{{
          $t("_global.about")
        }}</label>
        <textarea
          v-model="formData.description"
          id="textarea"
          class="focus-brand elem-shadow-sm bg-layer-2 min-h-32 rounded-md px-3 py-2"
        />
      </div>
      <div class="text-primary-text flex flex-col space-y-3">
        <label for="textarea" class="responsive-h2">{{
          $t("components._global.get_involved")
        }}</label>
        <textarea
          v-model="formData.getInvolved"
          id="textarea"
          class="focus-brand elem-shadow-sm bg-layer-2 min-h-32 rounded-md px-3 py-2"
        />
      </div>
      <div class="text-primary-text flex flex-col space-y-3">
        <div class="flex flex-col space-y-2">
          <label for="input" class="responsive-h2">{{
            $t("components.modal.edit._global.join_organization_link")
          }}</label>
          <p>{{ $t("components.modal.edit._global.remember_https") }}</p>
          <input
            v-model="formData.getInvolvedUrl"
            id="textarea"
            class="focus-brand elem-shadow-sm bg-layer-2 min-h-12 rounded-md px-3 py-2"
          />
        </div>
      </div>
      <BtnAction
        @click="handleSubmit()"
        :cta="true"
        :label="$t('components.modal.edit._global.update_texts')"
        fontSize="base"
        :ariaLabel="$t('components.modal.edit._global.update_texts_aria_label')"
      />
    </div>
  </ModalBase>
</template>

<script setup lang="ts">
import { useModalHandlers } from "~/composables/useModalHandlers";
import type { OrganizationUpdateTextFormData } from "~/types/entities/organization";

const modalName = "ModalEditAboutOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const idParam = useRoute().params.id;
const id = typeof idParam === "string" ? idParam : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(id);

const { organization } = organizationStore;

const formData = ref<OrganizationUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = organization.description;
  formData.value.getInvolved = organization.getInvolved;
  formData.value.getInvolvedUrl = organization.getInvolvedUrl;
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
</script>
