/*
 * useFlowScreens.ts
 *
 * UPDATES APPLIED:
 * 1. Added `markRaw` to resolveScreenFor to prevent Vue reactivity bugs with dynamic components.
 * 2. Updated import to point to 'flowBaseModal'.
 */

export interface UseFlowScreensOptions {
  autoStart?: boolean;
  startData?: Record<string, unknown>;
  onSubmit?: (finalData: unknown) => void;
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
        const factory = componentOrFactory as () => Promise<
          Component | { default: Component }
        >;
        const mod = await factory();
        const hasDefault = mod && typeof mod === "object" && "default" in mod;
        const resolved = hasDefault ? mod.default : (mod as Component);
        return resolved ? markRaw(resolved) : null;
      } finally {
        loading.value = false;
      }
    }
    return markRaw(componentOrFactory);
  }

  async function handleNodeChange(newNode: NodeConfig | null) {
    if (!newNode || !store.active) {
      currentScreen.value = null;
      return;
    }

    // Logic nodes: auto-advance
    if (newNode.type === "logic") {
      await store.next();
      return;
    }

    // Screen nodes: Render
    if (options.onNodeEnter) {
      await options.onNodeEnter(newNode.id);
    }
    currentScreen.value = await resolveScreenFor(newNode);
  }

  watch(() => store.currentNode, handleNodeChange, { immediate: true });

  watch(
    () => store.isFinished,
    (finished) => {
      if (finished && options.onSubmit) {
        options.onSubmit(store.saveResult);
      }
    }
  );

  onMounted(() => {
    if (options.autoStart) {
      store.start(options.startData);
    }
  });

  const start = (draft?: Record<string, unknown>) => store.start(draft);
  const close = (discard?: boolean) => store.close(discard);
  const next = async (payload?: Record<string, unknown>) =>
    await store.next(payload);
  const prev = () => store.prev();

  const context = computed(() => ({
    active: store?.active,
    nodeId: store?.nodeId,
    currentNode: store?.currentNode,
    nodeData: store?.nodeData,
    currentStep: store?.currentStep,
    totalSteps: store?.totalSteps,
  }));

  return {
    store,
    start,
    close,
    next,
    prev,
    currentScreen,
    loading,
    context,
    isActive: computed(() => store?.active),
  };
}
