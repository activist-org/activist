// SPDX-License-Identifier: AGPL-3.0-or-later
export const useOrganizationMutations = (options: OptionMutation = {}) => {
  const { error, handleError } = useAppError();

  const { invalidateOrganizationList } = useOrganizationCache();

  const {
    mutate: create,
    mutateAsync: createAsync,
    isLoading,
  } = useMutation({
    ...options.create,
    mutation: (organizationData: CreateOrganizationInput) =>
      createOrganization(organizationData),
    async onSuccess(data: Organization) {
      await invalidateOrganizationList();
      options.create?.onSuccess?.(data);
    },
    onError(err) {
      handleError(err);
    },
  });

  return {
    loading: isLoading,
    error,
    create,
    createAsync,
  };
};
