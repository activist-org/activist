// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LOCALE_CODE } from "~/locales";

import { getLocaleText } from "~/utils/i18n";

export const newLandingPage = (locale?: LOCALE_CODE) => ({
  headingText: getLocaleText(locale)["i18n.components.landing_splash.header"],
});
