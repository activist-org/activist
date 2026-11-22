// SPDX-License-Identifier: AGPL-3.0-or-later
export const useGroupMutations = (options: OptionMutation = {}) => {
  const { error } = useAppError();

  const { invalidateGroupList } = useGroupCache();

  const { mutate: create, isLoading } = useCustomMutation(
    options.create,
    (groupData: CreateGroupInput) => createGroup(groupData),
    invalidateGroupList,

    // No ID is provided in this mutation. Because the IDs are
    // of type String
    ref<string>(""),

    // The default error handling function is used.
    undefined,

    // No onMutate function that runs before the mutation is provided.
    undefined,

    // Now the special onSuccess function is provided.
    async (data) => {
      await invalidateGroupList();
      options.create?.onSuccess?.(data);
    }
  );

  return {
    loading: isLoading,
    error,
    create,
  };
};
