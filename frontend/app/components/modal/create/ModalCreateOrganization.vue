// SPDX-License-Identifier: AGPL-3.0-or-later
<template>
  <ModalBase :modalName="modalName">
    <h2>Create a New Organization</h2>
    <!-- The machine now takes the `onSubmit` handler in its options -->
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

/**
 * This function will be called by the machine when the flow completes.
 * @param {any} finalData The consolidated data from all steps.
 */
async function handleSubmission() {
  // `finalData` is the clean, combined payload from the store's `submit()` action.

  // Call your API mutation here...
  // await createEvent(finalData);

  // Close the modal after submission.
  handleCloseModal();
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission, // <-- NEW
  autoStart: true, // Optional: start the flow immediately
};
</script>
