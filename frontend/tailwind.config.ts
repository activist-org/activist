// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  darkMode: "class",
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })], // eslint-disable-line
  theme: {
    extend: {
      fontFamily: {
        sans: ["Red Hat Text"],
        display: ["Red Hat Display"],
      },
      screens: {
        "3xl": "1792px",
      },
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
        "password-very-weak": "rgba(var(--password-very-weak))",
        "password-weak": "rgba(var(--password-weak))",
        "password-medium": "rgba(var(--password-medium))",
        "password-strong": "rgba(var(--password-strong))",
      },
      transitionProperty: {
        width: "width",
        padding: "padding",
      },
    },
  },
};
