// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LOCALE_CODE } from "~/locales";
import { getLocaleData } from "~/utils/localeFileHandler";
import { i18nMap } from "~/types/i18n-map";

export const newLandingPage = (locale?: LOCALE_CODE) => ({
  headingText: getLocaleData(locale)[i18nMap._global.header],
});
