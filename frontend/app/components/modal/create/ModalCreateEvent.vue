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

const route = useRoute();
const router = useRouter();

// Runs mid-machine during the "loop" node.
async function handleLoopSubmit(iterationData: unknown) {
  const dataToSubmit = Object.values(
    iterationData as ContextCreateEventData
  ).reduce((acc, d) => ({ ...acc, ...(d as Record<string, unknown>) }), {});
  return create(dataToSubmit as unknown as CreateEventInput); // Returns to useFlowScreens
}

/**
 * This function will be called by the machine when the flow completes.
 * @param {unknown} finalData The consolidated data from all steps.
 */
async function handleSubmission(finalData: unknown) {
  // Extract the loop IDs we saved into `sharedData`.
  const loopedEventIds =
    (finalData as { createdEventIds?: string[] }).createdEventIds || [];

  // Combine all IDs.
  const allIds = [...loopedEventIds];
  await handleCreatedEventRouting(allIds);
  // Close the modal.
  handleCloseModal();
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
  onAction: handleLoopSubmit, // pass the loop submission handler
};

async function handleCreatedEventRouting(createdEventIds: string[]) {
  // Route the user based on how many events were created.
  if (!createdEventIds || createdEventIds.length === 0) return;

  if (createdEventIds.length === 1) {
    await router.push({
      path: `/events/${createdEventIds[0]}/about`,
    });
    return;
  }

  const viewQueryValue = route.query.view;

  // Preserve the next query in case we are navigating to a new path.
  const preserveNextQuery = useState("preserveNextQuery", () => false);
  preserveNextQuery.value = true;
  await router.push({
    path: "/events",
    query: {
      view: viewQueryValue,
      id: createdEventIds.join(","),
    },
  });
}
</script>
