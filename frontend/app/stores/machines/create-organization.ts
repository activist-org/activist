// SPDX-License-Identifier: AGPL-3.0-or-later
import { createFlowStore } from "./flow";

const OrganizationDetailsStep = () =>
  import("../../components/machine/steps/createOrganization/MachineStepsCreateOrganizationDetails.vue");
const OrganizationLocationStep = () =>
  import("../../components/machine/steps/createOrganization/MachineStepsCreateOrganizationsLocation.vue");

export const useCreateOrganizationStore = createFlowStore({
  machine: {
    id: "createOrganizationFlow",
    initialNode: CreateOrganizationSteps.OrganizationDetails,
    states: {
      [CreateOrganizationSteps.OrganizationDetails]: {
        label: "Details",
        type: "screen",
        next: CreateOrganizationSteps.Location,
        component: OrganizationDetailsStep,
      },
      [CreateOrganizationSteps.Location]: {
        label: "Type & Roles",
        type: "screen",
        next: "end",
        component: OrganizationLocationStep,
      },
    },
  },
});
