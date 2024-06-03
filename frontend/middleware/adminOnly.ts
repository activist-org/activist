export default defineNuxtRouteMiddleware(async () => {
  const { userIsAdmin, userIsSignedIn } = useUser();
  const localePath = useLocalePath();

  // if (!roles.includes("admin")) {
  //   return alert("Hey! No!");
  // }

  if (!userIsAdmin) {
    if (userIsSignedIn) {
      return navigateTo(localePath("/home"));
    }
    return alert("Hey! No!");
  }
});
