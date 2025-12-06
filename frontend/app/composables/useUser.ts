// SPDX-License-Identifier: AGPL-3.0-or-later
export const useUser = () => {
  const { data } = useAuthState();
  const userIsSignedIn = !!data.value;
  const userIsAdmin = !!data.value?.user?.isAdmin;
  const roles: unknown[] = [];

  // TODO: This functions can be expanded to include more complex permission logic.
  const canEdit = (entity?: Entity | null) => {
    if (!userIsSignedIn) return false;
    if (userIsAdmin) return true;

    // Check if user is the creator of the entity.
    return entity?.createdBy === data.value?.user?.id;
  };

  const canDelete = (entity?: Entity) => {
    if (!userIsSignedIn) return false;
    if (userIsAdmin) return true;

    // Check if user is the creator of the entity.
    return entity?.createdBy === data.value?.user?.id;
  };

  const canCreate = () => {
    if (!userIsSignedIn) return false;
    if (userIsAdmin) return true;

    return true; // default to allowing creation for signed-in users
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
  };
};
