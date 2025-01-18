// SPDX-License-Identifier: AGPL-3.0-or-later
export interface Locale {
  code: string;
  language: string;
  name: string;
  file: string;
  isCatchallLocale?: boolean;
}

const locales: Locale[] = [
  {
    code: "en",
    language: "en-US",
    name: "English",
    file: "en-US.json",
    isCatchallLocale: true,
  },
  {
    code: "de",
    language: "de",
    name: "Deutsch",
    file: "de.json",
  },
  {
    code: "es",
    language: "es",
    name: "Español",
    file: "es.json",
  },
  {
    code: "fr",
    language: "fr",
    name: "Français",
    file: "fr.json",
  },
  {
    code: "pt",
    language: "pt",
    name: "Português",
    file: "pt.json",
  },
];

export default locales;
