<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <h2>{{ $t("i18n.components.modal_create_group.create_new_group") }}</h2>
    <Machine
      @close="handleCloseModal"
      :machine-type="MachineCreateType.CreateGroup"
      :options="flowOptions"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalCreateGroup";
const { handleCloseModal } = useModalHandlers(modalName);

const { create } = useGroupMutations();

const router = useRouter();

/**
 * This function will be called by the machine when the flow completes.
 * @param value The values from the group creation form, which include the name, description, and other relevant information for creating a group. This data is used to create a new group on the server when the form is submitted. The function processes this data and interacts with the create mutation to perform the group creation operation, allowing for the creation of a new group based on the information provided in the form.
 */
async function handleSubmission(value: unknown) {
  const group = await create(value as CreateGroupInput);
  if (group)
    router.push(`/organizations/${group.org.id}/groups/${group.id}/about`);
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
