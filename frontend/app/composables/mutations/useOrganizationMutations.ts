// SPDX-License-Identifier: AGPL-3.0-or-later

export const useOrganizationMutations = () => {
  const { error, handleError } = useAppError();

  const { invalidateOrganizationList } = useOrganizationCache();

  const { mutateAsync: create, isLoading } = useMutation({
    mutation: (organizationData: CreateOrganizationInput) =>
      createOrganization(organizationData),
    async onSettled() {
      await invalidateOrganizationList();
    },
    onError(err) {
      handleError(err);
    },
  });

  return {
    loading: isLoading,
    error,
    create,
  };
};
