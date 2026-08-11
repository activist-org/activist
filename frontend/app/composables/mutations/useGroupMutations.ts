// SPDX-License-Identifier: AGPL-3.0-or-later

export const useGroupMutations = (options: OptionMutation = {}) => {
  const { error, handleError } = useAppError();

  const { invalidateGroupList } = useGroupCache();

  const { mutate: create, isLoading } = useMutation({
    mutation: (groupData: CreateGroupInput) => createGroup(groupData),
    async onSuccess() {
      await invalidateGroupList();
      options.create?.onSuccess?.();
    },
    onError(err) {
      handleError(err);
    },
    ...options.create,
  });

  return {
    loading: isLoading,
    error,
    create,
  };
};
