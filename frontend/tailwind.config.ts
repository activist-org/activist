// SPDX-License-Identifier: AGPL-3.0-or-later


import { defineConfig } from "tailwindcss"; //update tailwindcss import type, defineconfig wraps the code and provides editor support as well as warnings for outdated usages
//import scrollbar from "tailwind-scrollbar"; //scroll bar import 

export default defineConfig({ //adjust for defineConfig
  content: [
    "~/components/**/*.{js,vue,ts}",
    "~/layouts/**/*.vue",
    "~/pages/**/*.vue",
    "~/plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  //darkMode: "class",  this config option no longer exists in new tailwind, it is now manual in html
  plugins: [
    require('tailwind-scrollbar')({
      nocompatible: true, 
      preferredStrategy: 'pseudoelements'}), // no import 
  ],
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
        "password-strength-very-weak":
          "rgba(var(--password-strength-very-weak))",
        "password-strength-weak": "rgba(var(--password-strength-weak))",
        "password-strength-medium": "rgba(var(--password-strength-medium))",
        "password-strength-strong": "rgba(var(--password-strength-strong))",
      },
      transitionProperty: {
        width: "width",
        padding: "padding",
      },
    },
  },
});
