export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie("token");
  const role = useCookie("role");

  const isLoginPage = to.path === "/login";
  const isWebView = to.query.view === "app";
  const webViewToken = to.query.token;

  // Root → login
  if (to.path === "/") {
    return navigateTo("/login");
  }

  // 🔐 MODE WEBVIEW
  if (isWebView && webViewToken && !token.value) {
    try {
      // validasi token android ke backend
      const data = await $fetch("/api/v1/auth/login", {
        method: "POST",
        body: { token: webViewToken },
      });

      token.value = data.token;
      role.value = data.role;
    } catch {
      return navigateTo("/login");
    }
  }

  // Belum login
  if (!token.value) {
    if (!isLoginPage) {
      return navigateTo("/login");
    }
    return;
  }

  // Role invalid
  if (!["admin", "member"].includes(role.value)) {
    token.value = null;
    role.value = null;
    return navigateTo("/login");
  }

  // Sudah login tapi buka login
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
