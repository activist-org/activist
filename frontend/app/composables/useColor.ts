// SPDX-License-Identifier: AGPL-3.0-or-later

type ColorKey = `${EventType}_${"light" | "dark"}`;

const colorByType: Record<ColorKey, ColorByEventTypeAndTheme> = {
  learn_light: ColorByEventTypeAndTheme.LEARN_LIGHT,
  action_light: ColorByEventTypeAndTheme.ACTION_LIGHT,
  learn_dark: ColorByEventTypeAndTheme.LEARN_DARK,
  action_dark: ColorByEventTypeAndTheme.ACTION_DARK,
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
