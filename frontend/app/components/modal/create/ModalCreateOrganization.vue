<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <h2>
      {{
        $t("i18n.components.modal_create_organization.create_new_organization")
      }}
    </h2>
    <Machine
      @close="handleCloseModal"
      :machine-type="MachineCreateType.CreateOrganization"
      :options="flowOptions"
    />
  </ModalBase>
</template>

<script setup lang="ts">
const modalName = "ModalCreateOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const { create } = useOrganizationMutations();
const router = useRouter();
/**
 * This function will be called by the machine when the flow completes.
 * @param values The values from the organization creation form, which include the name, description, and other relevant information for creating an organization. This data is used to create a new organization on the server when the form is submitted. The function processes this data and interacts with the create mutation to perform the organization creation operation, allowing for the creation of a new organization based on the information provided in the form.
 */
async function handleSubmission(values: unknown) {
  const organization = await create(values as CreateOrganizationInput);
  // handleCloseModal();
  if (organization) {
    router.push(`/organizations/${organization.id}/about`);
  }
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
