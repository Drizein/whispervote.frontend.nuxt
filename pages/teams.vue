<template>
  <v-container class="fill-height">
    <v-row
      justify="center"
      align="center"
    >
      <v-col cols="12">
        <v-card
          rounded
          elevation="2"
          class="border-thin"
        >
          <v-data-table
            :items="teams"
            :headers="headers"
          >
            <template #item.roleSelection="{ item }">
              <v-select
                v-model="item.role"
                :items="roleOptions"
                class="my-3"
                @update:model-value="item.change = true"
              />
            </template>
            <template #item.actions="{ item }">
              <v-btn
                color="success"
                icon="mdi-check"
                variant="text"
                :disabled="!item.change"
                @click="save(item)"
              />
              <v-btn
                color="error"
                icon="mdi-close"
                variant="text"
                :disabled="!item.change"
                @click="cancel"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { RoleEnum, type TeamMemberDto } from '~/composables/dtos/teamMember.dto';

const teamsService = useTeamsService();
const teams = ref<TeamMemberDto[]>(await teamsService.getTeams());

const headers = [
  { title: 'ID', value: 'id', sortable: true },
  { title: 'Rolle', value: 'roleSelection', sortable: false },
  { title: 'Aktionen', value: 'actions', sortable: false },
];

const roleOptions = [
  { title: 'User', value: RoleEnum.User },
  { title: 'Moderator', value: RoleEnum.Moderator },
  { title: 'Admin', value: RoleEnum.Admin },
];

async function getTeams() {
  teams.value = await teamsService.getTeams();
}

function cancel() {
  getTeams();
}

async function save(item: TeamMemberDto) {
  await teamsService.changeRoleForTeamMember(item.id, item.role);
  await getTeams();
}
</script>

<style scoped>

</style>
