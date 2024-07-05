export const useUser = defineStore("auth", {
  state: () => ({
    userIsSignedIn: false,
    userIsAdmin: false,
    roles: [] as string[],
  }),
  actions: {
    signInUser(roles: Array<string>) {
      this.userIsSignedIn = true;
      this.userIsAdmin = false;
      this.roles = [...roles];
    },
    signOutUser() {
      this.userIsSignedIn = false;
    },
  },
});
