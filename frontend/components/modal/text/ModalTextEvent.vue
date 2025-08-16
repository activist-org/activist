<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormTextEntity
      :formData="formData"
      :handleSubmit="handleSubmit"
      submitLabel="i18n.components.modal._global.update_texts"
      title="i18n.components.modal_text_event.edit_event_texts"
      getInvolvedLabel="i18n.components._global.participate"
      getInvolvedUrlLabel="i18n.components.modal_text_event.offer_to_help_link"
      rememberHttpsLabel="i18n.components.modal_text_event.offer_to_help_link_label"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { EventUpdateTextFormData } from "~/types/events/event";

const modalName = "ModalTextEvent";
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;
const eventStore = useEventStore();
await eventStore.fetchById(eventId);

const { event } = eventStore;

const formData = ref<EventUpdateTextFormData>({
  description: "",
  getInvolved: "",
  getInvolvedUrl: "",
});

onMounted(() => {
  formData.value.description = event.texts.description || "";
  formData.value.getInvolved = event.texts.getInvolved || "";
  formData.value.getInvolvedUrl = event.getInvolvedUrl || "";
});

watch(
  event,
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
  const response = await eventStore.updateTexts(
    event,
    values as EventUpdateTextFormData
  );
  if (response) {
    handleCloseModal();
  }
}
</script>
