// SPDX-License-Identifier: AGPL-3.0-or-later

export const useGroupMutations = () => {
  const { showToastError } = useToaster();

  const loading = ref(false);
  const error = ref<Error | null>(null);

  const create = async (groupData: CreateGroupInput) => {
    loading.value = true;
    error.value = null;
    try {
      const group = await createGroup(groupData);
      await refreshGroupList();
      return group;
    } catch (e) {
      error.value = e as AppError;
      showToastError(error.value.message);
      return false;
    } finally {
      loading.value = false;
    }
  }
  const refreshGroupList = async () => {
    // Invalidate and refetch group list data.
    // Invalidate the useAsyncData cache so next read will refetch.
    clearNuxtData((key) => key.startsWith('groups-list:'));
  }

  return {
    loading,
    error,
    create,
    refreshGroupList,
  }
}
