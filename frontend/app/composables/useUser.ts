// SPDX-License-Identifier: AGPL-3.0-or-later
export const useUser = () => {
  const { loggedIn, user } = useUserSession();

  const userIsSignedIn = loggedIn;
  const userIsAdmin = computed(() => user.value?.isAdmin || false);

  const roles: unknown[] = [];

  const canEdit = (entity?: Entity | null) => {
    if (!userIsSignedIn.value) return false;
    if (userIsAdmin.value) return true;
    return entity?.createdBy === user.value?.id;
  };

  const canDelete = (entity?: Entity) => {
    if (!userIsSignedIn.value) return false;
    if (userIsAdmin.value) return true;
    return entity?.createdBy === user.value?.id;
  };

  const canCreate = () => {
    if (!userIsSignedIn.value) return false;
    if (userIsAdmin.value) return true;
    return true;
  };

  const canView = () => {
    return true;
  };

  return {
    userIsSignedIn,
    userIsAdmin,
    roles,
    canEdit,
    canDelete,
    canCreate,
    canView,
    user,
  };
};
