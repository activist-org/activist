// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Composable for handling errors in a consistent way across the app.
 * It provides a reactive error state and a handler function to process errors,
 * show toast notifications, and handle specific cases like unauthorized access.
 * @returns An object containing the reactive error state, a function to handle errors, and a function to clear errors.
 */
export function useAppError() {
  const { showToastError } = useToaster();
  const { clear } = useUserSession();

  // Reactive state to hold the current error.
  const error = ref<AppError | null>(null);

  const handleError = (e: unknown) => {
    const appError = e as AppError;

    // Set the reactive error state.
    error.value = appError;

    // Show the error toast.
    showToastError(appError?.message || "An unexpected error occurred");

    // Check for 401 Unauthorized status or cause.
    const isUnauthorized =
      appError?.status === 401 ||
      appError?.causeTag === AppErrorCause.UNAUTHORIZED;

    if (isUnauthorized) {
      // The server already rejected the session, so we just clear the local state.
      clear();
    }
  };

  // Helper to clear the error state if needed.
  const clearError = () => {
    error.value = null;
  };

  return {
    error: readonly(error),
    handleError,
    clearError,
  };
}
