export default defineNuxtRouteMiddleware((to) => {
  // Rute publik yang tidak perlu autentikasi
  const publicPaths = ["/", "/login"];

  // Ambil token: di server gunakan cookie, di client gunakan localStorage
  const token = process.server
    ? useCookie("token")?.value
    : typeof localStorage !== "undefined"
    ? localStorage.getItem("token")
    : null;

  // Jika tidak ada token dan rute bukan publik, arahkan ke halaman login
  if (!token && !publicPaths.includes(to?.path || "")) {
    return navigateTo("/");
  }

  // Jika sudah login tapi mengunjungi root/login, bisa arahkan ke dashboard (opsional)
  if (token && (to?.path === "/" || to?.path === "/login")) {
    return navigateTo("/listKaryawan");
  }
});
