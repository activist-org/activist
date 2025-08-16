<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
      :formData="formData"
      :handleSubmit="handleSubmit"
      submitLabel="i18n.components.modal._global.update_texts"
      title="i18n.components.modal_text_group.edit_group_texts"
      getInvolvedLabel="i18n.components._global.get_involved"
      getInvolvedUrlLabel="i18n.components.modal_text_group.join_group_link"
      rememberHttpsLabel="i18n.components.modal.text._global.remember_https"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { GroupUpdateTextFormData } from "~/types/communities/group";

const modalName = "ModalTextGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);

const { group } = groupStore;

const formData = ref<GroupUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = group.texts.description || "";
  formData.value.getInvolved = group.texts.getInvolved || "";
  formData.value.getInvolvedUrl = group.getInvolvedUrl || "";
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
  const response = await groupStore.updateTexts(
    group,
    values as GroupUpdateTextFormData
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
