// SPDX-License-Identifier: AGPL-3.0-or-later
import { useModals } from "~/stores/modals";

export function useModalHandlers(modalName: string) {
  const modals = useModals();

  const openModal = () => modals.openModalAndUpdateState(modalName);
  const handleCloseModal = () => modals.closeModalAndUpdateState(modalName);

  return {
    openModal,
    handleCloseModal,
  };
}
