// SPDX-License-Identifier: AGPL-3.0-or-later
interface LoginResponse {
  data: object;
}

export const useAuth = () => {
  const localePath = useLocalePath();
  const authUser = useUser();
  const tokenStore = usePersistedToken();
  const signIn = async (username: string, password: string) => {
    await $fetch<LoginResponse>(`${BASE_BACKEND_URL}/auth/sign_in/`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      onResponse: ({ response }) => {
        tokenStore.persistToken(response._data.token || null);
        authUser.signInUser(["user"]);
        navigateTo(localePath("/home"));
      },
      onResponseError: ({ response }) => {
        if (response.status === 400) {
          alert("Invalid sign in credentials");
        } else {
          alert("An error occurred");
        }
      },
      // onResponseError is called but doesn't handle the error.
    }).catch(() => {});
  };

  const logout = async () => {
    tokenStore.resetToken();
  };

  return {
    signIn,
    logout,
  };
};
