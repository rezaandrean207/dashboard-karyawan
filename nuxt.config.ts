// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["@fortawesome/fontawesome-free/css/all.min.css"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "https://api.clickup.devlmu.com", // cukup didefinisikan, nilainya diambil dari .env
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
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap",
        },
        { rel: "stylesheet", href: "/css/style.css" },
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
