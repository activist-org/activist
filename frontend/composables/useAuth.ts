interface LoginResponse {
  data: {};
}

export const useAuth = () => {
  const localePath = useLocalePath();
  const authUser = useUser();
  const login = async (username: string, password: string) => {
    await $fetch<LoginResponse>(`${BASE_BACKEND_URL}/auth/login/`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      onResponse: ({ response }) => {
        if (response.status === 400) {
          alert("Invalid login credentials");
          return;
        } else {
          localStorage.setItem("accessToken", response._data.token);
          authUser.signInUser(["user"]);
          navigateTo(localePath("/home"));
        }
      },
    });
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
  };

  return {
    login,
    logout,
  };
};
