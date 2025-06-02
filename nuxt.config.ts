// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxt/test-utils/module"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },
  nitro: {
    storage: {
      public: {
        driver: "fs",
        base: "./public",
      },
    },
  },

  compatibilityDate: "2024-11-27",
});
