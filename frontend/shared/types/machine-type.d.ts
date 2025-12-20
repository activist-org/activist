// SPDX-License-Identifier: AGPL-3.0-or-later

/** The rich context object passed to `next` and `onExit` functions. */
export interface FlowContext {
  allNodeData: Record<string, unknown>;
  actions: {
    goto: (nodeId: string) => void;
    submit: () => void;
  };
}

/** The function signature for a dynamic `next` property on a node. */
export type NextFn = (
  context: FlowContext,
  nodeData?: Record<string, unknown>
) => string | null | undefined;
/** The function signature for the `onExit` side-effect action. */
export type OnExitFn = (
  context: FlowContext,
  nodeData?: Record<string, unknown>
) => void | Promise<void>;

/** The different types a node can be. */
export type NodeType = "screen" | "logic";

export interface StateConfig {
  label?: string; // Human-readable label for the node (for debugging or progress tracking)
  next?: string | NextFn | null; // ID of the next node or a function to determine it
  onExit?: OnExitFn; // Side-effect function when exiting this node
  type?: NodeType; // Defaults to 'screen'
  component?: Component | (() => Promise<null | unknown>); // The Vue component for screen nodes
  initialData?: Record<string, unknown>; // Define default data co-located with the state
  step?: number | (() => number); // Step number for progress tracking
}
/**
 * The internal representation of a node, which includes the ID.
 */
export interface NodeConfig extends StateConfig {
  id: string;
}

/**
 * The structure of the machine definition object.
 */
export interface MachineDefinition {
  id: string; // The unique ID for the machine/store
  initialNode: string; // The ID of the starting state
  states: Record<string, StateConfig>; // The states, keyed by their ID
  totalSteps?: number; // Optional total steps for progress tracking
}

/** The options required to create a new flow store instance. */
export interface FlowStoreOptions {
  machine: MachineDefinition;
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
  currentStep: number;
  totalSteps: number;
}

/**
 * The object provided via `provide("flow", ..)` to step components.
 */
export interface FlowControls {
  // Actions (mirror the return values from useFlowScreens)
  start: (draft?: Record<string, unknown>) => void;
  next: (payload?: Record<string, unknown>) => Promise<void>;
  prev: () => void;
  close: (discard?: boolean) => void;

  // Reactive state
  context: Ref<FlowContextState>;
}

export interface UseFlowScreensOptions {
  autoStart?: boolean;
  startData?: Record<string, unknown>;
  onSubmit?: (finalData: unknown) => void;
  onNodeEnter?: (nodeId: string) => void | Promise<void>;
}
