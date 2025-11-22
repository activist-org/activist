/* flowBaseModal.ts
   Flow-based Pinia store factory where each node holds its own nodeData.
   - Nodes now include optional `type: NodeType` which indicates purpose:
     'screen' (UI), 'logic' (compute/branch), 'calculator' (compute-only),
     'action' (fire side-effect), 'external' (handed to external handler).
   - Missing type defaults to 'screen' for backward compatibility.
   - The factory remains UI-agnostic; composables use node.type to decide behavior.
*/
import { defineStore } from "pinia";

export type NextPrevFn = (nodeData: Record<string, any>, allNodeData: Record<string, any>) => string | null | undefined;

export type NodeType = "screen" | "logic" | "calculator" | "action" | "external";

export type NodeConfig = {
  id: string;
  next?: string | NextPrevFn;
  prev?: string | NextPrevFn;
  label?: string;
  // optional type/role for the node (defaults to 'screen')
  type?: NodeType;
};

export interface FlowStoreOptions {
  storeId: string;
  defaultNodeId: string;
  nodes: NodeConfig[];
  // initial nodeData map: { nodeId: {} }
  initialNodeData?: Record<string, any>;
  // when flow is closed, discard nodeData and reset nodeId (default true)
  discardOnClose?: boolean;
}

export function createFlowStore(opts: FlowStoreOptions) {
  const {
    storeId,
    defaultNodeId,
    nodes,
    initialNodeData = {},
    discardOnClose = true,
  } = opts;

  // Note: we do not capture nodesById in a closure that cannot change;
  // compute it on-demand inside getters/actions if needed.
  function makeNodesById(arr: NodeConfig[]) {
    return Object.fromEntries(arr.map((n) => [n.id, n]));
  }

  const initialNodesById = makeNodesById(nodes);

  return defineStore(storeId, {
    state: () => ({
      // neutral "active" flag replaces modal-specific naming
      active: false as boolean,
      nodeId: defaultNodeId as string,
      nodes: nodes as NodeConfig[],
      nodeData: { ...initialNodeData } as Record<string, any>, // per-node data
      saveResult: null as any | null,
      saving: false as boolean,
      // internals for reset
      _initialNodeData: { ...initialNodeData } as Record<string, any>,
      _defaultNodeId: defaultNodeId as string,
      _discardOnClose: discardOnClose as boolean,
      // keep an initial map for quick lookups if not reconfigured
      _initialNodesById: initialNodesById as Record<string, NodeConfig>,
    }),

    getters: {
      currentNode(state) {
        // compute fresh lookup from state.nodes so runtime reconfigure works
        const lookup = Object.fromEntries(state.nodes.map((n) => [n.id, n]));
        const node = lookup[state.nodeId] ?? null;
        // return node with defaulted type for convenience
        if (!node) return null;
        return { ...node, type: node.type ?? ("screen" as NodeType) };
      },
      nodeIndex(state) {
        return state.nodes.findIndex((n) => n.id === state.nodeId);
      },
      nodesList(state) {
        return state.nodes.map((n) => n.id);
      },
    },

    actions: {
      /**
       * Start the flow. Optionally provide draftNodeData to seed per-node data.
       * This is generic (not modal-specific).
       */
      start(draftNodeData?: Record<string, any>) {
        this.nodeId = this._defaultNodeId;
        this.active = true;
        // merge provided draftNodeData into per-node data
        this.nodeData = { ...this._initialNodeData, ...(draftNodeData || {}) };
        this.saveResult = null;
        this.saving = false;
      },

      /**
       * Close the flow. By default respects the store's discardOnClose setting.
       * Pass discard=true to force discarding context on close, or false to keep it in-memory.
       */
      close(discard?: boolean) {
        this.active = false;
        const shouldDiscard = discard === undefined ? this._discardOnClose : !!discard;
        if (shouldDiscard) {
          this.nodeId = this._defaultNodeId;
          this.nodeData = { ...this._initialNodeData };
          this.saveResult = null;
          this.saving = false;
        }
      },

      goto(nodeId: string) {
        const lookup = Object.fromEntries(this.nodes.map((n) => [n.id, n]));
        if (!lookup[nodeId]) return;
        this.nodeId = nodeId;
      },

      /**
       * Compute next using node.next (string or function).
       * If nextNodeData is provided, shallow-merge it into the current node's nodeData
       * BEFORE computing the next node. This ensures dynamic next functions can
       * react to values just saved and that saving + navigation is atomic from the caller POV.
       */
      next(nextNodeData?: Record<string, any>) {
        const lookup = Object.fromEntries(this.nodes.map((n) => [n.id, n]));
        const currentId = this.nodeId;
        const node = lookup[currentId];
        if (!node || !node.next) return;

        // merge provided data into the current node's data first
        if (nextNodeData && Object.keys(nextNodeData).length) {
          const prev = this.nodeData[currentId] ?? {};
          this.nodeData = { ...this.nodeData, [currentId]: { ...prev, ...nextNodeData } };
        }

        // compute next using the (potentially) updated nodeData
        const nextId =
          typeof node.next === "function"
            ? node.next(this.nodeData[currentId] ?? {}, this.nodeData)
            : node.next;
        if (nextId && lookup[nextId]) {
          this.nodeId = nextId;
        }
      },

      prev() {
        const lookup = Object.fromEntries(this.nodes.map((n) => [n.id, n]));
        const node = lookup[this.nodeId];
        if (!node) return;
        if (!node.prev) {
          const idx = this.nodes.findIndex((n) => n.id === this.nodeId);
          if (idx > 0) this.nodeId = this.nodes[idx - 1].id;
          return;
        }
        const prevId =
          typeof node.prev === "function"
            ? node.prev(this.nodeData[this.nodeId] ?? {}, this.nodeData)
            : node.prev;
        if (prevId && lookup[prevId]) {
          this.nodeId = prevId;
        }
      },

      // Replace or merge node-specific data. If merge === true, shallow-merge with existing nodeData[nodeId]
      updateNode(nodeId: string, payload: Record<string, any>, merge = true) {
        const lookup = Object.fromEntries(this.nodes.map((n) => [n.id, n]));
        if (!lookup[nodeId]) return;
        if (merge) {
          this.nodeData = { ...this.nodeData, [nodeId]: { ...(this.nodeData[nodeId] || {}), ...payload } };
        } else {
          this.nodeData = { ...this.nodeData, [nodeId]: payload };
        }
      },

      // convenience: update field on current node
      updateCurrentField(field: string, value: any) {
        const nid = this.nodeId;
        const prev = this.nodeData[nid] ?? {};
        this.nodeData = { ...this.nodeData, [nid]: { ...prev, [field]: value } };
      },

      // convenience: set whole node data
      setNode(nodeId: string, value: any) {
        const lookup = Object.fromEntries(this.nodes.map((n) => [n.id, n]));
        if (!lookup[nodeId]) return;
        this.nodeData = { ...this.nodeData, [nodeId]: value };
      },

      async submit(saveFn: (payload: any) => Promise<any>) {
        try {
          this.saving = true;
          this.saveResult = null;
          // payload is the whole nodeData map; caller can decide what to extract
          const result = await saveFn(this.nodeData);
          this.saveResult = result;
          return result;
        } catch (err: any) {
          this.saveResult = { _error: err?.message ?? "Save failed" };
          return this.saveResult;
        } finally {
          this.saving = false;
        }
      },

      // explicit reset action
      resetToInitial() {
        this.nodeId = this._defaultNodeId;
        this.nodeData = { ...this._initialNodeData };
        this.saveResult = null;
        this.saving = false;
      },
    },
  });
}
