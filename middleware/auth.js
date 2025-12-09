export default defineNuxtRouteMiddleware(() => {
  // Cek: middleware jangan dijalankan di server
  if (process.server) return;

  const token = localStorage.getItem("token");

  if (!token) {
    return navigateTo("/");
  }
});
