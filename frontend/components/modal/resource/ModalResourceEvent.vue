<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <FormResource
      :formData="formData"
      :handleSubmit="handleSubmit"
      :submitLabel="submitLabel"
      :title="title"
    />
  </ModalBase>
</template>

<script setup lang="ts">
import type { Resource } from "~/types/content/resource";

const props = defineProps<{
  resource?: Resource;
}>();

const isAddMode = !props.resource;
const modalName = "ModalResourceEvent" + (props.resource?.id ?? "");
const { handleCloseModal } = useModalHandlers(modalName);

const paramsEventId = useRoute().params.eventId;
const eventId = typeof paramsEventId === "string" ? paramsEventId : undefined;

const eventStore = useEventStore();
await eventStore.fetchById(eventId);
const { event } = eventStore;

const formData = ref<Resource | undefined>();

const submitLabel = isAddMode
  ? "i18n.components.modal.resource._global.add_resource"
  : "i18n.components.modal._global.update_texts";

const title = isAddMode
  ? "i18n.components.modal.resource._global.add_resource"
  : "i18n.components.modal.faq_entry._global.edit_entry";
if (!isAddMode) {
  onMounted(async () => {
    if (props.resource) {
      formData.value = {} as Resource;
      formData.value.id = props.resource.id;
      formData.value.name = props.resource.name;
      formData.value.description = props.resource.description;
      formData.value.url = props.resource.url;
    }
  });

  watch(
    props,
    (newValues) => {
      if (newValues.resource) {
        formData.value = {} as Resource;
        formData.value.name = newValues.resource.name;
        formData.value.id = newValues.resource.id;
        formData.value.description = newValues.resource.description;
        formData.value.url = newValues.resource.url;
      }
    },
    {
      deep: true,
    }
  );
}
async function handleSubmit(values: unknown) {
  const newValues = {
    ...formData.value,
    ...(values as Resource),
    order: formData.value?.order || event.resources.length,
  };
  if (isAddMode) await eventStore.createResource(event, newValues as Resource);
  else await eventStore.updateResource(event, newValues as Resource);
  handleCloseModal();
}
</script>
