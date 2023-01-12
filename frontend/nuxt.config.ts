// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },
  css: ["/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  content: {
    // https://content.nuxtjs.org/api/configuration
  },
  i18n: {
    // https://v8.i18n.nuxtjs.org/getting-started/setup
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "activist",
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/frontend/public/icons/light/favicon.ico",
          id: "light-scheme-icon",
        },
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/frontend/public/icons/dark/favicon.ico",
          id: "dark-scheme-icon",
        },
      ],
      meta: [
        {
          name: "activist",
          content: "An open-source, nonprofit political activism network.",
        },
      ],
    },
  },
});
