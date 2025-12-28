// SPDX-License-Identifier: AGPL-3.0-or-later

export const useOrganizationMutations = () => {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const create = async (eventData: CreateOrganizationInput) => {
    loading.value = true;
    error.value = null;
    try {
      const event = await createOrganization(eventData);
      await refreshOrganizationList();
      return event;
    } catch (e) {
      error.value = e as AppError;
      showToastError(error.value.message);
      return false;
    } finally {
      loading.value = false;
    }
  };
  const refreshOrganizationList = async () => {
    // Invalidate and refetch event list data.
    // Invalidate the useAsyncData cache so next read will refetch.
    await refreshNuxtData(getKeyForGetOrganizations());
  };

  return {
    loading,
    error,
    create,
    refreshOrganizationList,
  };
};
