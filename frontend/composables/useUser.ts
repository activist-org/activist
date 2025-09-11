// SPDX-License-Identifier: AGPL-3.0-or-later
export const useUser = () => {
  const { data } = useAuthState();

  const userIsSignedIn = !!data.value;
  const userIsAdmin = data.value?.user?.isAdmin;
  const roles: unknown[] = [];
  const signOutUser = () => {
    const { signOut } = useAuth();
    signOut();
  };

  return {
    userIsSignedIn,
    userIsAdmin,
    roles,
    signOutUser,
  };
};
