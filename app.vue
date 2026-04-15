<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
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
</script>
