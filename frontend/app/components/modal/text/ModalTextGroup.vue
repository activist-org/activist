<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
      v-if="texts"
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

const props = defineProps<{
  entityId: string;
}>();

const groupId = computed(() => props.entityId);

const { data: group } = useGetGroup(groupId);
const { updateTexts } = useGroupTextsMutations(groupId);

// The query resolves after the modal mounts, so rendering the form before the
// texts arrive prefills blanks and submits against an undefined text id.
const texts = computed(() => group.value?.texts?.[0]);

const formData = ref<GroupUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

watch(
  texts,
  (newValues) => {
    formData.value.description = newValues?.description || "";
    formData.value.getInvolved = newValues?.getInvolved || "";
    formData.value.getInvolvedUrl = newValues?.getInvolvedUrl || "";
  },
  {
    deep: true,
    immediate: true,
  }
);

async function handleSubmit(values: unknown) {
  const textId = texts.value?.id;
  if (!textId) {
    return;
  }

  const response = await updateTexts({
    textId: String(textId),
    data: values as GroupUpdateTextFormData,
  });
  if (response) {
    handleCloseModal();
  }
}
</script>
