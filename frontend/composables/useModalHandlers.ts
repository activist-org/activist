// SPDX-License-Identifier: AGPL-3.0-or-later
import type { FileUploadEntity } from "~/types/content/file-upload-entity";

import { useModals } from "~/stores/modals";

export function useModalHandlers(modalName: string) {
  const modals = useModals();

  const openModal = (params?: { fileUploadEntity?: FileUploadEntity }) => {
    modals.openModalAndUpdateState(modalName, params);
  };
  const handleCloseModal = () => modals.closeModalAndUpdateState(modalName);

  return {
    openModal,
    handleCloseModal,
  };
}
