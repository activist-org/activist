// SPDX-License-Identifier: AGPL-3.0-or-later
import { useModals } from "~/stores/modals";

import { FileUploadEntity } from "~/types/content/file-upload-entity";

export function useModalHandlers(modalName: string) {
  const modals = useModals();

  // const openModal = () => modals.openModalAndUpdateState(modalName);
  const openModal = (fileUploadEntity?: FileUploadEntity) => {
    console.log(
      "useModalHandlers/Opening modal:",
      modalName,
      "with entity:",
      fileUploadEntity
    );
    modals.openModalAndUpdateState(modalName);
  };
  const handleCloseModal = () => modals.closeModalAndUpdateState(modalName);

  return {
    openModal,
    handleCloseModal,
  };
}
