<!-- suppress CssUnresolvedCustomProperty -->
<template>
  <div>
    <NuxtRouteAnnouncer />
    <v-theme-provider theme="dark">
      <v-app>
        <v-main>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
          <Snackbar />
        </v-main>
      </v-app>
    </v-theme-provider>
  </div>
</template>

<script setup lang="ts">
const tokenService = useAuthToken();

onMounted(() => {
  if (tokenService.getTokenExpired()) {
    tokenService.removeAuthToken();
    navigateTo('/account/login');
  }
});
</script>
