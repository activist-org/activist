// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineNuxtRouteMiddleware(async () => {
  const { userIsAdmin, userIsSignedIn } = useUser();
  const localePath = useLocalePath();

  if (!userIsAdmin && userIsSignedIn) {
    return navigateTo(localePath("/home"));
  }
});
