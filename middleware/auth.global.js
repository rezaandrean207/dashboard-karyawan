export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token");
  const role = useCookie("role");

  const isLogin = to.path === "/login"; // hanya login page

  if(to.path === '/') {
    return navigateTo("login")
  }

  // Belum login → redirect ke login
  if (!token.value && !isLogin) {
    return navigateTo("/login");
  }

  // Sudah login tapi buka login page → redirect sesuai role
  if (token.value && isLogin) {
    return role.value === "admin"
      ? navigateTo("/admin/listKaryawan")
      : navigateTo("/karyawan/performaSaya");
  }

  // Role-based access
  if (to.path.startsWith("/karyawan") && role.value === "admin") {
    return navigateTo("/admin/listKaryawan");
  }

  if (to.path.startsWith("/admin") && role.value !== "admin") {
    return navigateTo("/karyawan/performaSaya");
  }

  // selain itu biarkan lanjut
});
