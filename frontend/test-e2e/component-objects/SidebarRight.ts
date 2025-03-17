// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Locator, Page } from "playwright";
import { LOCALE_CODE } from "~/locales";
import { getEnglishText } from "~/utils/i18n";

export const newSidebarRight = (
  parent: Page | Locator,
  locale?: LOCALE_CODE
) => {
  switch (locale) {
    case LOCALE_CODE.GERMAN:
      return {
        parent,
        closeButton: parent.getByRole("button", {
          name: "Rechte Seitenleiste ausklappen oder einklappen",
        }),
        openButton: parent.getByRole("button", {
          name: "Rechte Seitenleiste ausklappen oder einklappen",
        }),
      };
    case LOCALE_CODE.SPANISH:
      return {
        parent,
        closeButton: parent.getByRole("button", {
          name: /expandir o contraer la barra lateral derecha/i,
        }),
        openButton: parent.getByRole("button", {
          name: /expandir o contraer la barra lateral derecha/i,
        }),
      };
    case LOCALE_CODE.FRENCH:
      return {
        parent,
        closeButton: parent.getByRole("button", {
          name: "Étendre ou réduire la barre latérale droite",
        }),
        openButton: parent.getByRole("button", {
          name: "Étendre ou réduire la barre latérale droite",
        }),
      };
    case LOCALE_CODE.PORTUGUESE:
      return {
        parent,
        closeButton: parent.getByRole("button", {
          name: /expandir ou recolher a barra lateral direita/i,
        }),
        openButton: parent.getByRole("button", {
          name: /expandir ou recolher a barra lateral direita/i,
        }),
      };
    default:
      return {
        parent,
        closeButton: parent.getByRole("button", {
          name: new RegExp(
            getEnglishText(
              "i18n.components.sidebar_right_hamburger.collapse_aria_label"
            ),
            "i"
          ),
        }),
        openButton: parent.getByRole("button", {
          name: new RegExp(
            getEnglishText(
              "i18n.components.sidebar_right_hamburger.collapse_aria_label"
            ),
            "i"
          ),
        }),
      };
  }
};
