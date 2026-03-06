// SPDX-License-Identifier: AGPL-3.0-or-later

export const useOrganizationMutations = () => {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);
  const store = useOrganizationStore();

  const create = async (organizationData: CreateOrganizationInput) => {
    loading.value = true;
    error.value = null;
    try {
      const organization = await createOrganization(organizationData);
      await refreshOrganizationList();
      return organization;
    } catch (e) {
      error.value = e as AppError;
      showToastError(error.value.message);
      return false;
    } finally {
      loading.value = false;
    }
  };
  const refreshOrganizationList = async () => {
    // Invalidate and refetch organization list data.
    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetOrganizations());
    await refreshNuxtData(getKeyForGetOrganizations());
    // Clear cached organizations to force refetch with new data.
    store.setOrganizations([]);
  };

  return {
    loading,
    error,
    create,
    refreshOrganizationList,
  };
};
