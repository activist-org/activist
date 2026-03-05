// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Component, Ref } from "vue";

/** The rich context object passed to `next` and `onExit` functions. */
export interface FlowContext<T extends string = string> {
  allNodeData: Record<string, unknown>;
  sharedData: Record<string, unknown>;
  actions: {
    goto: (nodeId: T) => void;
    submit: () => void;
    setSharedData: (updates: Record<string, unknown>) => void;
  };
}

/** Helper type for valid return values for the next step */
export type ValidNextNode<T extends string> = T | "end" | null | undefined;

/** The function signature for a dynamic `next` property on a node. */
export type NextFn<T extends string> = (
  context: FlowContext<T>,
  nodeData?: Record<string, unknown>
) => ValidNextNode<T> | Promise<ValidNextNode<T>>;

/** The function signature for the `onExit` side-effect action. */
export type OnExitFn <T extends string> = (
  context: FlowContext <T>,
  nodeData?: Record<string, unknown>
) => void | Promise<void>;

/** The different types a node can be. */
export type NodeType = "screen" | "logic";


export interface StateConfig<T extends string = string> {
  label?: string;
  next?: ValidNextNode<T> | NextFn<T>;
  onExit?: OnExitFn;
  type?: NodeType;
  component?: Component | (() => Promise<null | unknown>);
  initialData?: Record<string, unknown>;
  step?: number | (() => number);
}

/**
 * The internal representation of a node, which includes the ID.
 */
export interface NodeConfig<T extends string = string> extends StateConfig<T> {
  id: T;
}

/**
 * The structure of the machine definition object.
 */
export interface MachineDefinition<T extends string = string> {
  id: string;
  initialNode: T; // <-- MUST be a valid state key
  states: Record<T, StateConfig<T>>; // <-- Keys MUST match T
  totalSteps?: number;
}

/** The options required to create a new flow store instance. */
export interface FlowStoreOptions<T extends string = string> {
  machine: MachineDefinition<T>;
  discardOnClose?: boolean;
}

/**
 * The reactive context shape exposed by the flow composable.
 * Keep this in sync with the `context` returned from useFlowScreens.
 */
export interface FlowContextState {
  active: boolean;
  nodeId: string | null;
  currentNode: Component | null;
  nodeData: Record<string, unknown>;
  sharedData: Record<string, unknown>;
  currentStep: number;
  totalSteps: number;
}

/**
 * The object provided via `provide("flow", ..)` to step components.
 */
export interface FlowControls {
  start: (draft?: Record<string, unknown>, shared?: Record<string, unknown>) => void;
  isSaving: Ref<boolean>;
  next: (payload?: Record<string, unknown>) => Promise<void>;
  prev: () => void;
  close: (discard?: boolean) => void;

  // Reactive state.
  context: Ref<FlowContextState>;
}

export interface UseFlowScreensOptions {
  autoStart?: boolean;
  startData?: Record<string, unknown>;
  startSharedData?: Record<string, unknown>;
  onSubmit?: (finalData: unknown) => void | Promise<void>;
  onNodeEnter?: (nodeId: string) => void | Promise<void>;
}
