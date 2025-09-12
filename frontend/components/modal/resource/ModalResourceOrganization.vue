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
const modalName = "ModalResourceOrganization" + (props.resource?.id ?? "");
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrganizationId = useRoute().params.organizationId;
const organizationId =
  typeof paramsOrganizationId === "string" ? paramsOrganizationId : undefined;

const organizationStore = useOrganizationStore();
await organizationStore.fetchById(organizationId);
const { organization } = organizationStore;

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
    order: formData.value?.order || organization.resources.length,
  };
  if (isAddMode)
    await organizationStore.createResource(
      organization,
      newValues as ResourceInput
    );
  else
    await organizationStore.updateResource(
      organization,
      newValues as ResourceInput
    );
  handleCloseModal();
}
</script>
