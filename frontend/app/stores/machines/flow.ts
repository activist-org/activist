// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * flow.ts
 *
 * This file contains a generic Pinia store factory for creating sophisticated, multi-step flow machines.
 * This is the final, professional version incorporating all architectural refinements.
 *
 * --- ARCHITECTURAL HIGHLIGHTS ---
 *
 * 1. `currentNode` as the Single Source of Truth:
 *    The state directly holds the `currentNode: NodeConfig` object.
 *
 * 2. Machine Definition Structure:
 *    The factory now accepts a `machine` object with `id`, `initialNode`, and `states`.
 *    This eliminates redundant IDs and groups states logically.
 *
 * 3. Co-located Configuration (Logic + UI + Data):
 *    Nodes define their own UI via `component` and their default data via `initialData`.
 *    This creates a single source of truth for every aspect of a step.
 *
 * 4. `onExit` Actions for Side-Effects:
 *    Nodes can have an `onExit` function for side-effects like API calls.
 *
 * 5. Rich `context` for Functions:
 *    Functions receive a full `context` object with access to data and actions.
 */
import { defineStore } from "pinia";
/**
 * Creates a new flow store instance with all advanced features.
 * @param opts The configuration options for the store.
 * @returns A Pinia store definition.
 */
export function createFlowStore(opts: FlowStoreOptions) {
  const { machine, discardOnClose = true } = opts;

  const { id: storeId, initialNode: defaultNodeId, states } = machine;

  // 1. Convert the states object into an internal array of NodeConfigs
  const nodes: NodeConfig[] = Object.entries(states).map(([id, config]) => ({
    id,
    ...config,
  }));

  // 2. Extract initial data from each node to build the master initial state object.
  const initialNodeData: Record<string, unknown> = {};
  nodes.forEach((node) => {
    // Ensure every node has an entry in the data map, even if empty.
    initialNodeData[node.id] = node.initialData ? { ...node.initialData } : {};
  });

  const nodesById = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const defaultNode = nodesById[defaultNodeId] ?? null;

  return defineStore(storeId, {
    state: () => ({
      active: false,
      currentNode: defaultNode,
      nodes,
      nodeData: { ...initialNodeData }, // Initialize with the extracted data
      history: [] as string[],
      isFinished: false,
      saving: false,
      saveResult: null as unknown | null,
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
        if (machine.totalSteps) return machine.totalSteps;

        return this.visibleNodes.length;
      },
      currentStep(state): number {
        if (machine.totalSteps) {
          const currentNode = state.currentNode;

          if (currentNode && typeof currentNode.step === "number") {
            return currentNode.step;
          }

          if (currentNode && typeof currentNode.step === "function") {
            return currentNode.step();
          }

          return 1;
        }
        const currentVisibleIndex = this.visibleNodes.findIndex(
          (node) => node.id === this.nodeId
        );
        if (currentVisibleIndex !== -1) return currentVisibleIndex + 1;
        for (let i = state.history.length - 1; i >= 0; i--) {
          const lastVisibleIndex = this.visibleNodes.findIndex(
            (node) => node.id === state.history[i]
          );
          if (lastVisibleIndex !== -1) return lastVisibleIndex + 1;
        }
        return 1;
      },
    },

    actions: {
      async next(nextNodeData?: Record<string, unknown>) {
        const node = this.currentNode;
        const currentId = this.nodeId;
        if (!node || !currentId) return;

        if (nextNodeData && Object.keys(nextNodeData).length) {
          this.nodeData[currentId] = {
            ...(this.nodeData[currentId] || {}),
            ...nextNodeData,
          };
        }

        const context: FlowContext = {
          allNodeData: this.nodeData,
          actions: { goto: this.goto, submit: this.submit },
        };

        if (node.onExit && this.nodeData[currentId]) {
          await node.onExit(
            context,
            (this.nodeData[currentId] ?? {}) as unknown as Record<
              string,
              unknown
            >
          );
        }

        const nextId = this.calculateNextNode(node, context, currentId);

        if (!nextId || nextId === "end") {
          this.submit();
          return;
        }

        const nextNode = nodesById[nextId];
        if (nextNode) {
          const isCurrentNodeScreen = !!node.component && node.type !== "logic";
          if (isCurrentNodeScreen) this.history.push(currentId);
          this.currentNode = nextNode;
        } else {
          this.submit();
        }
      },

      calculateNextNode(
        node: NodeConfig,
        context: FlowContext,
        currentId: string
      ): string | null | undefined {
        if (!node.next) return null;
        if (typeof node.next !== "function") return node.next;
        if (node.type === "logic") return node.next(context);
        return node.next(
          context,
          (this.nodeData[currentId] ?? {}) as unknown as Record<string, unknown>
        );
      },

      start(draftNodeData?: Record<string, unknown>) {
        this.resetToInitial();
        this.active = true;
        if (draftNodeData)
          this.nodeData = { ...this.nodeData, ...draftNodeData };
      },

      close(discard?: boolean) {
        this.active = false;
        if (discard ?? discardOnClose) this.resetToInitial();
      },

      prev() {
        const previousNodeId = this.history.pop();
        if (previousNodeId)
          this.currentNode = nodesById[previousNodeId] ?? null;
      },

      goto(nodeId: string) {
        const targetNode = nodesById[nodeId];
        if (!targetNode || targetNode.id === this.nodeId) return;

        const isCurrentNodeScreen =
          !!this.currentNode?.component && this.currentNode?.type !== "logic";
        if (isCurrentNodeScreen && this.nodeId) this.history.push(this.nodeId);
        this.currentNode = targetNode;
      },

      submit() {
        if (this.isFinished) return;
        const finalData = Object.values(this.nodeData).reduce(
          (acc, data) => ({
            ...(acc as Record<string, unknown>),
            ...(data as Record<string, unknown>),
          }),
          {}
        );
        this.saveResult = finalData;
        this.isFinished = true;
        this.active = false;
      },

      resetToInitial() {
        this.active = false;
        this.currentNode = defaultNode;
        // Reset data using the pre-calculated initialNodeData
        this.nodeData = { ...initialNodeData };
        this.history = [];
        this.isFinished = false;
        this.saveResult = null;
        this.saving = false;
      },
    },
  });
}
