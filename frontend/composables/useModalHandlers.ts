// SPDX-License-Identifier: AGPL-3.0-or-later
import { useModals } from "~/stores/modals";

import { FileUploadEntity } from "~/types/content/file-upload-entity";

export function useModalHandlers(modalName: string) {
  const modals = useModals();

  const openModal = (fileUploadEntity?: FileUploadEntity) => {
    modals.openModalAndUpdateState(modalName, fileUploadEntity);
  };
  const handleCloseModal = () => modals.closeModalAndUpdateState(modalName);

  return {
    openModal,
    handleCloseModal,
  };
}
