// SPDX-License-Identifier: AGPL-3.0-or-later

export const useGroupMutations = () => {
  const { showToastError } = useToaster();

  const store = useOrganizationStore();
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const create = async (groupData: CreateGroupInput) => {
    loading.value = true;
    error.value = null;
    try {
      const groupId = await createGroup(groupData);

      await refreshGroupList();

      return groupId;
    } catch (e) {
      error.value = e as AppError;
      showToastError(error.value.message);
      return false;
    } finally {
      loading.value = false;
    }
  };
  const refreshGroupList = async () => {
    // Invalidate and refetch group list data.
    clearNuxtData((key) => key.startsWith("groups-list:"));

    const organizationId = store.getOrganization()?.id;
    if (!organizationId) return;

    await refreshNuxtData(getKeyForGetOrganization(organizationId));
  };

  return {
    loading,
    error,
    create,
    refreshGroupList,
  };
};
