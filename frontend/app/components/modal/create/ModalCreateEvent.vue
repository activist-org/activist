<template>
  <ModalBase :modalName="modalName">
    <div class="modal-content">
      <h2 class="modal-title">Create a New Event</h2>
      <!-- The machine now takes the `onSubmit` handler in its options -->
      <Machine
        machine-type="createEvent"
        :options="flowOptions"
        @close="handleCloseModal"
      />
    </div>
  </ModalBase>
</template>
<script setup lang="ts">
import Machine from "~/components/machine/Machine.vue";
// ... other imports

const modalName = "ModalCreateEvent";
const { handleCloseModal } = useModalHandlers(modalName);

/**
 * This function will be called by the machine when the flow completes.
 * @param {any} finalData The consolidated data from all steps.
 */
async function handleSubmission(finalData: any) {
  console.log("Flow finished! Ready to save data:", finalData);
  // `finalData` is the clean, combined payload from the store's `submit()` action.

  // Call your API mutation here...
  // await createEvent(finalData);

  // Close the modal after submission.
  handleCloseModal();
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onLogicNode: (nodeId: string) => {
    /* ... */
  },
  onSubmit: handleSubmission, // <-- NEW
  autoStart: true, // Optional: start the flow immediately
};
</script>
