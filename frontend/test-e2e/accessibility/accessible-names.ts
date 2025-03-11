// SPDX-License-Identifier: AGPL-3.0-or-later
import { getEnglishText } from "~/utils/i18n";

export const ROADMAP_LINK_NAME = new RegExp(
  getEnglishText("i18n.components.btn_road_map.aria_label"),
  "i"
);
export const ACTIVIST_LANDING_LINK_NAME = new RegExp(
  getEnglishText("i18n.components.logo_activist.aria_label"),
  "i"
);
export const SIGN_IN_LINK_NAME = new RegExp(
  getEnglishText("i18n._global.sign_in_aria_label"),
  "i"
);
export const SIGN_UP_LINK_NAME = new RegExp(
  getEnglishText("i18n._global.sign_up_aria_label"),
  "i"
);
