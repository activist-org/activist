interface LoginResponse {
    data: {};
  }

const BASE_BACKEND_URL = "http://localhost:8000/v1";

export const useAuth = () => {
    const login = async (username: string, password: string) => {
        await $fetch<LoginResponse>(`${BASE_BACKEND_URL}/auth/login/`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            onResponse: ({response}) => {
                console.log(response);
                localStorage.setItem("accessToken", response._data.token);
            }
        })
    }
    
    const logout = async () => {
        localStorage.removeItem("accessToken");
    }

    
    return {
        login,
        logout
    }
}