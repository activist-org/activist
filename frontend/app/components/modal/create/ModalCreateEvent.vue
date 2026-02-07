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
  await create(data as CreateEventInput);
  handleCloseModal();
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
};
</script>
