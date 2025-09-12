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
import type { Resource, ResourceInput } from "~/types/content/resource";

const props = defineProps<{
  resource?: Resource;
}>();

const isAddMode = !props.resource;
const modalName = "ModalResourceGroup" + (props.resource?.id ?? "");
const { handleCloseModal } = useModalHandlers(modalName);

const paramsGroupId = useRoute().params.groupId;
const groupId = typeof paramsGroupId === "string" ? paramsGroupId : undefined;

const groupStore = useGroupStore();
await groupStore.fetchById(groupId);
const { group } = groupStore;

const formData = ref<Resource | undefined>();

const submitLabel = isAddMode
  ? "i18n.components.modal.resource._global.add_resource"
  : "i18n.components.modal.resource._global.update_resource";

const title = isAddMode
  ? "i18n.components.modal.resource._global.add_resource"
  : "i18n.components.modal.resource._global.edit_resource";
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
    topics: formData.value?.topics?.map((t) => t.type) || [],
    order: formData.value?.order || group.resources.length,
  };
  if (isAddMode)
    await groupStore.createResource(group, newValues as ResourceInput);
  else await groupStore.updateResource(group, newValues as ResourceInput);
  handleCloseModal();
}
</script>
