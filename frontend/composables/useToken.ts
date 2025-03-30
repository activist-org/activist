export const useToken = () => {
  const tokenStore = usePersistedToken();
  const getToken = async () => {
    return tokenStore.token;
  }
  const resetToken = async () => {
    tokenStore.resetToken();
  }

  return {
    getToken,
    resetToken,
  }
}
