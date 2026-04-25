// SPDX-License-Identifier: AGPL-3.0-or-later

export function useModalHandlers(modalName: string) {
  const { updateContext, openModal, closeModal, modals } = useModals();

  const handleOpenModal = (params?: unknown) => {
    openModal(modalName, params);
  };
  const handleCloseModal = () => closeModal(modalName);

  const handleUpdateContext = (params: unknown) => {
    updateContext(modalName, params);
  };

  return {
    openModal: handleOpenModal,
    handleCloseModal,
    updateContext: handleUpdateContext,
    context: readonly(computed(() => modals[modalName]?.context)),
  };
}
