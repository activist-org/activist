// SPDX-License-Identifier: AGPL-3.0-or-later
export const useSessionCache = () => {
  const { session, fetch: refresh } = useUserSession();
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
