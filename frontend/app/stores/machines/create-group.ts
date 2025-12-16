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
const GroupDetailsStep = () =>
  import("../../components/machine/steps/createGroup/MachineStepsCreateGroupDetails.vue");
const GroupLocationStep = () =>
  import("../../components/machine/steps/createGroup/MachineStepsCreateGroupLocation.vue");
export const useCreateGroupStore = createFlowStore({
  // The new Machine Definition structure
  machine: {
    id: "createGroupFlow",
    initialNode: CreateGroupSteps.GroupDetails,
    states: {
      // The keys here become the IDs for the nodes
      [CreateGroupSteps.GroupDetails]: {
        label: "Details",
        type: "screen",
        next: CreateGroupSteps.Location,
        component: GroupDetailsStep
      },
      [CreateGroupSteps.Location]: {
        label: "Location",
        type: "screen",
        next: 'end',
        component: GroupLocationStep,
      },
    },
  },
});
