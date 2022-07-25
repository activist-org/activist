module.exports = {
  content: [
    "/app/frontend/js/**/*.js",
    "/app/frontend/css/**/*.css",
    "/app/backend/**/*.html",
  ],
  theme: {
    fontFamily: {
      sans: ["SF Compact Text", "sans-serif"],
      serif: ["Georgia", "serif"],
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",

      "dark-header-bg": "rgba(22, 27, 34, 1)",
      "dark-content-bg": "rgba(1, 4, 9, 1)",
      "dark-distinct-bg": "rgba(13, 17, 23, 1)",
      "dark-btn-bg": "rgba(13, 17, 23, 1)",
      "dark-section-div": "rgba(33, 38, 45, 1)",
      "dark-text": "rgba(255, 255, 255, 0.80)",
      "dark-text-special": "rgba(140, 140, 140, 0.9)",
      "dark-text-link": "rgba(86, 167, 252, 0.9)",
      "dark-highlight": "rgba(140, 140, 140, 0.25)",
      "dark-interactive": "rgba(140, 140, 140, 1)",
      "dark-placeholder": "rgba(140, 140, 140, 0.9)",

      "light-header-bg": "rgba(240, 240, 235, 1)",
      "light-content-bg": "rgba(255, 255, 255, 1)",
      "light-distinct-bg": "rgba(246, 248, 250, 1)",
      "light-btn-bg": "rgba(246, 248, 250, 1)",
      "light-section-div": "rgba(216, 222, 228, 1)",
      "light-text": "rgba(0, 0, 0, 0.85)",
      "light-text-special": "rgba(115, 111, 114, 0.9)",
      "light-text-link": "rgba(0, 106, 214, 0.9)",
      "light-highlight": "rgba(115, 111, 114, 0.25)",
      "light-interactive": "rgba(115, 111, 114, 1)",
      "light-placeholder": "rgba(115, 111, 114, 0.9)",
    },
  },
};
