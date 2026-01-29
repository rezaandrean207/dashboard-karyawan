// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: [
    "@fortawesome/fontawesome-free/css/all.min.css",
    "@vuepic/vue-datepicker/dist/main.css",
    "~/assets/css/variables.css",
    "~/assets/css/style.css",
  ],
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL ||
        "https://api.clickup.devlmu.com", // cukup didefinisikan, nilainya diambil dari .env
    },
  },
  app: {
    head: {
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },

        // Google Font
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
        },

        // Material Symbols
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
        },
      ],
    },
  },

  // nitro: {
  //   devProxy: {
  //     "/api": {
  //       target: "http://localhost:8001",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
