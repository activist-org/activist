// SPDX-License-Identifier: AGPL-3.0-or-later
import { createFlowStore } from "./flow";

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

const { create } = useEventMutations();

export const useCreateEventStore = createFlowStore({
  machine: {
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
        label: "Location",
        type: "screen",
        next: CreateEventSteps.Time,
        component: LocationStep,
        step: 3,
      },
      [CreateEventSteps.LinkOnline]: {
        label: "Online Link",
        type: "screen",
        next: CreateEventSteps.Time,
        component: OnlineLink,
        step: 3,
      },
      [CreateEventSteps.Time]: {
        label: "Time",
        type: "screen",
        next: CreateEventSteps.CreateMoreEventsOrNot,
        component: TimeStep,
        step: 4,
      },
      [CreateEventSteps.CreateMoreEventsOrNot]: {
        label: "Logic: Create more?",
        type: "logic",
        next: (context) => {
          const nodeData =
            context.allNodeData as unknown as ContextCreateEventData;
          const stepData = nodeData[CreateEventSteps.Time];
          const createAnother = stepData?.createAnother;
          if (createAnother) {
            const data = Object.values(nodeData).reduce(
              (acc, data) => ({
                ...(acc as Record<string, unknown>),
                ...(data as Record<string, unknown>),
              }),
              {}
            );
            create(data);
            return CreateEventSteps.EventDetails;
          }
          return "end";
        },
      },
    },
  },
});
