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
const EventDetailsStep = () => import( '../../components/machine/steps/createEvent/MachineStepsCreateEventDetails.vue');
const EventTypeAndRolesStep = () => import( '../../components/machine/steps/createEvent/MachineStepsCreateEventTypeAndRoles.vue');
const LocationAndTimeStep = () => import( '../../components/machine/steps/createEvent/MachineStepsCreateEventLocationAndTime.vue');
export const useCreateEventStore = createFlowStore({
  // The new Machine Definition structure
  machine: {
    id: "createEventFlow",
    initialNode: CreateEventSteps.EventDetails,
    states: {
      // The keys here become the IDs for the nodes
      [CreateEventSteps.EventDetails]: {
        label: "Details",
        type: "screen",
        next: CreateEventSteps.EventTypeAndRoles,
        component: EventDetailsStep,
        onExit: async (context, nodeData) => {
          console.log("Exiting Details step. Saving draft...");
          // Access the data using the specific step ID
          const currentStepData =
            context.allNodeData[CreateEventSteps.EventDetails] || {};
          console.log("Draft data:", { ...currentStepData, ...nodeData });
        },
      },
      [CreateEventSteps.EventTypeAndRoles]: {
        label: "Type & Roles",
        type: "screen",
        next: CreateEventSteps.LocationAndTime,
        component: EventTypeAndRolesStep,
      },

      [CreateEventSteps.LocationAndTime]: {
        label: "Location & Time",
        type: "screen",
        next: CreateEventSteps.AskCreateMore,
        initialData: {
          createAnother: false,
        },
        component: LocationAndTimeStep,
      },
      [CreateEventSteps.AskCreateMore]: {
        label: "Logic: Create more?",
        type: "logic",
        // Clean signature for logic node next function
        next: (context) => {
          const stepData = context.allNodeData[CreateEventSteps.LocationAndTime];
          console.log("Deciding next step based on:", stepData, context);
          const createAnother = stepData?.createAnother;
          return createAnother ? CreateEventSteps.EventDetails : "end";
        },
      },
    },
  },
});
