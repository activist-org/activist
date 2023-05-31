import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  darkMode: "class",
  plugins: [ ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Red Hat Text"],
        display: ["Red Hat Display"],
      },
      colors: {
        "light-header": "rgba(240, 240, 235, 1)",
        "light-content": "rgba(255, 255, 255, 1)",
        "light-distinct": "rgba(246, 248, 250, 1)",
        "light-section-div": "rgba(216, 222, 228, 1)",
        "light-text": "rgba(0, 0, 0, 0.85)",
        "light-text-over-header": "rgba(36, 36, 35, 1)",
        "light-special-text": "rgba(90, 90, 90, 0.9)",
        "light-special-text-over-header": "rgba(105, 105, 105, 1)",
        "light-link-text": "rgba(0, 106, 214, 0.9)",
        "light-link-text-hover": "rgba(0, 82, 163, 0.9)",
        "light-menu-selection": "rgba(50, 50, 50, 1)",
        "light-placeholder": "rgba(137, 134, 136, 1)",
        "light-interactive": "rgba(75, 75, 67, 1)",
        "light-highlight": "rgba(140, 140, 140, 0.20)",

        "light-cta-orange": {
          DEFAULT: "rgba(241, 153, 61, 1)",
          light: "rgba(244, 173, 99, 1)",
        },
        "light-act-red": "rgba(153, 3, 30, 1)",
        "light-learn-blue": "rgba(0, 109, 170, 1)",
        "light-accepted-green": "rgba(106, 168, 79, 1)",
        "light-pending-yellow": "rgba(241, 194, 50, 1)",
        "light-popup": "rgba(255, 255, 255, 0.90)",

        "dark-header": "rgba(22, 27, 34, 1)",
        "dark-content": "rgba(6, 8, 15, 1)",
        "dark-distinct": "rgba(19, 19, 22, 1)",
        "dark-section-div": "rgba(43, 50, 59, 1)",
        "dark-text": "rgba(255, 255, 255, 0.8)",
        "dark-text-over-header": "rgba(208, 209, 211, 1)",
        "dark-special-text": "rgba(150, 150, 150, 0.85)",
        "dark-special-text-over-header": "rgba(131, 132, 133, 1)",
        "dark-link-text": "rgba(86, 167, 252, 0.9)",
        "dark-link-text-hover": "rgba(134, 192, 253, 0.9)",
        "dark-menu-selection": "rgba(200, 200, 200, 1)",
        "dark-placeholder": "rgba(138, 138, 138, 1)",
        "dark-interactive": "rgba(133, 126, 123, 1)",
        "dark-highlight": "rgba(90, 90, 90, 0.25)",

        "dark-cta-orange": {
          DEFAULT: "rgba(228, 155, 44, 1)",
          light: "rgba(233, 172, 80, 1)",
        },
        "dark-act-red": "rgba(221, 126, 107, 1)",
        "dark-learn-blue": "rgba(109, 158, 235, 1)",
        "dark-accepted-green": "rgba(182, 215, 168, 1)",
        "dark-pending-yellow": "rgba(255, 217, 102, 1)",
        "dark-popup": "rgba(6, 8, 15, 0.90)",

        "social-email": "rgba(219, 68, 55, 1)",
        "social-mastodon": "rgba(68, 58, 204, 1)",
        "social-twitter": "rgba(29, 161, 242, 1)",
        "social-facebook": "rgba(66, 103, 178, 1)",
        "social-instagram": "rgba(129, 52, 175, 1)",
      },
    },
  },
};
