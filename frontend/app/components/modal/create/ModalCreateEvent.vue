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

function normalizeEventPayload(raw: Record<string, unknown>): CreateEventInput {
  const { createAnother, ...rest } = raw;
  const payload = { ...rest } as Record<string, unknown>;

  if (Array.isArray(payload.orgs)) {
    payload.orgs = payload.orgs.map((o: unknown) =>
      typeof o === "object" && o !== null && "id" in o
        ? (o as { id: string }).id
        : o
    );
  }
  if (Array.isArray(payload.groups)) {
    payload.groups = payload.groups.map((g: unknown) =>
      typeof g === "object" && g !== null && "id" in g
        ? (g as { id: string }).id
        : g
    );
  }
  if (
    payload.location &&
    typeof payload.location === "object" &&
    payload.location !== null
  ) {
    const loc = payload.location as Record<string, unknown>;
    const { id: _id, ...locRest } = loc;
    if (typeof locRest.lat === "number") locRest.lat = String(locRest.lat);
    if (typeof locRest.lon === "number") locRest.lon = String(locRest.lon);
    if (Array.isArray(locRest.bbox)) {
      locRest.bbox = locRest.bbox.map((x: unknown) => String(x));
    }
    payload.location = locRest;
  }
  if (Array.isArray(payload.times)) {
    payload.times = payload.times.map((t: unknown) => {
      const row = t as Record<string, unknown>;
      const out = { ...row };
      if (row.start_time instanceof Date) {
        out.start_time = row.start_time.toISOString();
      }
      if (row.end_time instanceof Date) {
        out.end_time = row.end_time.toISOString();
      }
      return out;
    });
  }
  return payload as unknown as CreateEventInput;
}

// Runs mid-machine during the "loop" node.
async function handleLoopSubmit(iterationData: unknown) {
  const dataToSubmit = Object.values(
    iterationData as ContextCreateEventData
  ).reduce((acc, d) => ({ ...acc, ...(d as Record<string, unknown>) }), {});
  const normalized = normalizeEventPayload(
    dataToSubmit as Record<string, unknown>
  );
  return create(normalized); // Returns to useFlowScreens
}

/**
 * This function will be called by the machine when the flow completes.
 * @param {unknown} finalData The consolidated data from all steps.
 */
async function handleSubmission(_finalData: unknown) {
  // Close the modal (routing by createdEventIds can be added later).
  handleCloseModal();
}

// Pass the handler to the machine via its options.
const flowOptions = {
  onSubmit: handleSubmission,
  autoStart: true,
  onAction: handleLoopSubmit, // pass the loop submission handler
};
</script>
