// SPDX-License-Identifier: AGPL-3.0-or-later
export const useUser = () => {
  const { loggedIn, user } = useUserSession();

  // 1. Use the built-in 'loggedIn' from nuxt-auth-utils
  // It automatically checks if session.value.user exists
  const userIsSignedIn = loggedIn;

  // 2. MUST be computed to update when session loads
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
    user, // This is now a Ref, use .value or unwrap in template
  };
};
