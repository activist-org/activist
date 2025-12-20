// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * createEvent.ts
 *
 * UPDATED: Now uses the new `machine` definition structure.
 * - Replaced the `nodes` array with a `states` object keyed by step ID.
 * - This eliminates the need to repeat the `id` inside each node configuration.
 * - Logic for `next` uses bracket notation `[CreateEventSteps.EventDetails]` to safely access data.
 */
import { createFlowStore } from "./flow";

// Import the screen components directly.
// Using relative paths to ensure stability with Vite/Nuxt aliases.
const EventDetailsStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventDetails.vue");
const EventTypeStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventType.vue");
const TimeStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventTime.vue");
const LocationStep = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventLocation.vue");
const OnlineLink = () =>
  import("../../components/machine/steps/createEvent/MachineStepsCreateEventLinkOnline.vue");

export const useCreateEventStore = createFlowStore({
  // The new Machine Definition structure
  machine: {
    id: "createEventFlow",
    initialNode: CreateEventSteps.EventDetails,
    totalSteps: 4,
    states: {
      // The keys here become the IDs for the nodes
      [CreateEventSteps.EventDetails]: {
        label: "Details",
        type: "screen",
        step:1,
        next: CreateEventSteps.EventType,
        component: EventDetailsStep
      },
      [CreateEventSteps.EventType]: {
        label: "Type",
        type: "screen",
        step:2,
        next: CreateEventSteps.OnlineLocationOrOffline,
        component: EventTypeStep,
      },
      [CreateEventSteps.OnlineLocationOrOffline]: {
        label: "Logic: Online or Offline?",
        type: "logic",
        // Clean signature for logic node next function
        next: (context) => {
          const nodeData = context.allNodeData as unknown as ContextCreateEventData
          const stepData =
            nodeData[CreateEventSteps.EventType];
          const isOnline = stepData?.setting === "online";
          return isOnline ? CreateEventSteps.LinkOnline : CreateEventSteps.Location;
        },
      },
      [CreateEventSteps.Location]: {
        label: "Location",
        type: "screen",
        next: CreateEventSteps.Time,
        component: LocationStep,
        step:3,
      },
      [CreateEventSteps.LinkOnline]: {
        label: "Online Link",
        type: "screen",
        next: CreateEventSteps.Time,
        component: OnlineLink,
        step:3,
      },
       [CreateEventSteps.Time]: {
        label: "Time",
        type: "screen",
        next: CreateEventSteps.CreateMoreEventsOrNot,
        component: TimeStep,
        step:4,
      },
      [CreateEventSteps.CreateMoreEventsOrNot]: {
        label: "Logic: Create more?",
        type: "logic",
        // Clean signature for logic node next function
        next: (context) => {
          const nodeData = context.allNodeData as unknown as ContextCreateEventData
          const stepData =
            nodeData[CreateEventSteps.Time];
          const createAnother = stepData?.createAnother;
          return createAnother ? CreateEventSteps.EventDetails : "end";
        },
      },
    },
  },
});
