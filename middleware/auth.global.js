export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token");
  const role = useCookie("role").value;

  console.log("Middleware Auth - Token:", token.value);
  if (!token.value && to.path !== "/login") {
    return navigateTo("/login");
  } else if (
    (token.value && to.path === "/login") ||
    (token.value && to.path === "/")
  ) {
    if (role === "member") {
      return navigateTo("/karyawan/performaSaya");
    }
    if (role === "admin") {
      return navigateTo("/admin/listKaryawan");
    }
  }

  // 3. Proteksi role admin
  if (to.path.startsWith("/admin") && role !== "admin") {
    return navigateTo("");
  }

  if (to.path.startsWith("/karyawan") && role === "admin") {
    return navigateTo("/");
  }
});
