// SPDX-License-Identifier: AGPL-3.0-or-later

export function useModalHandlers<TProps = unknown, TContext = unknown>(
  modalName: string
) {
  const { updateContext, openModal, closeModal, modals } = useModals();

  // Accept props and context separately.
  const handleOpenModal = (props?: TProps, context?: TContext) => {
    openModal(modalName, props, context);
  };
  const handleCloseModal = () => closeModal(modalName);

  const handleUpdateContext = (context: TContext) => {
    updateContext(modalName, context);
  };

  const modal = computed(() => modals[modalName]);

  return {
    openModal: handleOpenModal,
    handleCloseModal,
    updateContext: handleUpdateContext,
    props: readonly(computed(() => modal.value?.props as TProps)),
    context: readonly(computed(() => modal.value?.context as TContext)),
  };
}
