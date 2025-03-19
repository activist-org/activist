// SPDX-License-Identifier: AGPL-3.0-or-later
import { LOCALE_CODE } from "~/locales";
import enUS from "../i18n/en-US.json" assert { type: "json" };
import de from "../i18n/de.json" assert { type: "json" };
import es from "../i18n/es.json" assert { type: "json" };
import fr from "../i18n/fr.json" assert { type: "json" };
import pt from "../i18n/pt.json" assert { type: "json" };

type LocaleFile = Record<string, string>;

const localeFiles: Record<LOCALE_CODE, LocaleFile> = {
  [LOCALE_CODE.ENGLISH]: enUS,
  [LOCALE_CODE.GERMAN]: de,
  [LOCALE_CODE.SPANISH]: es,
  [LOCALE_CODE.FRENCH]: fr,
  [LOCALE_CODE.PORTUGUESE]: pt,
};

export function getLocaleText(locale?: LOCALE_CODE): LocaleFile {
  return localeFiles[locale ?? LOCALE_CODE.ENGLISH];
}

export const getEnglishText = (key: string) => {
  return getLocaleText(LOCALE_CODE.ENGLISH)[key];
};
