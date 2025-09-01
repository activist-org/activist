// SPDX-License-Identifier: AGPL-3.0-or-later
import type { LocaleObject } from "@nuxtjs/i18n";

export enum LOCALE_NAME {
  ARABIC = "العربية",
  ENGLISH = "English",
  FRENCH = "Français",
  GERMAN = "Deutsch",
  ITALIAN = "Italian",
  PORTUGUESE = "Português",
  SPANISH = "Español",
}

export enum LOCALE_CODE {
  ARABIC = "ar",
  ENGLISH = "en",
  FRENCH = "fr",
  GERMAN = "de",
  ITALIAN = "it",
  PORTUGUESE = "pt",
  SPANISH = "es",
}

export const locales: LocaleObject<string>[] = [
  {
    code: LOCALE_CODE.ARABIC,
    name: LOCALE_NAME.ARABIC,
    file: "../ar.json",
  },
  {
    code: LOCALE_CODE.ENGLISH,
    name: LOCALE_NAME.ENGLISH,
    file: "../en-US.json",
  },
  {
    code: LOCALE_CODE.FRENCH,
    name: LOCALE_NAME.FRENCH,
    file: "../fr.json",
  },
  {
    code: LOCALE_CODE.GERMAN,
    name: LOCALE_NAME.GERMAN,
    file: "../de.json",
  },
  {
    code: LOCALE_CODE.ITALIAN,
    name: LOCALE_NAME.ITALIAN,
    file: "../it.json",
  },
  {
    code: LOCALE_CODE.PORTUGUESE,
    name: LOCALE_NAME.PORTUGUESE,
    file: "../pt.json",
  },
  {
    code: LOCALE_CODE.SPANISH,
    name: LOCALE_NAME.SPANISH,
    file: "../es.json",
  },
];

export default locales;
