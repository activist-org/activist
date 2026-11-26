// SPDX-License-Identifier: AGPL-3.0-or-later
import type { OptionCrudMutation } from "~~/shared/types/option-mutation";

// This composable can be used for simple creation, update and deletion operations.
export function useCustomMutation<TVariables, TData>(
  selectedCrudOperation: OptionCrudMutation | undefined,
  mutation: (variables: TVariables) => Promise<TData>,
  cacheInvalidationFunction:
    ((id: string) => Promise<void>) | (() => Promise<void>),
  idToInvalidate: MaybeRef<string>,

  /* 
    Pass special mutation lifecycle functions that are not the default lifecycle 
    functions defined below, in these three arguments.
    */
  onError?: (error: Error) => void,
  onMutate?: (...args: unknown[]) => void,
  onSuccess?: (...args: unknown[]) => Promise<void>
) {
  const { handleError } = useAppError();
  /* 
    Applying the default onSuccess function that was used on the most 
    composables that call useMutation prior to the refactor, while taking
    into account, which cache is invalidated for which ID and what
    CRUD operation is currently executed.
    */
  onSuccess ??= async () => {
    await cacheInvalidationFunction(unref(idToInvalidate));
    selectedCrudOperation?.onSuccess?.();
  };

  /*
    Applying the default onError function that was used on the most 
    composables that call useMutation prior to the refactor.
    */
  onError ??= (err: Error) => handleError(err);

  /*
    When not supplying a function for the onMutate argument,
    this composable behaves like no onMutate function was supplied
    to Pinia Colada's useMutation.
    */

  const { mutate, mutateAsync, isLoading } = useMutation({
    ...selectedCrudOperation,
    mutation,
    onMutate,
    onSuccess,
    onError,
  });

  return { mutate, mutateAsync, isLoading };
}
