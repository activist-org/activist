// SPDX-License-Identifier: AGPL-3.0-or-later
import { LOCALE_CODE } from "~/locales";

export const newLandingPage = (locale?: LOCALE_CODE) => {
  switch (locale) {
    case LOCALE_CODE.GERMAN:
      return { headingText: "Wo wir anfangen." };
    case LOCALE_CODE.SPANISH:
      return { headingText: "Donde empezamos." };
    case LOCALE_CODE.FRENCH:
      return { headingText: "Notre point de départ." };
    case LOCALE_CODE.PORTUGUESE:
      return { headingText: "Onde nós começamos." };
    default:
      return { headingText: "Where we start." };
  }
};
