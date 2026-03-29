// SPDX-License-Identifier: AGPL-3.0-or-later

export function useModalHandlers(modalName: string) {
  const modals = useModals();

  const openModal = (params?: unknown) => {
    modals.openModalAndUpdateState(modalName, params);
  };
  const handleCloseModal = () => modals.closeModalAndUpdateState(modalName);

  return {
    openModal,
    handleCloseModal,
  };
}
