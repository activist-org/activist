// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LOCALE_CODE } from "~/locales";
import { getLocalText } from "~/utils/localeFileHandler";

export const newLandingPage = (locale?: LOCALE_CODE) => ({
  headingText: getLocalText(locale)["i18n.components.landing_splash.header"],
});
