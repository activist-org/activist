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

/**
 * Handles the submission of each iteration of the event creation flow. This function takes the data from each step of the flow as input, processes it, and creates an event on the server using the create mutation. The function is designed to be called multiple times during the flow, allowing for the creation of multiple events if needed. The data from each step is consolidated and sent to the server to create an event, and any necessary feedback or updates can be handled based on the response from the server.
 * @param iterationData The data from each step of the event creation flow, which may include details such as the event name, description, date, location, and other relevant information. This data is used to create an event on the server when the user wants to create multiple events. The function processes these values and interacts with the create mutation to perform the event creation operation, allowing for multiple events to be created.
 * @returns The response from the create mutation, which will be the event created on the server. This return value can be used to provide feedback to the user or to perform additional actions based on the created event, such as routing to the event's detail page or updating the UI to reflect the new event.
 */
async function handleLoopSubmit(iterationData: unknown) {
  const dataToSubmit = Object.values(
    iterationData as ContextCreateEventData
  ).reduce((acc, d) => ({ ...acc, ...(d as Record<string, unknown>) }), {});
  return create(dataToSubmit as unknown as CreateEventInput); // Returns to useFlowScreens
}

/**
 * This function will be called by the machine when the flow completes.
 * @param finalData The consolidated data from all steps.
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

/**
 * Handles the routing after events have been created. This function takes the IDs of the created events, determines the appropriate route based on the number of events, and navigates the user accordingly. If only one event is created, the user is routed to the event's detail page. If multiple events are created, the user is routed to the events list page with the created event IDs included in the query parameters.
 * @param createdEventIds The IDs of the events that were created. This array is used to determine the routing logic, allowing the function to navigate the user to the appropriate page based on the number of events created.
 */
async function handleCreatedEventRouting(createdEventIds: string[]) {
  // Route the user based on how many events were created.
  if (!createdEventIds || createdEventIds.length === 0) return;

  if (createdEventIds.length === 1) {
    await router.push({
      path: `/events/${createdEventIds[0]}/about`,
    });
    return;
  }

  const viewQueryValue = route.query.view || ViewType.LIST; // default to 'list' if no view query param is present

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
