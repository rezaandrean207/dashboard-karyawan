export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie("token");
  const role = useCookie("role");

  const isLoginPage = to.path === "/login";
  const isRoot = to.path === "/";

  const isWebView = to.query.view === "app";
  const webViewToken = to.query.token;

  // 🔐 WEBVIEW LOGIN
  if (isWebView && webViewToken && !token.value) {
    try {
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

  // ❌ BELUM LOGIN
  if (!token.value) {
    if (!isLoginPage) {
      return navigateTo("/login");
    }
    return; // biarin di login
  }

  // ✅ SUDAH LOGIN → HANDLE ROOT
  if (isRoot) {
    return role.value === "admin"
      ? navigateTo("/admin/listKaryawan")
      : navigateTo("/karyawan/performaSaya");
  }

  // ❌ ROLE INVALID (hanya kalau sudah login)
  if (!["admin", "member"].includes(role.value)) {
    token.value = null;
    role.value = null;
    return navigateTo("/login");
  }

  // ❌ SUDAH LOGIN tapi buka login
  if (isLoginPage) {
    return role.value === "admin"
      ? navigateTo("/admin/listKaryawan")
      : navigateTo("/karyawan/performaSaya");
  }

  // 🔒 ROLE-BASED ACCESS
  if (to.path.startsWith("/admin") && role.value !== "admin") {
    return navigateTo("/karyawan/performaSaya");
  }

  if (to.path.startsWith("/karyawan") && role.value !== "member") {
    return navigateTo("/admin/listKaryawan");
  }
});