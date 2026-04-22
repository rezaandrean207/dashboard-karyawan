<template>
  <ClientOnly>
    <n-config-provider :theme-overrides="themeOverrides">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </n-config-provider>
  </ClientOnly>
</template>

<script>
export default {
  setup() {
    useHead({
      title: "Dashboard Karyawan",
      meta: [
        { property: "og:title", content: "Dashboard Karyawan" },
        {
          property: "og:image",
          content: "https://clickup.devlmu.com/img/logo-dna.png",
        },
      ],
    });
  },
  data() {
    return {
      themeOverrides: {
        common: {
          primaryColor: "#6b7280", // abu netral
          primaryColorHover: "#4b5563",
          primaryColorPressed: "#374151",
          primaryColorSuppl: "#9ca3af",
          heightMedium: "38px",
          borderRadius: '5px'
          // ini penting
          // boxShadow1: "none",
          // boxShadow2: "none",
        },

        Button: {
          textColor: "#111827", // teks gelap, bukan merah
        },

        Input: {
          border: "1px solid #e5e7eb",
          borderHover: "1px solid #9ca3af",
          borderFocus: "1px solid #6b7280",

          // boxShadowFocus: "0 0 0 1px rgba(107, 114, 128, 0.2)",
          boxShadowFocus: "none",

          color: "#ffffff",
          textColor: "#111827",
          placeholderColor: "#9ca3af",

          caretColor: "#6b7280",
        },
        Select: {
          peers: {
            InternalSelection: {
              border: "1px solid #e5e7eb",
              borderHover: "1px solid #9ca3af",
              borderFocus: "1px solid #6b7280",

              // boxShadowFocus: "0 0 0 1px rgba(107, 114, 128, 0.2)",
              boxShadowFocus: "none",

              color: "#ffffff",
              textColor: "#111827",
              placeholderColor: "#9ca3af",

              caretColor: "#6b7280",
            },
          },
        },
      },
    };
  },
};
</script>
