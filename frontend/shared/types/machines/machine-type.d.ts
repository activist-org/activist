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
  label?: string;
  next?: string | NextFn | null;
  onExit?: OnExitFn;
  type?: NodeType;
  component?: Component | (() => Promise<null | unknown>);
  initialData?: Record<string, unknown>; // <-- NEW: Define default data co-located with the state
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
}

/** The options required to create a new flow store instance. */
export interface FlowStoreOptions {
  machine: MachineDefinition;
  discardOnClose?: boolean;
}
