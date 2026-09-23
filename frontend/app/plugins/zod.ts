// SPDX-License-Identifier: AGPL-3.0-or-later
import { z } from "zod";

// Zod 4 reports missing values as "Invalid input: expected string, received undefined".
// Restore the concise "Required" message from Zod 3 for empty form fields.
// Messages set directly on a schema still take precedence over this.
export default defineNuxtPlugin((nuxtApp) => {
  const $i18n = nuxtApp.$i18n as { t: (key: string) => string } | undefined;

  z.config({
    customError: (issue) => {
      if (issue.code === "invalid_type" && issue.input === undefined) {
        return $i18n?.t("i18n._global.required") ?? "Required";
      }
      return undefined;
    },
  });
});
