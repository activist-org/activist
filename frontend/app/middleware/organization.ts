// SPDX-License-Identifier: AGPL-3.0-or-later

import { validate as isValidUUID } from "uuid";

export default defineNuxtRouteMiddleware((to) => {
  const orgId = to.params.orgId;

  if (typeof orgId !== "string" || !isValidUUID(orgId)) {
    const localePath = useLocalePath();

    return navigateTo(localePath("/organizations"), { replace: true });
  }
});
