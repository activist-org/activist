<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
      :formData="formData"
      getInvolvedLabel="i18n.components._global.participate"
      getInvolvedUrlLabel="i18n.components.modal_text_event.offer_to_help_link"
      :handleSubmit="handleSubmit"
      rememberHttpsLabel="i18n.components.modal_text_event.offer_to_help_link_label"
      submitLabel="i18n.components.modal._global.update_texts"
      title="i18n.components.modal_text_event.edit_event_texts"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalTextEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : "";

const { data: event } = useGetEvent(eventId);
const { updateTexts } = useEventTextsMutations(eventId);

const formData = ref<EventUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = event.value?.texts[0]?.description || "";
  formData.value.getInvolved = event.value?.texts[0]?.getInvolved || "";
  formData.value.getInvolvedUrl = event.value?.texts[0]?.getInvolvedUrl || "";
});

watch(
  event,
  (newValues) => {
    formData.value.description = newValues?.texts[0]?.description || "";
    formData.value.getInvolved = newValues?.texts[0]?.getInvolved || "";
    formData.value.getInvolvedUrl = newValues?.texts[0]?.getInvolvedUrl || "";
  },
  {
    deep: true,
  }
);

/**
 * Handles the submission of the event text update form. This function takes the form values as input, calls the updateTexts function to send the updated data to the server, and if the response is successful, it closes the modal. The function ensures that the event texts are updated correctly and provides feedback to the user by closing the modal upon a successful update.
 * @param values The values from the event text update form, which include the description, get involved text, and get involved URL. These values are used to update the event's texts on the server when the form is submitted. The function processes these values and interacts with the updateTexts mutation to perform the update operation.
 */
async function handleSubmit(values: unknown) {
  const response = await updateTexts(
    values as EventUpdateTextFormData,
    String(event.value?.texts[0]?.id)
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
