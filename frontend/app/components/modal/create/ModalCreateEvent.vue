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
/**
 * This function will be called by the machine when the flow completes.
 * @param {unknown} finalData The consolidated data from all steps.
 */
async function handleSubmission(data: unknown) {
  // collect 'createdEventIds' from the flow context on submission and add final event ID
  const typedData = data as CreateEventInput;
  let createdEventIds: string[] = typedData.createdEventIds;
  const res = (await create(typedData)) as unknown as EventResponse;
  if (res) createdEventIds = [...createdEventIds, res.id];

  handleCloseModal();

  // return list of created event IDs to be handled by watcher in 'useFlowScreens.ts'
  return createdEventIds;
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
