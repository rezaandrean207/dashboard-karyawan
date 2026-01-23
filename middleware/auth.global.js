export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token");
  const role = useCookie("role");

  const isLoginPage = to.path === "/login";

  // Root → login
  if (to.path === "/") {
    return navigateTo("/login");
  }

  // Belum login
  if (!token.value) {
    if (!isLoginPage) {
      return navigateTo("/login");
    }
    return;
  }

  // Token ada tapi role invalid
  if (!["admin", "member"].includes(role.value)) {
    token.value = null;
    role.value = null;
    return navigateTo("/login");
  }

  // Sudah login tapi buka login page
  if (isLoginPage) {
    return role.value === "admin"
      ? navigateTo("/admin/listKaryawan")
      : navigateTo("/karyawan/performaSaya");
  }

  // Role-based access
  if (to.path.startsWith("/admin") && role.value !== "admin") {
    return navigateTo("/karyawan/performaSaya");
  }

  if (to.path.startsWith("/karyawan") && role.value !== "member") {
    return navigateTo("/admin/listKaryawan");
  }
});
