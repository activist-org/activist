// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * Composable for managing modal handlers in a Vue component. This composable provides functions to open and close modals based on a given modal name. The openModal function allows you to open a modal and update its state with optional parameters, while the handleCloseModal function is used to close the modal and update its state accordingly. This composable relies on the useModals composable to manage the state of the modals in the application, ensuring that the correct modal is opened or closed based on the provided modal name.
 * @param modalName A string representing the name of the modal that you want to manage. This name is used to identify which modal to open or close when the respective functions are called.
 * @returns An object containing the openModal and handleCloseModal functions, which can be used to manage the opening and closing of modals in a Vue component based on the specified modal name.
 */
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
