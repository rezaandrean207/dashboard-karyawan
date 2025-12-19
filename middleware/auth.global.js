export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token")
  console.log("Middleware Auth - Token:", token.value)
  if (!token.value && to.path !== "/login") {
    return navigateTo("/login")
  } else if (token.value && to.path === "/login" || to.path === "/") {
    return navigateTo("/listKaryawan")
  }
})
