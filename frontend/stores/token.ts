// SPDX-License-Identifier: AGPL-3.0-or-later
export const usePersistedToken = defineStore("token", {
  state: () => ({
    userToken: null as string | null,
  }),
  actions: {
    persistToken(token: string | null) {
      this.$state.userToken = token;
    },
    resetToken() {
      this.$reset();
    }
  },
  getters: {
    token(state) {
      return state.userToken;
    }
  },
  persist: {
    storage: localStorage,
    key: "token",
  },
})
