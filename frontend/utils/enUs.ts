import enUs from "../../frontend/i18n/en-US.json";

type I18nKeys = typeof enUs & { [key: string]: string };

export const getI18nString = (key: string) => {
  return (enUs as I18nKeys)[key];
};
