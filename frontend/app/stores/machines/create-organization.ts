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
const OrganizationDetailsStep = () =>
  import("../../components/machine/steps/createOrganization/MachineStepsCreateOrganizationDetails.vue");
const OrganizationTopicsAndSocialLinksStep = () =>
  import("../../components/machine/steps/createOrganization/MachineStepsCreateOrganizationsTopicsAndSocialLinks.vue");
export const useCreateOrganizationStore = createFlowStore({
  // The new Machine Definition structure
  machine: {
    id: "createOrganizationFlow",
    initialNode: CreateOrganizationSteps.OrganizationDetails,
    states: {
      // The keys here become the IDs for the nodes
      [CreateOrganizationSteps.OrganizationDetails]: {
        label: "Details",
        type: "screen",
        next: CreateOrganizationSteps.TopicsAndSocialLinks,
        component: OrganizationDetailsStep
      },
      [CreateOrganizationSteps.TopicsAndSocialLinks]: {
        label: "Type & Roles",
        type: "screen",
        next: 'end',
        component: OrganizationTopicsAndSocialLinksStep,
      },
    },
  },
});
