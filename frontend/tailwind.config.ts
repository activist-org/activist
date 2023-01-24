import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  darkMode: "class",
  plugins: [],
  theme: {
    extend: {
      colors: {
        "light-header-bg": "rgba(240, 240, 235, 1)",
        "light-content-bg": "rgba(255, 255, 255, 1)",
        "light-distinct-bg": "rgba(246, 248, 250, 1)",
        "light-section-div": "rgba(216, 222, 228, 1)",
        "light-text": "rgba(0, 0, 0, 0.8)",
        "light-special-text": "rgba(115, 111, 114, 0.9)",
        "light-link-text": "rgba(0, 106, 214, 0.9)",
        "light-menu-selection": "rgba(50, 50, 50, 1)",
        "light-placeholder": "rgba(137, 134, 136, 1)",
        "light-interactive": "rgba(75, 75, 67, 1)",
        "light-highlight": "rgba(50, 50, 50, 0.25)",

        "light-cta-orange": "rgba(241, 153, 61, 1)",
        "light-cta-orange-hover": "rgba(244, 173, 99, 1)",
        "light-act-red": "rgba(153, 3, 30, 1)",
        "light-learn-blue": "rgba(0, 109, 170, 1)",
        "light-accepted-green": "rgba(106, 168, 79, 1)",
        "light-pending-yellow": "rgba(241, 194, 50, 1)",

        "dark-header-bg": "rgba(22, 27, 34, 1)",
        "dark-content-bg": "rgba(6, 8, 15, 1)",
        "dark-distinct-bg": "rgba(19, 19, 22, 1)",
        "dark-section-div": "rgba(43, 50, 59, 1)",
        "dark-text": "rgba(255, 255, 255, 0.8)",
        "dark-special-text": "rgba(140, 140, 140, 0.9)",
        "dark-link-text": "rgba(86, 167, 252, 0.9)",
        "dark-menu-selection": "rgba(200, 200, 200, 1)",
        "dark-placeholder": "rgba(138, 138, 138, 1)",
        "dark-interactive": "rgba(133, 126, 123, 1)",
        "dark-highlight": "rgba(140, 140, 140, 0.3)",

        "dark-cta-orange": "rgba(228, 155, 44, 1)",
        "dark-cta-orange-hover": "rgba(233, 172, 80, 1)",
        "dark-act-red": "rgba(221, 126, 107, 1)",
        "dark-learn-blue": "rgba(109, 158, 235, 1)",
        "dark-accepted-green": "rgba(182, 215, 168, 1)",
        "dark-pending-yellow": "rgba(255, 217, 102, 1)",
      },
    },
  },
};
