// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * A generic Pinia store factory for creating sophisticated, multi-step flow machines.
 *
 * 1. `currentNode` as the Single Source of Truth:
 *    The state directly holds the `currentNode: NodeConfig` object.
 *
 * 2. Machine Definition Structure:
 *    The factory now accepts a `machine` object with `id`, `initialNode`, and `states`.
 *
 * 3. Co-located Configuration (Logic + UI + Data):
 *    Nodes define their own UI via `component` and their default data via `initialData`.
 *
 * 4. `onExit` Actions for Side-Effects:
 *    Nodes can have an `onExit` function for side-effects like API calls.
 *
 * 5. Rich `context` for Functions:
 *    Functions receive a full `context` object with access to data and actions.
 */
import { defineStore } from "pinia";

export function createFlowStore(opts: FlowStoreOptions) {
  const { machine, discardOnClose = true } = opts;
  const { id: storeId, initialNode: defaultNodeId, states } = machine;

  // 1. Single Source of Truth: The Nodes Array
  // We derive this once from the config. All lookups and ordering use this array.
  const nodes: NodeConfig[] = Object.entries(states).map(([id, config]) => ({
    id,
    ...config,
  }));

  // Helper: Generates a fresh data object from the nodes array.
  // We use reduce here to transform [Nodes] -> { ID: Data }
  const getInitialData = () => {
    return nodes.reduce(
      (acc, node) => {
        acc[node.id] = node.initialData ? { ...node.initialData } : {};
        return acc;
      },
      {} as Record<string, unknown>
    );
  };

  return defineStore(storeId, {
    state: () => ({
      active: false,
      // Just find the initial node in our array
      currentNode: nodes.find((n) => n.id === defaultNodeId) ?? null,
      nodes,
      nodeData: getInitialData(),
      history: [] as string[],
      isFinished: false,
      saving: false,
      saveResult: null as unknown | null,
    }),

    getters: {
      nodeId: (state) => state.currentNode?.id ?? null,

      visibleNodes: (state) =>
        state.nodes.filter(
          (node: NodeConfig) => !!node.component && node.type !== "logic"
        ),

      totalSteps(): number {
        return machine.totalSteps ?? this.visibleNodes.length;
      },

      currentStep(state): number {
        if (machine.totalSteps) {
          const { currentNode } = state;
          if (currentNode?.step && typeof currentNode.step === "number") {
            return currentNode.step;
          }
          return 1;
        }

        const currentVisibleIndex = this.visibleNodes.findIndex(
          (node: NodeConfig) => node.id === this.nodeId
        );

        if (currentVisibleIndex !== -1) return currentVisibleIndex + 1;

        // Fallback: Check history for the last visible node
        for (let i = state.history.length - 1; i >= 0; i--) {
          const lastVisibleIndex = this.visibleNodes.findIndex(
            (node: NodeConfig) => node.id === state.history[i]
          );
          if (lastVisibleIndex !== -1) return lastVisibleIndex + 1;
        }
        return 1;
      },
    },

    actions: {
      start(draftNodeData?: Record<string, unknown>) {
        this.resetToInitial();
        this.active = true;
        if (draftNodeData) {
          this.nodeData = { ...this.nodeData, ...draftNodeData };
        }
      },

      close(discard?: boolean) {
        this.active = false;
        if (discard ?? discardOnClose) this.resetToInitial();
      },

      async next(payload?: Record<string, unknown>) {
        const node = this.currentNode;
        const currentId = this.nodeId;
        if (!node || !currentId) return;

        // 1. Update data
        if (payload && Object.keys(payload).length) {
          this.nodeData[currentId] = {
            ...(this.nodeData[currentId] || {}),
            ...payload,
          };
        }

        const context: FlowContext = {
          allNodeData: this.nodeData,
          actions: { goto: this.goto, submit: this.submit },
        };

        // 2. Side effects
        if (node.onExit) {
          await node.onExit(
            context,
            (this.nodeData[currentId] ?? {}) as Record<string, unknown>
          );
        }

        // 3. Calculate Next
        const nextId = this.calculateNextNode(node, context, currentId);

        if (!nextId || nextId === "end") {
          this.submit();
          return;
        }

        // 4. Transition (Simple array lookup)
        const nextNode = this.nodes.find((n: NodeConfig) => n.id === nextId);
        if (nextNode) {
          const isCurrentNodeScreen = !!node.component && node.type !== "logic";
          if (isCurrentNodeScreen) this.history.push(currentId);
          this.currentNode = nextNode;
        } else {
          this.submit();
        }
      },

      prev() {
        const previousNodeId = this.history.pop();
        if (previousNodeId) {
          const prevNode = this.nodes.find(
            (n: NodeConfig) => n.id === previousNodeId
          );
          if (prevNode) this.currentNode = prevNode;
        }
      },

      goto(nodeId: string) {
        const targetNode = this.nodes.find((n: NodeConfig) => n.id === nodeId);
        if (!targetNode || targetNode.id === this.nodeId) return;

        const isCurrentScreen =
          !!this.currentNode?.component && this.currentNode?.type !== "logic";

        if (isCurrentScreen && this.nodeId) {
          this.history.push(this.nodeId);
        }
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
        this.currentNode =
          this.nodes.find((n: NodeConfig) => n.id === defaultNodeId) ?? null;
        this.nodeData = getInitialData(); // Fresh data copy
        this.history = [];
        this.isFinished = false;
        this.saveResult = null;
        this.saving = false;
      },

      calculateNextNode(
        node: NodeConfig,
        context: FlowContext,
        currentId: string
      ): string | null | undefined {
        if (!node.next) return null;
        if (typeof node.next !== "function") return node.next as string;

        if (node.type === "logic") {
          return node.next(context);
        }
        return node.next(
          context,
          (this.nodeData[currentId] ?? {}) as Record<string, unknown>
        );
      },
    },
  });
}
