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
import { useRouter } from "vue-router";
import { useOrganizationMutations } from "@/composables/mutations";

const router = useRouter();
const modalName = "ModalCreateOrganization";
const { handleCloseModal } = useModalHandlers(modalName);

const { create } = useOrganizationMutations();
/**
 * This function will be called by the machine when the flow completes.
 * @param {unknown} finalData The consolidated data from all steps.
 */
async function handleSubmission(finalData: unknown) {
  const values = finalData as CreateOrganizationInput;

  const result = await create(values);

  console.log("RESULT.ID:", result.id);
  await router.push(`/organizations/${result.id}/about`);

  handleCloseModal();
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
