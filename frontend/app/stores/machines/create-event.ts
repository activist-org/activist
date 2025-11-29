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
  import(
    "../../components/machine/steps/createEvent/MachineStepsCreateEventDetails.vue"
  );

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
        next: CreateEventSteps.AskCreateMore,
        component: EventDetailsStep,
        initialData: {
          createAnother: false,
        },
        onExit: async (context, nodeData) => {
          console.log("Exiting Details step. Saving draft...");
          // Access the data using the specific step ID
          const currentStepData =
            context.allNodeData[CreateEventSteps.EventDetails] || {};
          console.log("Draft data:", { ...currentStepData, ...nodeData });
        },
      },

      [CreateEventSteps.AskCreateMore]: {
        label: "Logic: Create more?",
        type: "logic",
        // Clean signature for logic node next function
        next: (context) => {
          const stepData = context.allNodeData[CreateEventSteps.EventDetails];
          const createAnother = stepData?.createAnother;
          return createAnother ? CreateEventSteps.EventDetails : "end";
        },
      },
    },
  },
});
