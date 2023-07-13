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
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Red Hat Text"],
        display: ["Red Hat Display"],
      },
      colors: {
        light: {
          header: "rgba(240, 240, 235, 1)",
          content: "rgba(255, 255, 255, 1)",
          distinct: "rgba(246, 248, 250, 1)",
          "section-div": "rgba(216, 222, 228, 1)",
          text: "rgba(0, 0, 0, 0.85)",
          "text-over-header": "rgba(36, 36, 35, 1)",
          "special-text": "rgba(90, 90, 90, 0.9)",
          "special-text-over-header": "rgba(105, 105, 105, 1)",
          "link-text": "rgba(0, 92, 184, 0.9)",
          "link-text-hover": "rgba(0, 59, 119, 0.9)",
          "menu-selection": "rgba(50, 50, 50, 1)",
          placeholder: "rgba(137, 134, 136, 1)",
          interactive: "rgba(75, 75, 67, 1)",
          highlight: "rgba(140, 140, 140, 0.20)",

          "cta-orange": {
            DEFAULT: "rgba(241, 153, 61, 1)",
            hover: "rgba(244, 173, 99, 1)",
          },
          "act-red": "rgba(153, 3, 30, 1)",
          "learn-blue": "rgba(0, 109, 170, 1)",
          "accepted-green": "rgba(106, 168, 79, 1)",
          "pending-yellow": "rgba(241, 194, 50, 1)",
          popup: "rgba(255, 255, 255, 0.90)",
        },

        dark: {
          header: "rgba(22, 27, 34, 1)",
          content: "rgba(6, 8, 15, 1)",
          distinct: "rgba(19, 19, 22, 1)",
          "section-div": "rgba(43, 50, 59, 1)",
          text: "rgba(255, 255, 255, 0.8)",
          "text-over-header": "rgba(208, 209, 211, 1)",
          "special-text": "rgba(150, 150, 150, 0.85)",
          "special-text-over-header": "rgba(131, 132, 133, 1)",
          "link-text": "rgba(86, 167, 252, 0.9)",
          "link-text-hover": "rgba(134, 192, 253, 0.9)",
          "menu-selection": "rgba(200, 200, 200, 1)",
          placeholder: "rgba(138, 138, 138, 1)",
          interactive: "rgba(133, 126, 123, 1)",
          highlight: "rgba(90, 90, 90, 0.25)",

          "cta-orange": {
            DEFAULT: "rgba(228, 155, 44, 1)",
            hover: "rgba(233, 172, 80, 1)",
          },
          "act-red": "rgba(221, 126, 107, 1)",
          "learn-blue": "rgba(109, 158, 235, 1)",
          "accepted-green": "rgba(182, 215, 168, 1)",
          "pending-yellow": "rgba(255, 217, 102, 1)",
          popup: "rgba(6, 8, 15, 0.90)",
        },

        social: {
          email: "rgba(219, 68, 55, 1)",
          mastodon: "rgba(68, 58, 204, 1)",
          twitter: "rgba(29, 161, 242, 1)",
          facebook: "rgba(66, 103, 178, 1)",
          instagram: "rgba(129, 52, 175, 1)",
        },
      },
    },
  },
};
