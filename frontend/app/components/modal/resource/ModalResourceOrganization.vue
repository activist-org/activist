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

/**
 * Handles the submission of the event resource form. This function takes the form values as input, processes them to determine whether to create a new resource or update an existing one based on the isAddMode flag, and then performs the necessary operation using the corresponding mutation. After the operation is completed successfully, the modal is closed to provide feedback to the user that their action has been processed.
 * @param values The values from the event resource form, which include the name, description, URL, topics, and order of the resource. These values are used to either create a new resource or update an existing one on the server when the form is submitted. The function processes these values and interacts with the createResource or updateResource mutation based on whether the form is in add mode or edit mode to perform the appropriate operation.
 */
async function handleSubmit(values: unknown) {
  const newValues = {
    ...formData.value,
    ...(values as Resource),
    order:
      formData.value?.order ?? (organization.value?.resources ?? []).length,
  };
  const success = isAddMode
    ? await createResource(newValues as ResourceInput)
    : await updateResource(newValues as ResourceInput);
  if (success) {
    handleCloseModal();
  }
}
</script>
