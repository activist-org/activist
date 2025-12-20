// SPDX-License-Identifier: AGPL-3.0-or-later
import { useCreateEventStore } from "./create-event";
import { useCreateGroupStore } from "./create-group";
import { useCreateOrganizationStore } from "./create-organization";
export const machineRegistry = {
  [MachineCreateType.CreateEvent]: useCreateEventStore,
  [MachineCreateType.CreateGroup]: useCreateGroupStore,
  [MachineCreateType.CreateOrganization]: useCreateOrganizationStore,
};

export type MachineType = keyof typeof machineRegistry;

export * from "./create-event";
export * from "./create-group";
export * from "./create-organization";
