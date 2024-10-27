<template>
  <div class="fill-height">
    <CHangeRoleRequestDialog
      v-model="requestRoleDialogOpen"
    />
    <v-navigation-drawer permanent>
      <template #prepend>
        <p class="text-h6 px-2 py-3 text-info">
          Whispervote
        </p>
      </template>
      <v-divider />
      <v-list
        nav
        density="comfortable"
      >
        <v-list-item
          v-for="route in displayRoutes"
          :key="route.to"
          :to="{ path: route.to }"
          :title="route.title"
          :prepend-icon="route.icon"
        />
      </v-list>
      <template #append>
        <v-list
          nav
          density="comfortable"
        >
          <v-list-item
            v-if="!tokenExpired"
            base-color="error"
            title="Abmelden"
            prepend-icon="mdi-logout"
            to="/account/login"
            @click="tokenService.removeAuthToken()"
          />
          <v-list-item
            v-if="!tokenExpired && (userRole === 'User' || userRole === 'Moderator')"
            base-color="success"
            title="Höhere Rechte beantragen"
            prepend-icon="mdi-account-plus"
            @click="requestRoleDialogOpen = true"
          />
        </v-list>
      </template>
    </v-navigation-drawer>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { RouteNavButton } from '~/interfaces/ui/RouteNavButton';
import { useTokenStore } from '~/composables/auth-token';

const tokenService = useAuthToken();
const tokenStore = useTokenStore();
const tokenExpired = computed(() => {
  const token = storeToRefs(tokenStore).token;
  if (token !== undefined) {
    return tokenService.getTokenExpired();
  }
  return true;
});
const requestRoleDialogOpen = ref(false);

const userRole: Ref<string | undefined> = ref(tokenService.getUserRole());
const displayRoutes = ref<RouteNavButton[]>([]);

watch(storeToRefs(tokenStore).token, () => {
  userRole.value = tokenService.getUserRole();
  updateDisplayRoutes();
});

onMounted(() => {
  updateDisplayRoutes();
});

function updateDisplayRoutes() {
  displayRoutes.value = routes.value.filter((route) => {
    if (route.roles.length > 0) {
      if (!userRole.value) {
        return false;
      }
      return route.roles.includes(userRole.value);
    }
    if (route.requiresAuth) {
      return !tokenExpired.value;
    }
    if (route.hideIfAuth) {
      return tokenExpired.value;
    }
    return true;
  });
}

const routes: Ref<RouteNavButton[]> = ref([
  {
    title: 'Anmelden',
    icon: 'mdi-login',
    to: '/account/login',
    requiresAuth: false,
    hideIfAuth: true,
    roles: [],
  },
  {
    title: 'Umfragen',
    icon: 'mdi-poll',
    to: '/',
    requiresAuth: false,
    hideIfAuth: false,
    roles: [],
  },
  {
    title: 'Rollenanfragen',
    icon: 'mdi-account',
    to: '/operator/roles',
    requiresAuth: true,
    hideIfAuth: false,
    roles: ['Operator', 'Admin'],
  },
  {
    title: 'Teamverwaltung',
    icon: 'mdi-account-group',
    to: '/teams',
    requiresAuth: true,
    hideIfAuth: false,
    roles: ['Admin', 'Operator'],
  },
  {
    title: 'Meldungen',
    icon: 'mdi-alert',
    to: '/report/dashboard',
    requiresAuth: true,
    hideIfAuth: false,
    roles: ['Moderator', 'Admin', 'Operator'],
  },
]);
</script>

<style scoped>

</style>
