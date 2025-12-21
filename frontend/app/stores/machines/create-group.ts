// SPDX-License-Identifier: AGPL-3.0-or-later
import { createFlowStore } from "./flow";

const GroupDetailsStep = () =>
  import("../../components/machine/steps/createGroup/MachineStepsCreateGroupDetails.vue");
const GroupLocationStep = () =>
  import("../../components/machine/steps/createGroup/MachineStepsCreateGroupLocation.vue");

export const useCreateGroupStore = createFlowStore({
  machine: {
    id: "createGroupFlow",
    initialNode: CreateGroupSteps.GroupDetails,
    states: {
      [CreateGroupSteps.GroupDetails]: {
        label: "Details",
        type: "screen",
        next: CreateGroupSteps.Location,
        component: GroupDetailsStep,
      },
      [CreateGroupSteps.Location]: {
        label: "Location",
        type: "screen",
        next: "end",
        component: GroupLocationStep,
      },
    },
  },
});
