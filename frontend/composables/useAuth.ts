interface LoginResponse {
  data: object;
}

export const useAuth = () => {
  const localePath = useLocalePath();
  const authUser = useUser();
  const signIn = async (username: string, password: string) => {
    await $fetch<LoginResponse>(`${BASE_BACKEND_URL}/auth/sign_in/`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      onResponse: ({ response }) => {
        localStorage.setItem("accessToken", response._data.token);
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
    localStorage.removeItem("accessToken");
  };

  return {
    signIn,
    logout,
  };
};
