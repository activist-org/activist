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
const modalName = "ModalResourceEvent";
const { handleCloseModal } = useModalHandlers<{ resource?: Resource }>(
  modalName
);
const props = defineProps<{
  resource?: Resource;
  entityId: string;
}>();

const eventId = computed(() => props.entityId);

const { data: event } = useGetEvent(eventId);
const { updateResource, createResource } = useEventResourcesMutations(eventId);

const formData = ref<Resource | undefined>();

let isAddMode = true;
let submitLabel = "";
let title = "";

watch(
  () => props,
  (newProps) => {
    isAddMode = !newProps.resource;

    submitLabel = isAddMode
      ? "i18n.components.modal.resource._global.add_resource"
      : "i18n.components.modal.resource._global.update_resource";

    title = isAddMode
      ? "i18n.components.modal.resource._global.add_resource"
      : "i18n.components.modal.resource._global.edit_resource";

    if (!isAddMode) {
      formData.value = {} as Resource;
      formData.value.id = newProps.resource?.id || "";
      formData.value.name = newProps.resource?.name || "";
      formData.value.description = newProps.resource?.description || "";
      formData.value.url = newProps.resource?.url || "";
      formData.value.topics = newProps.resource?.topics || [];
      formData.value.order = newProps.resource?.order || 0;
    }
  },
  { immediate: true }
);

async function handleSubmit(values: unknown) {
  const newValues = {
    ...formData.value,
    ...(values as Resource),
    order: formData.value?.order ?? (event.value?.resources ?? []).length,
  };
  const success = isAddMode
    ? await createResource(newValues as ResourceInput)
    : await updateResource(newValues as ResourceInput);
  if (success) {
    handleCloseModal();
  }
}
</script>
