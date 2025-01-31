export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession()

  if (to.meta.auth === false) {
    return
  }

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
