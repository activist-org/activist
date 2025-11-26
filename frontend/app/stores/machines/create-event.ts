/*
 * createEvent.ts
 *
 * This file is the single source of truth for the "Create Event" flow.
 *
 * REVIEW NOTES:
 * - Added `as const` to the `nodes` array to fix a TypeScript type incompatibility.
 *   This ensures that properties like `type: "screen"` are inferred as the literal
 *   type "screen", not the general type `string`.
 */
import { createFlowStore, type NodeConfig } from './flowBaseModal'; // Import NodeConfig for typing
import { CreateEventSteps } from '~/types/machines';

// Import the screen components directly. Lazy-loading is highly recommended.
const EventDetailsStep = () => import('~/components/machine/steps/createEvent/MachineStepsCreateEventDetails.vue');

// Define the nodes array with explicit typing and the `as const` assertion.
const nodes = [
  {
    id: CreateEventSteps.EventDetails,
    label: "Details",
    type: "screen", // This will now be correctly inferred as type "screen"
    next: CreateEventSteps.AskCreateMore,
    component: EventDetailsStep,
    onExit: async (context, nodeData) => {
      console.log('Exiting Details step. Saving draft...');
      console.log('Draft data:', { ...context.allNodeData.eventDetails, ...nodeData });
      console.log('Draft saved!');
    },
  },
  {
    id: CreateEventSteps.AskCreateMore,
    label: "Logic: Create more?",
    type: "logic", // This will now be correctly inferred as type "logic"
    next: (context) => {
      const createAnother = context.allNodeData?.eventDetails?.createAnother === true;
      return createAnother ? CreateEventSteps.EventDetails : 'end';
    },
  }
] as const; // <-- THE FIX: Tell TypeScript to not widen the types.

// Initialize the data structure for all steps in the flow.
const initialNodeData = {
  [CreateEventSteps.EventDetails]: { createAnother: false },
};

export const useCreateEventStore = createFlowStore({
  storeId: "createEventFlow",
  defaultNodeId: CreateEventSteps.EventDetails,
  // The type of `nodes` is now fully compatible with what createFlowStore expects.
  nodes: [...nodes], // Use spread to convert from readonly array if needed by the function
  initialNodeData,
});
