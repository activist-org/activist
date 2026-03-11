// SPDX-License-Identifier: AGPL-3.0-or-later
/*
 * useFlowScreens is the layer between the component and the store layer. It manages the screen showing,
 * loading states, and provides a simple API for the component to interact with the flow.
 * It also handles the execution of "action" type nodes, which are meant for performing side effects like API calls without rendering a screen. When the machine transitions to an "action" node, useFlowScreens will automatically call the provided onAction handler, pass the result back into the machine's shared data, and then advance to the next node based on the machine's definition. This allows for a clean separation of concerns, where the machine defines the flow logic and useFlowScreens handles the execution of side effects and screen rendering.
 * The main responsibilities of useFlowScreens include:
 * 1. Managing the current screen component based on the active node in the machine.
 * 2. Handling loading states during screen resolution and action execution.
 * 3. Providing an API for starting, advancing, going back, and closing the flow.
 * 4. Executing side-effect actions for "action" type nodes and integrating their results into the flow context.
 * 5. Calling lifecycle hooks like onNodeEnter when entering a new node.
 * 6. Handling form submission when the flow is finished by calling the onSubmit handler with the final data.
 *
 * This composable abstracts away the complexities of managing a multi-step flow with dynamic screens and side effects, allowing components to easily implement complex flows by simply defining their machine and providing necessary handlers.
 */

export function useFlowScreens(
  machineType: MachineType,
  options: UseFlowScreensOptions = {}
) {
  const store = machineRegistry[machineType]();

  const currentScreen: Ref<Component | null> = ref(null);
  const toast = useToaster();
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

    if (newNode.type === "action") {
      loading.value = true;
      try {
        if (options.onAction) {
          store.setSaving(true); // optionally set a saving state in the store
          // Call the API function provided by the Modal.
          const actionResult = await options.onAction(store.nodeData);

          // Save the result so the machine's onExit/next hooks can read it.
          store.setSharedData({ __lastActionResult: actionResult });
        }
        // Move to the next node automatically.
        await store.next();
      } catch (error) {
        const errorMessage = errorHandler(error);
        toast.showToastError(errorMessage.message);
        // Optionally handle errors (e.g., toast message) and don't advance.
      } finally {
        loading.value = false;
        store.setSaving(false); // reset the saving state
      }
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
        Promise.resolve(options.onSubmit?.(store.saveResult)).finally(() => {
          loading.value = false;
        });
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
    if (!createdEventIds || createdEventIds.length === 0) return;

    if (createdEventIds.length === 1) {
      await router.push({
        path: `/events/${createdEventIds[0]}/about`,
      });
      return;
    }

    const viewQueryValue = route.query.view;
    await router.push({
      path: "/events",
      query: {
        view: viewQueryValue,
        id: createdEventIds.join(","),
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
    sharedData: store?.sharedData,
    nodeData: store?.nodeData,
    currentStep: store?.currentStep,
    totalSteps: store?.totalSteps,
  }));

  const isSaving = computed(() => store?.saving ?? false);

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
