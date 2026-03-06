<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<template>
  <ModalBase :modalName="modalName">
    <h2>{{ $t("i18n.components.modal_create_event.create_new_event") }}</h2>
    <Machine
      @close="handleCloseModal"
      :machine-type="MachineCreateType.CreateEvent"
      :options="flowOptions"
    />
  </ModalBase>
</template>

<script setup lang="ts">


const modalName = "ModalCreateEvent";
const { handleCloseModal } = useModalHandlers(modalName);
const { create } = useEventMutations();

// Runs mid-machine during the "loop" node
async function handleLoopSubmit(iterationData: unknown) {
  const dataToSubmit = Object.values(iterationData as ContextCreateEventData).reduce(
    (acc, d) => ({ ...acc, ...(d as Record<string, unknown>) }), {}
  );
  return create(dataToSubmit as unknown as CreateEventInput); // Returns to useFlowScreens
}

/**
 * This function will be called by the machine when the flow completes.
 * @param {unknown} finalData The consolidated data from all steps.
 */
async function handleSubmission(finalData: unknown) {
    console.log("Final data received from machine:", finalData);
    // 2. Extract the loop IDs we saved into `sharedData`
    const loopedEventIds = (finalData as { createdEventIds?: string[] }).createdEventIds || [];

    // 3. Combine all IDs
    const allIds = [...loopedEventIds];

    // 5. Route the user based on how many events were created
    if (allIds.length === 1) {
      // Just one event created, go to its page
      console.log("Navigating to event with ID:", allIds[0]);
    } else if (allIds.length > 1) {
      // Multiple events created, maybe go to a list or dashboard
      // Example: router.push({ name: "EventsList", query: { highlight: allIds.join(',') } });
      console.log("Navigating to events list with IDs:", allIds);
    }
    // 4. Close the modal
    handleCloseModal();
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
  onSubmitLoop: handleLoopSubmit, // Pass the loop submission handler
};
</script>
