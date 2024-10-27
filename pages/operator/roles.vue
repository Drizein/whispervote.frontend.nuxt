<template>
  <v-container class="fill-height">
    <v-row class="fill-height">
      <v-col>
        <v-card class="fill-height">
          <v-card-title>
            Anfragen
          </v-card-title>
          <v-divider />
          <v-card-text class="fill-height pa-0 pb-12">
            <v-data-table
              :items="requests"
              :items-per-page="10"
              class="fill-height"
              :headers="headers"
            >
              <template #item.actions="{ item }">
                <v-btn
                  color="success"
                  variant="text"
                  icon="mdi-check"
                  @click="acceptRequest(item)"
                />
                <v-btn
                  color="error"
                  variant="text"
                  icon="mdi-close"
                  @click="rejectRequest(item)"
                />
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { ChangeRoleRequestGetResponseDto } from '~/composables/dtos/ChangeRoleRequestGetResponseDto';

definePageMeta({
  middleware: ['auth', 'has-role'],
  allowedRoles: ['Operator', 'Admin'],
});

const userService = useUserService();

const requests: Ref<ChangeRoleRequestGetResponseDto[]> = ref(await loadRequests());

const headers = [
  { title: 'Erstellungsdatum', value: 'createdAt' },
  { title: 'Grund', value: 'reason' },
  { title: 'Aktionen', value: 'actions', sortable: false },
];

async function loadRequests(): Promise<any[]> {
  return (await userService.getAllOpenRoleChangeRequests()).map(request => ({
    ...request,
    createdAt: new Date(request.createdAt).toLocaleString(),
  }));
}

async function acceptRequest(item: ChangeRoleRequestGetResponseDto) {
  await userService.closeRoleChangeRequest({
    requestUserId: item.requesterId,
    isAccepted: true,
  });
  requests.value = await loadRequests();
}

async function rejectRequest(item: ChangeRoleRequestGetResponseDto) {
  await userService.closeRoleChangeRequest({
    requestUserId: item.requesterId,
    isAccepted: false,
  });
  requests.value = await loadRequests();
}
</script>

<style scoped>

</style>
