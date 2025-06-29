// SPDX-License-Identifier: AGPL-3.0-or-later
export enum LOCALE_NAME {
  ARABIC = "العربية",
  ENGLISH = "English",
  FRENCH = "Français",
  GERMAN = "Deutsch",
  PORTUGUESE = "Português",
  SPANISH = "Español",
}

export enum LOCALE_CODE {
  ARABIC = "ar",
  ENGLISH = "en",
  FRENCH = "fr",
  GERMAN = "de",
  PORTUGUESE = "pt",
  SPANISH = "es",
}

export interface Locale {
  code: string;
  language: string;
  name: string;
  file: string;
  isCatchallLocale?: boolean;
}

export const locales: Locale[] = [
  {
    code: LOCALE_CODE.ARABIC,
    language: "ar",
    name: LOCALE_NAME.ARABIC,
    file: "../ar.json",
  },
  {
    code: LOCALE_CODE.ENGLISH,
    language: "en-US",
    name: LOCALE_NAME.ENGLISH,
    file: "../en-US.json",
    isCatchallLocale: true,
  },
  {
    code: LOCALE_CODE.FRENCH,
    language: "fr",
    name: LOCALE_NAME.FRENCH,
    file: "../fr.json",
  },
  {
    code: LOCALE_CODE.GERMAN,
    language: "de",
    name: LOCALE_NAME.GERMAN,
    file: "../de.json",
  },
  {
    code: LOCALE_CODE.PORTUGUESE,
    language: "pt",
    name: LOCALE_NAME.PORTUGUESE,
    file: "../pt.json",
  },
  {
    code: LOCALE_CODE.SPANISH,
    language: "es",
    name: LOCALE_NAME.SPANISH,
    file: "../es.json",
  },
];

export default locales;
