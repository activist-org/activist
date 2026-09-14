export const useSessionCache = () => {
  const { session, fetch:refresh } = useUserSession();
  const invalidateSessionCache = async () => {
      await refresh();
  };
  const getSessionCache = () => {
    return session.value;
  };
  return {
    invalidateSessionCache,
    getSessionCache,
  };
};
