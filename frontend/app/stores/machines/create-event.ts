// SPDX-License-Identifier: AGPL-3.0-or-later
import { createFlowStore } from "./flow";

// Import your step components dynamically
const EventDetailsStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventDetails.vue");
const EventTypeStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventType.vue");
const EventLocationStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventLocation.vue");
const EventLinkOnlineStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventLinkOnline.vue");
const EventTimeStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventTime.vue");

if (import.meta.env.DEV) import('v-calendar')

  const { create } = useEventMutations();

export const useCreateEventStore = createFlowStore({
  machine: defineFlowMachine({
    id: "createEventFlow",
    initialNode: CreateEventSteps.EventDetails,
    totalSteps: 4,
    states: {
      [CreateEventSteps.EventDetails]: {
        label: "Details",
        type: "screen",
        step: 1,
        next: CreateEventSteps.EventType,
        component: EventDetailsStep,
      },

      [CreateEventSteps.EventType]: {
        label: "Type",
        type: "screen",
        step: 2,
        next: CreateEventSteps.OnlineOrPhysicalLocation,
        component: EventTypeStep,
      },

      [CreateEventSteps.OnlineOrPhysicalLocation]: {
        label: "Logic: Online or Physical?",
        type: "logic",
        next: (context) => {
          const nodeData = context.allNodeData as unknown as ContextCreateEventData;
          const stepData = nodeData[CreateEventSteps.EventType];
          const isOnline = stepData?.location_type === "online";

          return isOnline
            ? CreateEventSteps.LinkOnline
            : CreateEventSteps.Location;
        },
      },

      [CreateEventSteps.Location]: {
        label: "Physical Location",
        type: "screen",
        step: 3,
        next: CreateEventSteps.Time,
        component: EventLocationStep,
      },

      [CreateEventSteps.LinkOnline]: {
        label: "Online Link",
        type: "screen",
        step: 3,
        next: CreateEventSteps.Time,
        component: EventLinkOnlineStep,
      },

      [CreateEventSteps.Time]: {
        label: "Time",
        type: "screen",
        step: 4,
        next: CreateEventSteps.CreateMoreEventsOrNot,
        component: EventTimeStep,
        onExit: async (context:FlowContext) => {
            const nodeData = context.allNodeData as unknown as ContextCreateEventData;
            // Flatten the form data
            const dataToSubmit = Object.values(nodeData).reduce(
              (acc, d) => ({ ...acc, ...(d as Record<string, unknown>) }), {}
            );
            const response = await create(dataToSubmit);

            if (response && response.id) {
              const existingIds = context.sharedData.createdEventIds as string[] || [];
              context.sharedData.createdEventIds = [...existingIds, response.id];
              context.actions.setSharedData({ createdEventIds: context.sharedData.createdEventIds });
            }
        },
      },

      [CreateEventSteps.CreateMoreEventsOrNot]: {
        label: "Logic: Create more?",
        type: "logic",
        // This is async now so we can await the API call!
        next: (context) => {
          const nodeData = context.allNodeData as unknown as ContextCreateEventData;
          const stepData = nodeData[CreateEventSteps.Time];
          const createAnother = stepData?.createAnother;
          return createAnother? CreateEventSteps.EventDetails : 'end'; // Loop back
        },
      },
    },
  }),
});
