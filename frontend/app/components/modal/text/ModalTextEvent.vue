<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
      v-if="texts"
      :formData="formData"
      getInvolvedLabel="i18n.components._global.participate"
      getInvolvedUrlLabel="i18n.components.modal_text_event.offer_to_help_link"
      :handleSubmit="handleSubmit"
      :isLoading="loading"
      rememberHttpsLabel="i18n.components.modal_text_event.offer_to_help_link_label"
      submitLabel="i18n.components.modal._global.update_texts"
      title="i18n.components.modal_text_event.edit_event_texts"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalTextEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const props = defineProps<{
  entityId: string;
}>();

const eventId = computed(() => props.entityId);

const { data: event } = useGetEvent(eventId);
const { updateTexts, loading } = useEventTextsMutations(eventId, {
  update: {
    onSuccess: () => {
      handleCloseModal();
    },
  },
});

// The query resolves after the modal mounts, so rendering the form before the
// texts arrive prefills blanks and submits against an undefined text id.
const texts = computed(() => event.value?.texts[0]);

const formData = ref<EventUpdateTextFormData>({
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

  updateTexts({
    textId: String(textId),
    data: values as EventUpdateTextFormData,
  });
}
</script>
