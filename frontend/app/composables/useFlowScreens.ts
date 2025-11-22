/**
 * composables/useFlowScreens.ts
 *
 * Generic composable that wires a flow store (created from the flow factory)
 * to a map of nodeId -> screen component (or lazy import function).
 *
 * Changes in this variant:
 * - If a node has no screen entry (logic-only node) or the node.type !== 'screen',
 *   the composable will auto-advance the flow by invoking store.next() until it
 *   reaches a node that DOES have a screen or until there's no next.
 * - For each skipped logic node, the composable will call `onLogicNode` (if provided)
 *   so callers can run calculations/side effects based on latest nodeData before advancing.
 * - Cycle detection prevents infinite auto-advance loops.
 */
import { ref, computed, watch, onMounted, type Component, type Ref } from "vue";

type LazyComponentFactory = () => Promise<any>;
type ScreenEntry = Component | LazyComponentFactory;

export interface UseFlowScreensOptions {
  autoStart?: boolean;
  startData?: Record<string, any>;
  /**
   * Called whenever we encounter a logic-only node during auto-advance.
   * (nodeId, nodeData, allNodeData, store) => void | Promise<void>
   * Use this to run calculators or async checks that should happen before advancing.
   */
  onLogicNode?: (nodeId: string, nodeData: Record<string, any>, allNodeData: Record<string, any>, store?: any) => void | Promise<void>;
  /**
   * Optional callback invoked after a node change and after the current screen component
   * has been resolved (for the node that has a screen). Useful to manage focus or analytics.
   */
  onNodeEnter?: (nodeId: string) => void | Promise<void>;
  /**
   * Maximum auto-advance hops to avoid accidental long loops (default 10).
   */
  maxAutoAdvanceHops?: number;
}

/**
 * storeHookOrInstance: either a Pinia store hook (like useCreateEventStore) or an already called store instance.
 * screens: mapping nodeId -> Component | () => Promise(module)
 */
export function useFlowScreens(
  storeHookOrInstance: any,
  screens: Record<string, ScreenEntry>,
  options: UseFlowScreensOptions = {}
) {
  // accept either a hook (function) or a store instance
  const store = typeof storeHookOrInstance === "function" ? storeHookOrInstance() : storeHookOrInstance;

  // reactive refs to hold resolved component and loading state
  const currentScreen: Ref<Component | null> = ref(null);
  const loading = ref(false);

  const maxHops = options.maxAutoAdvanceHops ?? 10;

  // Resolve component for a nodeId; supports async lazy imports
  async function resolveScreenFor(nodeId: string): Promise<Component | null> {
    const entry = screens[nodeId];
    if (!entry) return null;

    // If entry is a function, it may be a lazy loader or a plain factory.
    if (typeof entry === "function") {
      try {
        const maybe = (entry as LazyComponentFactory)();
        if (maybe && typeof (maybe as any).then === "function") {
          loading.value = true;
          const mod = await maybe;
          const comp = (mod && (mod.default ?? mod)) as Component | undefined;
          return comp ?? null;
        } else {
          return (entry as unknown) as Component;
        }
      } finally {
        loading.value = false;
      }
    }

    // entry is a component
    return entry as Component;
  }

  /**
   * Load the "effective" current screen for store.nodeId.
   * If the current node has no screen mapping OR node.type !== 'screen',
   * auto-advance through logic-only nodes by invoking store.next() until a node
   * with a screen is found or no next exists.
   *
   * Protect against cycles by tracking visited nodeIds within this resolution.
   */
  async function loadCurrentScreen(nodeId?: string) {
    // start from a snapshot of nodeId to avoid races
    let id = nodeId ?? store.nodeId;
    const visited = new Set<string>();
    let hops = 0;

    while (true) {
      if (visited.has(id)) {
        // cycle detected -> stop and don't attempt further auto-advance
        currentScreen.value = null;
        return;
      }
      visited.add(id);

      // If node type exists and it's not 'screen', treat it as logic-only (auto-advance candidate)
      const nodeCfg = store.nodes.find((n: any) => n.id === id) || store.currentNode;
      const nodeType = nodeCfg?.type ?? "screen";

      // If node is logic-only OR there's no screen mapping for it, treat as a skipped node
      const hasScreen = !!screens[id];
      if (!hasScreen || nodeType !== "screen") {
        // If an onLogicNode hook exists, call it (allows calculators / side-effects)
        if (options.onLogicNode) {
          try {
            await options.onLogicNode(id, store.nodeData?.[id] ?? {}, store.nodeData, store);
          } catch {
            /* swallow */
          }
        }
        // If the node has no next, stop (terminal logic node)
        if (!nodeCfg || !nodeCfg.next) {
          currentScreen.value = null;
          if (options.onNodeEnter) {
            try { await options.onNodeEnter(id); } catch {}
          }
          return;
        }

        // Prevent runaway auto-advance
        hops++;
        if (hops > maxHops) {
          currentScreen.value = null;
          return;
        }

        // perform the transition; store.next() may update nodeData and nodeId
        store.next();
        // update id to the newly active node and continue loop
        id = store.nodeId;
        continue;
      }

      // Node is a screen and has a mapping -> resolve it
      const comp = await resolveScreenFor(id);
      currentScreen.value = comp;
      if (options.onNodeEnter) {
        try { await options.onNodeEnter(id); } catch {}
      }
      return;
    }
  }

  // watch nodeId changes to update the resolved screen
  watch(
    () => store.nodeId,
    (nid) => {
      void loadCurrentScreen(nid);
    },
    { immediate: true }
  );

  // autoStart if requested
  onMounted(() => {
    if (options.autoStart) {
      store.start(options.startData);
      void loadCurrentScreen(store.nodeId);
    }
  });

  // wrappers delegating to the store
  function start(draftNodeData?: Record<string, any>) {
    store.start(draftNodeData);
    void loadCurrentScreen(store.nodeId);
  }

  function close(discard?: boolean) {
    store.close(discard);
    currentScreen.value = null;
  }

  function goto(nodeId: string) {
    store.goto(nodeId);
    void loadCurrentScreen(nodeId);
  }

  function next(payload?: Record<string, any>) {
    store.next(payload);
    void loadCurrentScreen(store.nodeId);
    return store.nodeId;
  }

  function prev() {
    store.prev();
    void loadCurrentScreen(store.nodeId);
    return store.nodeId;
  }

  function updateCurrent(field: string, value: any) {
    store.updateCurrentField(field, value);
  }

  function updateNode(nodeId: string, payload: Record<string, any>, merge = true) {
    store.updateNode(nodeId, payload, merge);
  }

  async function submit(saveFn?: (payload: any) => Promise<any>) {
    if (saveFn) {
      return await store.submit(saveFn);
    }
    return await store.submit((pd: any) => Promise.resolve(pd));
  }

  const context = computed(() => ({
    active: store.active,
    nodeId: store.nodeId,
    currentNode: store.currentNode,
    nodeIndex: store.nodeIndex,
    nodes: store.nodes,
    nodeData: store.nodeData,
    saveResult: store.saveResult,
    saving: store.saving,
  }));

  return {
    store,
    start,
    close,
    goto,
    next,
    prev,
    updateCurrent,
    updateNode,
    submit,
    currentScreen,
    loading,
    context,
    isActive: computed(() => store.active),
    getScreenFor: (nodeId: string) => resolveScreenFor(nodeId),
  };
}
