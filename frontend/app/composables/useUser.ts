// SPDX-License-Identifier: AGPL-3.0-or-later
export const useUser = () => {
  const { loggedIn, user } = useUserSession();
  const isUserSignedIn = loggedIn;
  const userIsAdmin = computed(() => user.value?.isAdmin || false);

  const roles: unknown[] = [];

  const canEdit = (entity?: Entity | null) => {
    if (!isUserSignedIn.value) return false;
    if (userIsAdmin.value) return true;
    return entity?.createdBy === user.value?.id;
  };

  const canDelete = (entity?: Entity) => {
    if (!isUserSignedIn.value) return false;
    if (userIsAdmin.value) return true;
    return entity?.createdBy === user.value?.id;
  };

  const canCreate = (entity?: Entity | null) => {
    if (!isUserSignedIn.value) return false;
    if (userIsAdmin.value) return true;
    return entity?.createdBy === user.value?.id;
  };

  const canView = () => {
    return true;
  };

  return {
    isUserSignedIn,
    userIsAdmin,
    roles,
    canEdit,
    canDelete,
    canCreate,
    canView,
    user,
  };
};
