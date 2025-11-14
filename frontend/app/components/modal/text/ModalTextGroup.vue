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

const modalName = "ModalTextGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const { data: group } = useGetGroup(groupId || "");
const { updateTexts } = useGroupTextsMutations(groupId || "");

const formData = ref<GroupUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = group.value?.texts[0]?.description || "";
  formData.value.getInvolved = group.value?.texts[0]?.getInvolved || "";
  formData.value.getInvolvedUrl = group.value?.texts[0]?.getInvolvedUrl || "";
});

watch(
  group,
  (newValues) => {
    formData.value.description = newValues?.texts[0]?.description || "";
    formData.value.getInvolved = newValues?.texts[0]?.getInvolved || "";
    formData.value.getInvolvedUrl = newValues?.texts[0]?.getInvolvedUrl || "";
  },
  {
    deep: true,
  }
);

async function handleSubmit(values: unknown) {
  const response = await updateTexts(
    values as GroupUpdateTextFormData,
    String(group.value?.texts[0]?.id)
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
