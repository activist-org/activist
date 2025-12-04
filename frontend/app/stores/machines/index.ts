import { useCreateEventStore } from "./create-event";

export const machineRegistry = {
  createEvent: useCreateEventStore,
};

export type MachineType = keyof typeof machineRegistry;

export * from "./create-event";
