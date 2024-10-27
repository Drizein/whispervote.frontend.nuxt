<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        lg="5"
      >
        <v-card>
          <v-form
            v-model="formValid"
            @submit.prevent="submit"
          >
            <v-card-title>
              Anmelden
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-text-field
                v-model="loginDTO.username"
                label="Benutzername"
                class="mb-4"
                :rules="[
                  requiredRule,
                ]"
                prepend-inner-icon="mdi-account"
              />
              <v-text-field
                v-model="loginDTO.password"
                class="mb-4"
                label="Passwort"
                :type="showPassword ? 'text' : 'password'"
                :rules="[
                  requiredRule,
                ]"
                prepend-inner-icon="mdi-lock"
              >
                <template #append-inner>
                  <v-icon
                    @click="showPassword = !showPassword"
                  >
                    {{ !showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
                  </v-icon>
                </template>
              </v-text-field>
              <p class="text-high-emphasis">
                <v-tooltip
                  text="Das Wiederherstellen des Passworts ist nicht möglich. Bitte kontaktieren Sie den Administrator."
                >
                  <template #activator="{ props }">
                    <v-icon
                      class="mr-1 mb-1"
                      v-bind="props"
                    >
                      mdi-information-outline
                    </v-icon>
                  </template>
                </v-tooltip>
                Noch keinen Account? <nuxt-link
                  class="text-decoration-none text-primary"
                  to="/account/register"
                >
                  Registrieren
                </nuxt-link>
              </p>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                type="submit"
              >
                Anmelden
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { LoginPostDto } from '~/composables/dtos/login.post.dto';
import { requiredRule } from '~/globals/validation-rules';

const loginDTO: Ref<LoginPostDto> = ref({
  username: '',
  password: '',
});
const showPassword: Ref<boolean> = ref(false);
const formValid: Ref<boolean> = ref(false);

const userService = useUserService();
const tokenService = useAuthToken();

async function submit() {
  if (!formValid.value) return;
  const token: string | undefined = await userService.login(loginDTO.value).catch((_e) => {
    return undefined;
  });
  if (!token) return;
  tokenService.setAuthToken(token);
  navigateTo('/');
}
</script>

<style scoped>

</style>
