// SPDX-License-Identifier: AGPL-3.0-or-later

import { validate as isValidUUID } from "uuid";

export default defineNuxtRouteMiddleware((to) => {
  const orgId = to.params.orgId;

  if (typeof orgId !== "string" || !isValidUUID(orgId)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Organization not found",
    });
  }
});
