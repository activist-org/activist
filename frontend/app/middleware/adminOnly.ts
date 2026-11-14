// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineNuxtRouteMiddleware(async () => {
  const { userIsAdmin, isUserSignedIn } = useUser();
  const localePath = useLocalePath();

  if (!userIsAdmin && isUserSignedIn) {
    return navigateTo(localePath("/home"));
  }
});
