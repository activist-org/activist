// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Config } from "tailwindcss";

import plugin from "tailwindcss/plugin";

export default <Partial<Config>>{
  content: [
    "~/components/**/*.{js,vue,ts}",
    "~/layouts/**/*.vue",
    "~/pages/**/*.vue",
    "~/plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  darkMode: "class",
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        // MARK: Style Utils

        ".card-style-base": {
          "@apply elem-shadow-sm rounded-md sm:rounded-lg": {},
        },
        ".elem-shadow-sm": {
          "@apply shadow-sm shadow-zinc-700": {},
        },

        // MARK: Focus Utils

        ".focus-brand": {
          "@apply focus-visible:border-link-text focus-visible:ring-link-text rounded-sm focus:outline-none focus-visible:ring-2":
            {},
        },
        ".focus-inside": {
          "@apply focus-within:border-link-text focus-within:ring-link-text rounded-sm focus-within:outline-none focus-within:ring-2":
            {},
        },

        // MARK: Text Utils

        ".responsive-h1": {
          "@apply font-display text-2xl sm:text-3xl md:text-4xl xl:text-5xl":
            {},
        },
        ".responsive-h2": {
          "@apply font-display text-xl sm:text-2xl md:text-3xl xl:text-4xl": {},
        },
        ".responsive-h3": {
          "@apply font-display text-lg sm:text-xl md:text-2xl xl:text-3xl": {},
        },
        ".responsive-h4": {
          "@apply font-display text-base sm:text-lg md:text-xl xl:text-2xl": {},
        },
        ".responsive-h5": {
          "@apply font-display text-base md:text-lg xl:text-xl": {},
        },
        ".responsive-h6": {
          "@apply font-display text-base xl:text-lg": {},
        },
      });
    }),
  ],
  theme: {
    extend: {
      // MARK: Fonts

      fontFamily: {
        sans: ["Red Hat Text"],
        display: ["Red Hat Display"],
      },

      // MARK: Breakpoints

      screens: {
        "3xl": "112rem",
      },

      // MARK: Color Derivation

      colors: {
        "layer-0": "rgba(var(--layer-0))",
        "layer-1": "rgba(var(--layer-1))",
        "layer-2": "rgba(var(--layer-2))",
        "section-div": "rgba(var(--section-div))",
        "primary-text": "rgba(var(--primary-text), 0.85)",
        "primary-text-over-layer-2": "rgba(var(--primary-text-over-layer-2))",
        "distinct-text": "rgba(var(--distinct-text), 0.90)",
        "distinct-text-over-layer-2": "rgba(var(--distinct-text-over-layer-2))",
        "link-text": "rgba(var(--link-text), 0.9)",
        "link-text-hover": "rgba(var(--link-text-hover), 0.9)",
        "menu-selection": "rgba(var(--menu-selection))",
        interactive: "rgba(var(--interactive))",
        highlight: "rgba(var(--highlight), 0.25)",
        "highlight-darker": "rgba(var(--highlight-darker), 0.3)",
        "highlight-lighter": "rgba(var(--highlight-lighter), 0.5)",
        "cta-orange": "rgba(var(--cta-orange))",
        "action-red": "rgba(var(--action-red))",
        "learn-blue": "rgba(var(--learn-blue))",
        "accepted-green": "rgba(var(--accepted-green))",
        "warn-yellow": "rgba(var(--warn-yellow))",
        "password-strength-very-weak":
          "rgba(var(--password-strength-very-weak))",
        "password-strength-weak": "rgba(var(--password-strength-weak))",
        "password-strength-medium": "rgba(var(--password-strength-medium))",
        "password-strength-strong": "rgba(var(--password-strength-strong))",
      },
    },
  },
};
