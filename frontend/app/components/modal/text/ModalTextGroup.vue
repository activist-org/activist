<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
      :formData="formData"
      getInvolvedLabel="i18n.components._global.get_involved"
      getInvolvedUrlLabel="i18n.components.modal_text_group.join_group_link"
      :handleSubmit="handleSubmit"
      rememberHttpsLabel="i18n.components.modal.text._global.remember_https"
      submitLabel="i18n.components.modal._global.update_texts"
      title="i18n.components.modal_text_group.edit_group_texts"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { GroupUpdateTextFormData } from "~/types/communities/group";

import { useGroupTextsMutations } from "~/composables/mutations/useGroupTextsMutations";

const modalName = "ModalTextGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const groupStore = useGroupStore();
const group = computed(() => groupStore.group!);
const { updateTexts } = useGroupTextsMutations(group.value.id);

const formData = ref<GroupUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = group.value.texts.description || "";
  formData.value.getInvolved = group.value.texts.getInvolved || "";
  formData.value.getInvolvedUrl = group.value.getInvolvedUrl || "";
});

watch(
  group,
  (newValues) => {
    formData.value.description = newValues.texts.description || "";
    formData.value.getInvolved = newValues.texts.getInvolved || "";
    formData.value.getInvolvedUrl = newValues.getInvolvedUrl || "";
  },
  {
    deep: true,
  }
);

async function handleSubmit(values: unknown) {
  const response = await updateTexts(
    values as GroupUpdateTextFormData,
    String(group.value.texts?.id)
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
