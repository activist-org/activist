// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";
import { LOCALE_CODE } from "~/locales";
import { getI18nString } from "~/utils/enUs";

const getMenuLocator = (parent: Page | Locator) =>
  parent.locator(".dropdown-language").getByRole("menu");

export const newLanguageMenu = (
  parent: Page | Locator,
  locale?: LOCALE_CODE
) => {
  switch (locale) {
    case LOCALE_CODE.GERMAN:
      return {
        menu: getMenuLocator(parent),
        toggleOpenButton: parent.getByRole("button", {
          name: "Öffnen Sie ein Dropdown-Menü, um eine andere Sprache auszuwählen",
        }),
      };
    case LOCALE_CODE.SPANISH:
      return {
        menu: getMenuLocator(parent),
        toggleOpenButton: parent.getByRole("button", {
          name: "Abrir un menú desplegable para seleccionar otro idioma",
        }),
      };
    case LOCALE_CODE.FRENCH:
      return {
        menu: getMenuLocator(parent),
        toggleOpenButton: parent.getByRole("button", {
          name: "Ouvrir une liste déroulante pour sélectionner une autre langue",
        }),
      };
    case LOCALE_CODE.PORTUGUESE:
      return {
        menu: getMenuLocator(parent),
        toggleOpenButton: parent.getByRole("button", {
          name: "Abrir um menu pendente para selecionar outro idioma",
        }),
      };
    default:
      return {
        menu: getMenuLocator(parent),
        toggleOpenButton: parent.getByRole("button", {
          name: new RegExp(
            getI18nString(
              "components.dropdown_language.open_dropdown_aria_label"
            ),
            "i"
          ),
        }),
      };
  }
};
