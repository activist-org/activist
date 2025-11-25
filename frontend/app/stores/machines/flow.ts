/**
 * stores/machines/flowBaseModal.ts
 *
 * A generic Pinia store factory for creating sophisticated, multi-step flow machines.
 * This factory includes all the advanced features we've designed:
 *
 * - Co-located Node Configuration: Each node can define its own UI component directly.
 * - Logic-Only Steps: Supports nodes without a UI component for branching, calculations, or side-effects.
 * - History-Based Navigation: A universal `prev()` action that automatically tracks the user's path,
 *   handles loops correctly, and skips over logic-only steps when going back.
 * - Progress Calculation: Built-in getters (`currentStep`, `totalSteps`) that correctly calculate
 *   progress, ignoring any non-visible logic steps.
 */
import { defineStore, type Store } from "pinia";
import type { Component } from "vue";

// The function signature for a dynamic `next` property on a node.
export type NextFn = (nodeData: Record<string, any>, allNodeData: Record<string, any>) => string | null | undefined;

// The different types a node can be. 'screen' is default.
export type NodeType = "screen" | "logic" | "calculator" | "action" | "external";

// The complete configuration for a single node in the flow.
export interface NodeConfig {
  id: string;
  label?: string;
  next?: string | NextFn;
  type?: NodeType;
  // A node can directly define its UI component (lazy-loaded for performance).
  component?: Component | (() => Promise<any>);
}

// The options required to create a new flow store instance.
export interface FlowStoreOptions {
  storeId: string;
  defaultNodeId: string;
  nodes: NodeConfig[];
  initialNodeData?: Record<string, any>;
  discardOnClose?: boolean;
}

/**
 * Creates a new flow store instance with all advanced features.
 * @param opts The configuration options for the store.
 * @returns A Pinia store definition.
 */
export function createFlowStore(opts: FlowStoreOptions) {
  const {
    storeId,
    defaultNodeId,
    nodes,
    initialNodeData = {},
    discardOnClose = true,
  } = opts;

  return defineStore(storeId, {
    state: () => ({
      active: false,
      nodeId: defaultNodeId,
      nodes: nodes,
      nodeData: { ...initialNodeData },
      history: [] as string[], // The history stack for `prev()` navigation
      saving: false,
      saveResult: null as any | null,
    }),

    getters: {
      /**
       * The configuration object for the currently active node.
       */
      currentNode(state): NodeConfig | null {
        const lookup = Object.fromEntries(state.nodes.map((n) => [n.id, n]));
        return lookup[state.nodeId] ?? null;
      },

      /**
       * A filtered list of nodes that are visible to the user (i.e., have a component).
       * This is the basis for all progress calculations.
       */
      visibleNodes(state): NodeConfig[] {
        return state.nodes.filter(
          (node) => !!node.component || (node.type !== 'logic' && node.type !== 'action')
        );
      },

      /**
       * The total number of visible steps in the flow.
       * Perfect for `x of N` progress indicators.
       */
      totalSteps(): number {
        return this.visibleNodes.length;
      },

      /**
       * The 1-based index of the current step within the visible steps.
       * Intelligently finds the last visible step if the user is on a logic node.
       */
      currentStep(state): number {
        const currentVisibleIndex = this.visibleNodes.findIndex((node) => node.id === state.nodeId);
        if (currentVisibleIndex !== -1) {
          return currentVisibleIndex + 1;
        }

        // If on a logic node, look backward through history to find the last visible step's index.
        for (let i = state.history.length - 1; i >= 0; i--) {
          const lastNodeId = state.history[i];
          const lastVisibleIndex = this.visibleNodes.findIndex((node) => node.id === lastNodeId);
          if (lastVisibleIndex !== -1) {
            return lastVisibleIndex + 1;
          }
        }
        return 1; // Fallback
      },
    },

    actions: {
      /**
       * Starts or restarts the flow.
       */
      start(draftNodeData?: Record<string, any>) {
        this.resetToInitial();
        this.active = true;
        if (draftNodeData) {
          this.nodeData = { ...this.nodeData, ...draftNodeData };
        }
      },

      /**
       * Closes the flow, optionally discarding state.
       */
      close(discard?: boolean) {
        this.active = false;
        if (discard ?? discardOnClose) {
          this.resetToInitial();
        }
      },

      /**
       * Jumps to a specific node, updating history.
       */
      goto(nodeId: string) {
        const lookup = Object.fromEntries(this.nodes.map((n) => [n.id, n]));
        if (!lookup[nodeId] || nodeId === this.nodeId) return;

        this.history.push(this.nodeId);
        this.nodeId = nodeId;
      },

      /**
       * Advances to the next node, updating history.
       */
      next(nextNodeData?: Record<string, any>) {
        const currentId = this.nodeId;
        const node = this.currentNode;
        if (!node || !node.next) return;

        if (nextNodeData && Object.keys(nextNodeData).length) {
          this.nodeData[currentId] = { ...(this.nodeData[currentId] || {}), ...nextNodeData };
        }

        const nextId = typeof node.next === 'function' ? node.next(this.nodeData[currentId] ?? {}, this.nodeData) : node.next;
        const lookup = Object.fromEntries(this.nodes.map((n) => [n.id, n]));

        if (nextId && lookup[nextId]) {
          this.history.push(currentId);
          this.nodeId = nextId;
        }
      },

      /**
       * Goes back to the last screen in the history, skipping over any logic-only steps.
       */
      prev() {
        if (this.history.length === 0) return;

        const nodesById = Object.fromEntries(this.nodes.map((n) => [n.id, n]));
        let previousNodeId = this.history.pop();

        while (previousNodeId) {
          const previousNodeConfig = nodesById[previousNodeId];
          const isScreen = !!previousNodeConfig?.component || (previousNodeConfig?.type !== 'logic' && previousNodeConfig?.type !== 'action');

          if (isScreen) {
            this.nodeId = previousNodeId;
            return;
          }

          previousNodeId = this.history.length > 0 ? this.history.pop() : undefined;
        }
      },

      /**
       * Resets the entire flow state to its initial configuration.
       */
      resetToInitial() {
        this.active = false;
        this.nodeId = defaultNodeId;
        this.nodeData = { ...initialNodeData };
        this.history = [];
        this.saveResult = null;
        this.saving = false;
      },
    },
  });
}
