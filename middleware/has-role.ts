export default defineNuxtRouteMiddleware((to) => {
  // const nuxtApp = useNuxtApp();
  const tokenService = useAuthToken();
  const userRole = tokenService.getUserRole();
  const allowedRoles = to.meta.allowedRoles as string[];
  // console.log('userRole', userRole);
  // console.log('allowedRoles', allowedRoles);
  // console.log(allowedRoles.includes(userRole!));
  if (!allowedRoles.includes(userRole!)) {
    console.log('aborting navigation');
    abortNavigation('Du hast keine Berechtigung für diese Seite.');
  }
});
