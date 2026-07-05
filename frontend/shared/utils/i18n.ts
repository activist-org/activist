// SPDX-License-Identifier: AGPL-3.0-or-later
import ar from "~~/i18n/locales/ar.json" with { type: "json" };
import de from "~~/i18n/locales/de.json" with { type: "json" };
import enUS from "~~/i18n/locales/en-US.json" with { type: "json" };
import es from "~~/i18n/locales/es.json" with { type: "json" };
import fr from "~~/i18n/locales/fr.json" with { type: "json" };
import id from "~~/i18n/locales/id.json" with { type: "json" };
import it from "~~/i18n/locales/it.json" with { type: "json" };
import pt from "~~/i18n/locales/pt.json" with { type: "json" };

import { LOCALE_CODE } from "#shared/utils/locales";

type LocaleFile = Record<string, string>;

const localeFiles: Record<LOCALE_CODE, LocaleFile> = {
  [LOCALE_CODE.ENGLISH]: enUS,
  [LOCALE_CODE.ARABIC]: ar,
  [LOCALE_CODE.GERMAN]: de,
  [LOCALE_CODE.INDONESIAN]: id,
  [LOCALE_CODE.ITALIAN]: it,
  [LOCALE_CODE.SPANISH]: es,
  [LOCALE_CODE.FRENCH]: fr,
  [LOCALE_CODE.PORTUGUESE]: pt,
};

export function getLocaleText(locale?: LOCALE_CODE): LocaleFile {
  return localeFiles[locale ?? LOCALE_CODE.ENGLISH];
}

export const getEnglishText = (key: string) => {
  // * Note: Included because i18n packages are recently released and have unexpected behavior.
  return (
    // @ts-expect-error: 'body' does not exist on type 'string'.
    getLocaleText(LOCALE_CODE.ENGLISH)[key]?.body?.static ||
    getLocaleText(LOCALE_CODE.ENGLISH)[key]
  );
};
