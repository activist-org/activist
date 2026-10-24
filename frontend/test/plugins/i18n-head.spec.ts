// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick, ref } from "vue";

import i18nHeadPlugin from "../../app/plugins/i18n-head";

/**
 * Runs the i18n-head plugin against a minimal Nuxt app with the given locale.
 * @returns The locale ref and the router afterEach callback the plugin registered.
 */
const runPlugin = (initialLocale: string) => {
  const locale = ref(initialLocale);
  let afterEachCallback: (() => void) | undefined;
  const nuxtApp = {
    vueApp: {
      config: {
        globalProperties: {
          $router: {
            afterEach: vi.fn((cb: () => void) => {
              afterEachCallback = cb;
            }),
          },
        },
      },
    },
    $i18n: { locale },
  };

  (i18nHeadPlugin as unknown as (app: typeof nuxtApp) => void)(nuxtApp);

  return { locale, afterEach: () => afterEachCallback?.() };
};

describe("plugins/i18n-head", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
  });

  // MARK: Initial Attributes

  it("sets lang and an rtl dir on <html> for Arabic", () => {
    runPlugin("ar");
    expect(document.documentElement.getAttribute("lang")).toBe("ar");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
  });

  it("sets lang and an ltr dir on <html> for English", () => {
    runPlugin("en");
    expect(document.documentElement.getAttribute("lang")).toBe("en");
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");
  });

  // MARK: Locale Changes

  it("updates dir when the locale switches between ltr and rtl", async () => {
    const { locale } = runPlugin("en");

    locale.value = "ar";
    await nextTick();
    expect(document.documentElement.getAttribute("lang")).toBe("ar");
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");

    locale.value = "fr";
    await nextTick();
    expect(document.documentElement.getAttribute("lang")).toBe("fr");
    expect(document.documentElement.getAttribute("dir")).toBe("ltr");
  });

  it("resets dir after route changes", () => {
    const { afterEach } = runPlugin("ar");

    document.documentElement.setAttribute("dir", "ltr");
    afterEach();
    expect(document.documentElement.getAttribute("dir")).toBe("rtl");
  });
});
