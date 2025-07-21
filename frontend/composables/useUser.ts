// SPDX-License-Identifier: AGPL-3.0-or-later
export const useUser = () => {
  const { data } = useAuthState();

  const userIsSignedIn = !!data.value;
  const userIsAdmin = data.value?.user?.isAdmin === "true";
  const roles: unknown[] = [];

  return {
    userIsSignedIn,
    userIsAdmin,
    roles,
  };
};
