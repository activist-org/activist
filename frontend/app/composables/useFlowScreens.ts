
import { ref, computed, watch, onMounted, type Component, type Ref } from "vue";
import { machineRegistry, type MachineType } from '~/stores/machines';

export function useFlowScreens(
  machineType: MachineType,
  options: UseFlowScreensOptions = {} // <-- `screens` parameter is gone!
) {
  const storeHook = machineRegistry[machineType];
  const store = storeHook();

  const currentScreen: Ref<Component | null> = ref(null);
  const loading = ref(false);

  // This function now gets the component definition from the node itself.
  async function resolveScreenFor(node: any): Promise<Component | null> {
    if (!node || !node.component) return null;

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

  async function loadCurrentScreen() {
    let currentNode = store.currentNode;
    // ... auto-advancing logic remains the same, checking for `currentNode.component`
    while (currentNode && !currentNode.component) {
      // It's a logic-only node, so we advance.
      if (options.onLogicNode) { /* ... call onLogicNode ... */ }
      if (!currentNode.next) { break; } // Terminal logic node
      store.next();
      currentNode = store.currentNode;
    }

    const comp = await resolveScreenFor(currentNode);
    currentScreen.value = comp;
    // ...
  }

  watch(() => store.nodeId, (nid) => { void loadCurrentScreen(nid); }, { immediate: true });
  onMounted(() => { if (options.autoStart) { store.start(options.startData); void loadCurrentScreen(store.nodeId); } });

  const start = (draft?: Record<string, any>) => { store.start(draft); void loadCurrentScreen(store.nodeId); };
  const close = (discard?: boolean) => { store.close(discard); currentScreen.value = null; };
  const next = (payload?: Record<string, any>) => { store.next(payload); void loadCurrentScreen(store.nodeId); return store.nodeId; };
  const context = computed(() => ({
    active: store.active, nodeId: store.nodeId, currentNode: store.currentNode, nodeData: store.nodeData,
  }));

  return { store, start, close, next, currentScreen, loading, context, isActive: computed(() => store.active) };
}
