// SPDX-License-Identifier: AGPL-3.0-or-later

export const useGroupMutations = () => {
  const { error, handleError } = useAppError();

  const { invalidateGroupList } = useGroupCache();

  const { mutateAsync: create, isLoading } = useMutation({
    mutation: (groupData: CreateGroupInput) => createGroup(groupData),
    async onSuccess() {
      await invalidateGroupList();
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
