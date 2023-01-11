// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
  ],
  content: {
    // https://content.nuxtjs.org/api/configuration
  },
  i18n: {
    // https://v8.i18n.nuxtjs.org/getting-started/setup
  },
  colorMode: {
    classSuffix: "",
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "activist",
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
      meta: [
        {
          name: "activist",
          content: "An open-source, nonprofit political activism network.",
        },
      ],
    },
  },
});
