// SPDX-License-Identifier: AGPL-3.0-or-later

export const useGroupMutations = () => {
  const store = useOrganizationStore();
  const loading = ref(false);
  const { error, handleError, clearError } = useAppError();

  const create = async (groupData: CreateGroupInput) => {
    loading.value = true;
    clearError();
    try {
      const group = await createGroup(groupData);
      await refreshGroupList();
      return group;
    } catch (e) {
      handleError(e);
      return false;
    } finally {
      loading.value = false;
    }
  };
  const refreshGroupList = async () => {
    // Invalidate and refetch group list data.
    // Invalidate the useAsyncData cache so next read will refetch.
    clearNuxtData((key) => key.startsWith("groups-list:"));
    if (store.getOrganization()) {
      await refreshNuxtData(
        getKeyForGetOrganization(store.getOrganization().id)
      );
    }
  };

  return {
    loading,
    error,
    create,
    refreshGroupList,
  };
};
