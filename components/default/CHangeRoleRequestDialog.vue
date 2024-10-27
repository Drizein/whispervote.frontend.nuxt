<template>
  <v-dialog
    v-model="model"
    width="600"
  >
    <v-card
      :title="`Anfrage`"
    >
      <v-divider />
      <v-form
        v-model="valid"
        @submit.prevent="requestHigherRole()"
      >
        <v-card-text>
          <v-textarea
            v-model="reason"
            label="Begründung"
            outlined
            rows="10"
            placeholder="Warum möchtest du eine höhere Rolle erhalten? (max. 500 Zeichen)"
            persistent-counter
            counter
            maxlength="500"
            :rules="[requiredRule]"
          />
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            prepend-icon="mdi-cancel"
            @click="model = false"
          >
            Abbrechen
          </v-btn>
          <v-btn
            prepend-icon="mdi-check"
            color="success"
            type="submit"
          >
            Anfragen
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { RequestRoleChangePostDTO } from '~/composables/dtos/RequestRoleChangePostDTO';
import { requiredRule } from '~/globals/validation-rules';

const tokenService = useAuthToken();
const userRole: Ref<string | undefined> = ref(tokenService.getUserRole());
const reason = ref('');
const model = defineModel<boolean>();
const valid = ref(false);

watch(model, (value) => {
  if (value) {
    reason.value = '';
    userRole.value = tokenService.getUserRole();
  }
  if (!value) {
    reason.value = '';
  }
});

async function requestHigherRole() {
  if (!valid.value) {
    return;
  }
  const requestedRole = getRoleName();
  if (!requestedRole) {
    return;
  }
  const request: RequestRoleChangePostDTO = {
    role: requestedRole!,
    reason: reason.value,
  };
  const userService = useUserService();
  await userService.requestRoleChange(request);
  model.value = false;
}

function getRoleName(): 'Operator' | 'User' | 'Moderator' | 'Admin' | undefined {
  if (!userRole.value) {
    return;
  }
  if (['Operator', 'Admin'].includes(userRole.value)) {
    return;
  }
  let requestedRole: 'Operator' | 'User' | 'Moderator' | 'Admin' = 'User';
  switch (userRole.value) {
    case 'User':
      requestedRole = 'Moderator';
      break;
    case 'Moderator':
      requestedRole = 'Admin';
      break;
  }
  return requestedRole;
}
</script>

<style scoped>

</style>
