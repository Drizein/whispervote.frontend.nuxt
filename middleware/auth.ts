export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();
  const tokenService = useAuthToken();
  if (tokenService.getTokenExpired()) {
    tokenService.removeAuthToken();
    if (to.path !== '/account/login') {
      return nuxtApp.runWithContext(() => navigateTo('/account/login'));
    }
  }
});
