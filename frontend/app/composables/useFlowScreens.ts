/*
 * useFlowScreens.ts
 *
 * This composable is the bridge between the UI and a flow machine store.
 *
 * --- FINAL REFINEMENTS ---
 *
 * - `onLogicNode` has been removed (YOUR SUGGESTION): The `onExit` property on a node
 *   is now the single, correct way to handle side-effects during a transition, making
 *   the machine's configuration fully self-contained.
 *
 * - It watches `store.currentNode` as the single source of truth and handles
 *   auto-advancing past logic nodes and lazy-loading screen components.
 */
import { ref, computed, watch, onMounted, type Component, type Ref } from "vue";
import { machineRegistry, type MachineType } from "~/stores/machines";
import type { NodeConfig } from "~/stores/machines/flow";

/** The options for configuring the flow screen behavior. */
export interface UseFlowScreensOptions {
  autoStart?: boolean;
  startData?: Record<string, any>;
  onSubmit?: (finalData: any) => void;
  onNodeEnter?: (nodeId: string) => void | Promise<void>;
}

export function useFlowScreens(
  machineType: MachineType,
  options: UseFlowScreensOptions = {}
) {
  const store = machineRegistry[machineType]();

  const currentScreen: Ref<Component | null> = ref(null);
  const loading = ref(false);

  // Helper to resolve lazy-loaded components.
  async function resolveScreenFor(node: NodeConfig): Promise<Component | null> {
    if (!node.component) return null;

    const componentOrFactory = node.component;
    if (typeof componentOrFactory === "function") {
      loading.value = true;
      try {
        const mod = await componentOrFactory();
        return (mod && (mod.default ?? mod)) || null;
      } finally {
        loading.value = false;
      }
    }
    return componentOrFactory; // It's already a resolved component object
  }

  /**
   * The primary driver of the UI, which reacts to changes in the store's `currentNode`.
   * @param newNode The new node from the store's state.
   */
  async function handleNodeChange(newNode: NodeConfig | null) {
    if (!newNode || !store.active) {
      currentScreen.value = null;
      return;
    }

    // If the new node is a logic node (no UI), just call `next` to continue the flow.
    // The `onExit` on the logic node itself will be triggered inside the `next` action.
    if (newNode.type === 'logic') {
      await store.next();
      return;
    }

    // It's a screen node, so resolve its component and render it.
    if (options.onNodeEnter) {
      await options.onNodeEnter(newNode.id);
    }
    currentScreen.value = await resolveScreenFor(newNode);
  }

  // Watch the store's source of truth. The `immediate: true` handles the initial load.
  watch(() => store.currentNode, handleNodeChange, { immediate: true });

  // Watch for the flow to be marked as finished by the store.
  watch(() => store.isFinished, (finished) => {
    if (finished && options.onSubmit) {
      options.onSubmit(store.saveResult);
    }
  });

  onMounted(() => {
    if (options.autoStart) {
      store.start(options.startData);
    }
  });

  // Expose the core store actions to the UI component.
  const start = (draft?: Record<string, any>) => store.start(draft);
  const close = (discard?: boolean) => store.close(discard);
  const next = async (payload?: Record<string, any>) => await store.next(payload);
  const prev = () => store.prev();

  // Expose a reactive context for the UI to bind to.
  const context = computed(() => ({
    active: store.active,
    nodeId: store.nodeId,
    currentNode: store.currentNode,
    nodeData: store.nodeData,
    currentStep: store.currentStep,
    totalSteps: store.totalSteps,
  }));

  return { store, start, close, next, prev, currentScreen, loading, context, isActive: computed(() => store.active) };
}
