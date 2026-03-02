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

  const route = useRoute();
  const router = useRouter();

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
    async (finished) => {
      let createdEventIds: string[] = [];
      if (finished && options.onSubmit) {
        createdEventIds = (await options.onSubmit(
          store.saveResult
        )) as unknown as string[];
      }

      await handleCreatedEventRouting(createdEventIds);
    }
  );

  onMounted(() => {
    if (options.autoStart) {
      store.start(options.startData);
      loading.value = true;
    }
  });

  async function handleCreatedEventRouting(createdEventIds: string[]) {
    if (createdEventIds.length === 0) return;

    if (createdEventIds.length === 1) {
      await router.push({
        path: `/events/${createdEventIds[0]}/about`,
      });
      return;
    }

    if (route.path !== "/events") {
      router.push({
        path: "/events",
        query: {
          id: createdEventIds.toString(),
        },
      });
      return;
    }

    const { view: viewQueryValue, ..._ } = route.query;
    router.push({
      query: {
        view: viewQueryValue,
        id: createdEventIds.toString(),
      },
    });
  }

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
