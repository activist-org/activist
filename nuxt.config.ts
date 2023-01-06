// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/content", "@nuxtjs/tailwindcss"],
  // content: {
  //   // https://content.nuxtjs.org/api/configuration
  // },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "activist",
      meta: [{ name: "activist", content: "Political activism network." }],
    },
  },
});
