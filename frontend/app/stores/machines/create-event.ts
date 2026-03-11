// SPDX-License-Identifier: AGPL-3.0-or-later
import type { ContextCreateEventData } from "~~/shared/types/create-event-type";

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
const EventScheduleStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventTime.vue");

if (import.meta.env.DEV) EventScheduleStep();

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
          const nodeData =
            context.allNodeData as unknown as ContextCreateEventData;
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
        next: CreateEventSteps.CreateEventLoop,
        component: EventScheduleStep,
      },
      [CreateEventSteps.CreateEventLoop]: {
        label: "Create Event Loop",
        type: "action",
        onExit: (context: FlowContext) => {
          // Read the result that useFlowScreens injected.
          const result = context.sharedData
            .__lastActionResult as unknown as CommunityEvent;
          if (result && result.id) {
            const existingIds =
              (context.sharedData.createdEventIds as string[]) || [];
            context.actions.setSharedData({
              createdEventIds: [...existingIds, result.id],
              __lastActionResult: null, // clean up for the next loop iteration
            });
          }
          // When looping back to Event Details for "Create another", clear that step so the form is fresh.
          const data = context.allNodeData as unknown as ContextCreateEventData;
          const stepData = data[CreateEventSteps.Time];
          if (stepData?.createAnother) {
            (context.allNodeData as Record<string, unknown>)[
              CreateEventSteps.EventDetails
            ] = {};
          }
        },

        next: (context) => {
          const data = context.allNodeData as unknown as ContextCreateEventData;
          const stepData = data[CreateEventSteps.Time];
          return stepData?.createAnother
            ? CreateEventSteps.EventDetails
            : "end";
        },
      },
    },
  }),
});
