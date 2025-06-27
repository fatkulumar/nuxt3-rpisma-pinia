export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data } = useAuth()
  if (!data.value) {
    return navigateTo('/login');
  }
});
