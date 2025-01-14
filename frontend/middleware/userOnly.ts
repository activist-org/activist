// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineNuxtRouteMiddleware(async () => {
  const { userIsSignedIn } = useUser();
  const localePath = useLocalePath();

  if (!userIsSignedIn) {
    return navigateTo(localePath("/auth/sign-in"));
  }
});
