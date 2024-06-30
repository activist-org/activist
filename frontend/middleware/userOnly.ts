export default defineNuxtRouteMiddleware(async () => {
  const { userIsSignedIn } = useUser();
  const localePath = useLocalePath();

  if (!userIsSignedIn) {
    return navigateTo(localePath("/auth/sign-in"));
  }
});
