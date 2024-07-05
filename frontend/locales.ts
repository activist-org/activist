export interface Locale {
  code: string;
  iso: string;
  name: string;
  file: string;
  isCatchallLocale?: boolean;
}

const locales: Locale[] = [
  {
    code: "en",
    iso: "en-US",
    name: "English",
    file: "en-US.json",
    isCatchallLocale: true,
  },
  {
    code: "de",
    iso: "de",
    name: "Deutsch",
    file: "de.json",
  },
  {
    code: "es",
    iso: "es",
    name: "Español",
    file: "es.json",
  },
  {
    code: "fr",
    iso: "fr",
    name: "Français",
    file: "fr.json",
  },
  {
    code: "pt",
    iso: "pt",
    name: "Português",
    file: "pt.json",
  },
];

export default locales;
