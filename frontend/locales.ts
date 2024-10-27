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
    code: "fr",
    language: "fr",
    name: "Français",
    file: "fr.json",
  },
];

export default locales;
