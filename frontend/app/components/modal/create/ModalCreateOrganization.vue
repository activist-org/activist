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

const router = useRouter();
const { create } = useOrganizationMutations({
  create: {
    onSuccess: (data: unknown) => {
      router.push(`/organizations/${(data as Organization).id}/about`);
    },
  },
});
/**
 * This function will be called by the machine when the flow completes.
 * @param {unknown} finalData The consolidated data from all steps.
 */
async function handleSubmission(values: unknown) {
  create(values as CreateOrganizationInput);
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
