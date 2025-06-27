export default defineNuxtRouteMiddleware(async (to, from) => {
  const session = await useAuth();

  if (session.data.value) {
    if (from.fullPath && from.fullPath !== to.fullPath) {
      return navigateTo(from.fullPath);
    } else {
      return navigateTo('/');
    }
  }
});