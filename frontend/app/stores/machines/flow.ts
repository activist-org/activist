/*
 * flowBaseModal.ts
 *
 * This file contains a generic Pinia store factory for creating sophisticated, multi-step flow machines.
 * This is the final, professional version incorporating all architectural refinements.
 *
 * --- ARCHITECTURAL HIGHLIGHTS ---
 *
 * 1. `currentNode` as the Single Source of Truth:
 *    The state directly holds the `currentNode: NodeConfig` object.
 *
 * 2. Co-located Node Configuration:
 *    Nodes define their own UI via the `component` property.
 *
 * 3. `onExit` Actions for Side-Effects:
 *    Nodes can have an `onExit` function that runs as a side-effect during the transition,
 *    perfect for API calls or data manipulation without needing a separate "action" node.
 *
 * 4. Rich `context` for Functions:
 *    The `next` and `onExit` functions now receive a full `context` object, giving them access
 *    to all collected data (`allNodeData`) and the store's actions (`actions`).
 *
 * 5. Clean `next` function signatures:
 *    The `next` function for logic nodes now has a clean signature, as it no longer receives
 *    a useless `nodeData` argument.
 */
import { defineStore } from "pinia";

/** The rich context object passed to `next` and `onExit` functions. */
export interface FlowContext {
  allNodeData: Record<string, any>;
  actions: {
    goto: (nodeId: string) => void;
    submit: () => void;
  };
}

/** The function signature for a dynamic `next` property on a node. */
export type NextFn = (context: FlowContext, nodeData?: Record<string, any>) => string | null | undefined;
/** The function signature for the `onExit` side-effect action. */
export type OnExitFn = (context: FlowContext, nodeData?: Record<string, any>) => void | Promise<void>;

/** The different types a node can be. */
export type NodeType = "screen" | "logic";

/** The complete configuration for a single node in the flow. */
export interface NodeConfig {
  id: string;
  label?: string;
  next?: string | NextFn | null;
  onExit?: OnExitFn;
  type?: NodeType;
  component?: Component | (() => Promise<any>);
}

/** The options required to create a new flow store instance. */
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

  const nodesById = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const defaultNode = nodesById[defaultNodeId] ?? null;

  return defineStore(storeId, {
    state: () => ({
      active: false,
      currentNode: defaultNode,
      nodes,
      nodeData: { ...initialNodeData },
      history: [] as string[],
      isFinished: false,
      saving: false,
      saveResult: null as any | null,
    }),

    getters: {
      nodeId(state): string | null {
        return state.currentNode?.id ?? null;
      },
      visibleNodes(state): NodeConfig[] {
        return state.nodes.filter(
          (node) => !!node.component && node.type !== "logic"
        );
      },
      totalSteps(): number {
        return this.visibleNodes.length;
      },
      currentStep(state): number {
        const currentVisibleIndex = this.visibleNodes.findIndex((node) => node.id === this.nodeId);
        if (currentVisibleIndex !== -1) return currentVisibleIndex + 1;
        for (let i = state.history.length - 1; i >= 0; i--) {
          const lastVisibleIndex = this.visibleNodes.findIndex((node) => node.id === state.history[i]);
          if (lastVisibleIndex !== -1) return lastVisibleIndex + 1;
        }
        return 1;
      },
    },

    actions: {
      async next(nextNodeData?: Record<string, any>) {
        const node = this.currentNode;
        const currentId = this.nodeId;
        if (!node || !currentId) return;

        if (nextNodeData && Object.keys(nextNodeData).length) {
          this.nodeData[currentId] = { ...(this.nodeData[currentId] || {}), ...nextNodeData };
        }

        const context: FlowContext = {
          allNodeData: this.nodeData,
          actions: { goto: this.goto, submit: this.submit },
        };

        if (node.onExit) {
          await node.onExit(context, this.nodeData[currentId] ?? {});
        }

        const nextId = this.calculateNextNode(node, context, currentId);

        if (!nextId || nextId === 'end') {
          this.submit();
          return;
        }

        const nextNode = nodesById[nextId];
        if (nextNode) {
          const isCurrentNodeScreen = !!node.component && node.type !== 'logic';
          if (isCurrentNodeScreen) this.history.push(currentId);
          this.currentNode = nextNode;
        } else {
          console.warn(`[FlowMachine] Node "${nextId}" not found. Ending flow.`);
          this.submit();
        }
      },

      calculateNextNode(node: NodeConfig, context: FlowContext, currentId: string): string | null | undefined {
        if (!node.next) return null;
        if (typeof node.next !== 'function') return node.next;
        if (node.type === 'logic') return node.next(context);
        return node.next(context, this.nodeData[currentId] ?? {});
      },

      start(draftNodeData?: Record<string, any>) {
        this.resetToInitial();
        this.active = true;
        if (draftNodeData) this.nodeData = { ...this.nodeData, ...draftNodeData };
      },

      close(discard?: boolean) {
        this.active = false;
        if (discard ?? discardOnClose) this.resetToInitial();
      },

      prev() {
        const previousNodeId = this.history.pop();
        if (previousNodeId) this.currentNode = nodesById[previousNodeId] ?? null;
      },

      goto(nodeId: string) {
        const targetNode = nodesById[nodeId];
        if (!targetNode || targetNode.id === this.nodeId) return;

        const isCurrentNodeScreen = !!this.currentNode?.component && this.currentNode?.type !== 'logic';
        if (isCurrentNodeScreen && this.nodeId) this.history.push(this.nodeId);
        this.currentNode = targetNode;
      },

      submit() {
        if (this.isFinished) return;
        const finalData = Object.values(this.nodeData).reduce((acc, data) => ({ ...acc, ...data }), {});
        this.saveResult = finalData;
        this.isFinished = true;
        this.active = false;
      },

      resetToInitial() {
        this.active = false;
        this.currentNode = defaultNode;
        this.nodeData = { ...initialNodeData };
        this.history = [];
        this.isFinished = false;
        this.saveResult = null;
        this.saving = false;
      },
    },
  });
}
