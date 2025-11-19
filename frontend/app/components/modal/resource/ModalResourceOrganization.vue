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
const props = defineProps<{
  resource?: Resource;
}>();

const isAddMode = !props.resource;
const modalName = "ModalResourceOrganization" + (props.resource?.id ?? "");
const { handleCloseModal } = useModalHandlers(modalName);

const paramsOrganizationId = useRoute().params.orgId;
const organizationId =
  typeof paramsOrganizationId === "string" ? paramsOrganizationId : undefined;

const { data: organization } = useGetOrganization(organizationId || "");
const { createResource, updateResource } = useOrganizationResourcesMutations(
  organizationId || ""
);

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
      formData.value.topics = props.resource.topics || [];
      formData.value.order = props.resource.order;
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
        formData.value.topics = newValues.resource.topics || [];
        formData.value.order = newValues.resource.order;
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
    order:
      formData.value?.order ?? (organization.value?.resources ?? []).length,
  };
  if (isAddMode) await createResource(newValues as ResourceInput);
  else await updateResource(newValues as ResourceInput);
  handleCloseModal();
}
</script>
