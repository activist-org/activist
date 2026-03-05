// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * useFlowScreens is the layer between the component and the store layer. It manages the screen showing,
 */


export function useFlowScreens(
  machineType: MachineType,
  options: UseFlowScreensOptions = {}
) {
  const store = machineRegistry[machineType]();

  const currentScreen: Ref<Component | null> = ref(null);
  const loading = ref(false);

  // Helper to resolve lazy-loaded components.
  const resolveScreenFor = async (
    node: NodeConfig
  ): Promise<Component | null> => {
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
  };

  const handleNodeChange = async (
    newNode: NodeConfig | null,
    active: boolean
  ) => {
    if (!newNode || !active) {
      currentScreen.value = null;
      return;
    }

    // Note: Auto-advance logic nodes.
    if (newNode.type === "logic") {
      await store.next();
      return;
    }

    // Note: Render screen nodes.
    if (options.onNodeEnter) {
      await options.onNodeEnter(newNode.id);
    }
    currentScreen.value = await resolveScreenFor(newNode);
  };

  watch(
    () => [store.currentNode, store.active],
    ([newNode, active]) =>
      handleNodeChange(newNode as NodeConfig | null, active as boolean),
    { immediate: true }
  );

  watch(
    () => store.isFinished,
    (finished) => {
      loading.value = true;
      if (finished && options.onSubmit) {
        new Promise((resolve) => resolve(options.onSubmit?.({...store.nodeData, ...store.sharedData}))).then(() => {
          loading.value = false;
        });
      }
    }
  );

  onMounted(() => {
    if (options.autoStart) {
      store.start(options.startData);
      loading.value = true;
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
    sharedData: store?.sharedData,
    nodeData: store?.nodeData,
    currentStep: store?.currentStep,
    totalSteps: store?.totalSteps,
  }));

  const isSaving = computed(() => store?.saving ?? false);

  watch(
    isSaving,
    (saving) => {
      console.log("Saving state changed 1:", saving);
    }
  ,{ immediate: true });

  return {
    store,
    start,
    close,
    next,
    prev,
    currentScreen,
    loading,
    context,
    isActive: readonly(computed(() => store?.active)),
    isSaving: readonly(isSaving),
  };
}
