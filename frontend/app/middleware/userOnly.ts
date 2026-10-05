// SPDX-License-Identifier: AGPL-3.0-or-later
export default defineNuxtRouteMiddleware(async () => {
  const { isUserSignedIn } = useUser();
  const localePath = useLocalePath();

  if (!isUserSignedIn) {
    return navigateTo(localePath("/auth/sign-in"));
  }
});
