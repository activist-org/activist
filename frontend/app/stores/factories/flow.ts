// SPDX-License-Identifier: AGPL-3.0-or-later

import type { UnwrapRef } from "vue";

import { defineStore } from "pinia";

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
 *
 * 6. Dynamic Next Steps:
 *   The `next` property can be a function that determines the next node based on context and data.
 *
 * 7. History Management:
 *   The store maintains a history stack for "previous" navigation of screens.
 *
 * 8. Total Steps and Current Step Tracking:
 *   The machine can define `totalSteps`, and nodes can specify their step number for accurate progress tracking.
 *
 * 9. Shared Data:
 *   A `sharedData` object allows nodes to share information without polluting individual node data.
 *
 * 10. Final Submission Handling:
 *    The `submit` action consolidates all node data and shared data into a single `saveResult`.
 */

/**
 * Factory function to create a flow store based on a defined machine configuration, providing state management and actions for navigating through a multi-step flow with dynamic nodes, shared data, and submission handling.
 * @param opts - Options for configuring the flow store, including the machine definition and discard behavior on close.
 * @returns A Pinia store instance with state, getters, and actions for managing the flow, including navigation between nodes, data handling, and submission logic.
 */
export function createFlowStore<T extends string = string>(
  opts: FlowStoreOptions<T>
) {
  const { machine, discardOnClose = true } = opts;
  const { id: storeId, initialNode: defaultNodeId, states } = machine;

  // Build the array of strictly typed nodes
  const nodesArray: NodeConfig<T>[] = Object.entries<StateConfig<T>>(
    states
  ).map(([id, config]) => ({
    id: id as T,
    ...config,
  }));

  const getInitialData = () => {
    return nodesArray.reduce(
      (acc, node) => {
        acc[node.id] = node.initialData ? { ...node.initialData } : {};
        return acc;
      },
      {} as Record<string, unknown>
    );
  };

  const defaultNode = nodesArray.find((n) => n.id === defaultNodeId);
  return defineStore(storeId, {
    state: () => ({
      active: false,
      currentNode: defaultNode ?? (null as NodeConfig<T> | null), // Start with initial node or null
      nodeData: getInitialData(),
      sharedData: {} as Record<string, unknown>, // For loop data, meta, etc.
      history: [] as T[],
      isFinished: false,
      saving: false,
      saveResult: null as unknown | null,
    }),

    getters: {
      nodeId: (state) => (state.currentNode?.id as T) ?? null,

      visibleNodes: () =>
        nodesArray.filter((node) => !!node.component && node.type === "screen"),

      totalSteps(): number {
        return machine.totalSteps ?? this.visibleNodes.length;
      },

      currentStep(state): number {
        if (machine.totalSteps) {
          const { currentNode } = state;
          if (currentNode?.step) {
            return typeof currentNode.step === "number"
              ? currentNode.step
              : currentNode.step();
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
      setSaving(value: boolean) {
        this.saving = value;
      },
      start(
        draftNodeData?: Record<string, unknown>,
        initialSharedData?: Record<string, unknown>
      ) {
        this.resetToInitial();
        this.active = true;
        if (draftNodeData) {
          this.nodeData = { ...this.nodeData, ...draftNodeData };
        }
        if (initialSharedData) {
          this.sharedData = { ...initialSharedData };
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

        this.saving = true;

        try {
          // Update data
          if (payload && Object.keys(payload).length) {
            this.nodeData[currentId] = {
              ...(this.nodeData[currentId] || {}),
              ...payload,
            };
          }

          const context: FlowContext<T> = {
            allNodeData: this.nodeData,
            sharedData: this.sharedData,
            actions: {
              goto: this.goto,
              submit: this.submit,
              setSharedData: this.setSharedData,
              clearNodeData: this.clearNodeData,
              setNodeData: this.setNodeData,
              setAllNodeData: this.setAllNodeData,
            },
          };

          if (node.onExit) {
            await node.onExit(
              context,
              (this.nodeData[currentId] ?? {}) as Record<string, unknown>
            );
          }

          let nextId = this.calculateNextNode(
            node as NodeConfig<T>,
            context,
            currentId
          );

          if (nextId instanceof Promise) {
            nextId = await nextId;
          }

          if (!nextId || nextId === "end") {
            this.submit();
            return;
          }

          // Array lookup instead of Map
          const nextNode = nodesArray.find((n) => n.id === nextId);

          if (nextNode) {
            const isCurrentNodeScreen =
              !!node.component && node.type !== "logic";
            if (isCurrentNodeScreen) (this.history as T[]).push(currentId);
            // Run onEnter before switching node so the next node sees cleared/updated store state when it first renders.
            if (nextNode.onEnter) {
              await nextNode.onEnter(context);
            }
            (this.currentNode as NodeConfig<T>) = nextNode;
          } else {
            this.submit();
          }
        } finally {
          this.saving = false;
        }
      },

      prev() {
        const previousNodeId = this.history.pop();
        if (previousNodeId) {
          const prevNode = nodesArray.find((n) => n.id === previousNodeId);
          if (prevNode) (this.currentNode as NodeConfig<T>) = prevNode;
        }
      },

      goto(nodeId: T) {
        const targetNode = nodesArray.find((n) => n.id === nodeId);
        if (!targetNode || targetNode.id === this.nodeId) return;

        const isCurrentScreen =
          !!this.currentNode?.component && this.currentNode?.type !== "logic";

        if (isCurrentScreen && this.nodeId) {
          (this.history as T[]).push(this.nodeId);
        }
        (this.currentNode as NodeConfig<T>) = targetNode;
      },

      setSharedData(updates: Record<string, unknown>) {
        Object.assign(this.sharedData, updates);
      },
      setNodeData(nodeId: T, updates: Record<string, unknown>) {
        if (!this.nodeData[nodeId]) {
          this.nodeData[nodeId] = {};
        }
        this.nodeData[nodeId] = {
          ...(this.nodeData[nodeId] as Record<string, unknown>),
          ...updates,
        };
      },
      clearNodeData(nodeId: T) {
        this.nodeData[nodeId] = {};
      },
      setAllNodeData(newData: Record<string, unknown>) {
        this.nodeData = newData;
      },
      submit() {
        if (this.isFinished) return;

        const finalNodeData = Object.values(this.nodeData).reduce<
          Record<string, unknown>
        >(
          (acc, data) => ({
            ...acc,
            ...(data as Record<string, unknown>),
          }),
          {} // The initial value
        );

        this.saveResult = {
          ...finalNodeData,
          ...(this.sharedData as Record<string, unknown>),
        };
        this.isFinished = true;
        this.active = false;
      },

      resetToInitial() {
        this.active = false;
        this.currentNode = (defaultNode ?? null) as UnwrapRef<
          NodeConfig<T>
        > | null;
        this.nodeData = getInitialData();
        this.sharedData = {};
        this.history = [];
        this.isFinished = false;
        this.saveResult = null;
        this.saving = false;
      },

      calculateNextNode(
        node: NodeConfig<T>,
        context: FlowContext<T>,
        currentId: string
      ): ValidNextNode<T> | Promise<ValidNextNode<T>> {
        if (!node.next) return null;
        if (typeof node.next !== "function")
          return node.next as ValidNextNode<T>;

        if (node.type === "logic" || node.type === "action") {
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
