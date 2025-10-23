// SPDX-License-Identifier: AGPL-3.0-or-later
import type { EventType } from "~/types/events/event";

import { ColorByEventType } from "~/types/color";

type ColorKey = `${EventType}_${"light" | "dark"}`;

const colorByType: Record<ColorKey, ColorByEventType> = {
  learn_light: ColorByEventType.LEARN_LIGHT,
  action_light: ColorByEventType.ACTION_LIGHT,
  learn_dark: ColorByEventType.LEARN_DARK,
  action_dark: ColorByEventType.ACTION_DARK,
};

export const useColor = () => {
  const getColorModeImages = (path: string, ext: string = ".png") => {
    return `${path}_${useColorMode().value}${ext}`;
  };

  const getEventColorByType = (eventType: EventType) => {
    const colorMode = useColorMode();
    const suffix = colorMode.preference === "light" ? "light" : "dark";
    const key = `${eventType}_${suffix}` as ColorKey;
    return colorByType[key];
  };

  return { getColorModeImages, getEventColorByType };
};
