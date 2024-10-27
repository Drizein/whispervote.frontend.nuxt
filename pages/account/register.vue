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
              Registrieren
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-alert
                v-if="registerStore.showPrivacyWarning"
                closable
                color="warning"
                class="mb-4"
                icon="mdi-alert-circle-outline"
                @click:close="registerStore.showPrivacyWarning = false"
              >
                Um Anonymität zu gewährleisten, werden keine persönlichen Daten angefordert oder gespeichert.
                Aufgrund dessen ist eine Wiederherstellung des Accounts nicht möglich.
              </v-alert>
              <v-text-field
                v-model="registerDTO.username"
                label="Benutzername"
                class="mb-4"
                :rules="[
                  requiredRule,
                  (v) => minLengthRule(v, 3),
                  (v) => maxLengthRule(v, 32),
                ]"
                prepend-inner-icon="mdi-account"
              />
              <v-text-field
                v-model="registerDTO.password"
                class="mb-4"
                label="Passwort"
                :type="showPassword ? 'text' : 'password'"
                :rules="[
                  requiredRule,
                  (v) => minLengthRule(v, 12),
                  (v) => maxLengthRule(v, 256),
                  containsLowercaseRule,
                  containsUppercaseRule,
                  containsNumberRule,
                  containsSpecialCharacterRule,
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
              <p class="text-medium-emphasis mb-1">
                Passwortstärke
              </p>
              <v-progress-linear
                v-model="passwordStrength"
                :color="strengthColor"
                class="mb-4"
                max="100"
              />
              <v-text-field
                v-model="confirmPassword"
                class="mb-4"
                label="Passwort bestätigen"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :rules="[
                  requiredRule,
                  (v) => equalsRule(v, registerDTO.password),
                ]"
                prepend-inner-icon="mdi-lock"
              >
                <template #append-inner>
                  <v-icon
                    @click="showPasswordConfirm = !showPasswordConfirm"
                  >
                    {{ !showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off' }}
                  </v-icon>
                </template>
              </v-text-field>
              <v-text-field
                v-model="registerDTO.indentId"
                label="Ausweisnummer"
                class="mb-4"
                :rules="[
                  requiredRule,
                  (v) => minLengthRule(v, 9),
                  (v) => maxLengthRule(v, 9),
                ]"
                prepend-inner-icon="mdi-card-account-details"
              />
              <v-checkbox
                v-model="registerDTO.agb"
                label="Ich habe die AGB gelesen und akzeptiere sie."
                :rules="[
                  requiredRule,
                ]"
              />
              <p class="mt-4">
                Du hast bereits einen Account? <nuxt-link
                  class="text-decoration-none text-primary"
                  to="/account/login"
                >
                  Anmelden
                </nuxt-link>
              </p>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                type="submit"
              >
                Registrieren
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import stringEntropy from 'fast-password-entropy';
import {
  containsLowercaseRule, containsNumberRule, containsSpecialCharacterRule,
  containsUppercaseRule, equalsRule,
  maxLengthRule,
  minLengthRule,
  requiredRule,
} from '~/globals/validation-rules';
import type { RegisterPostDto } from '~/composables/dtos/register.post.dto';

const registerDTO: Ref<RegisterPostDto> = ref({
  username: '',
  password: '',
  agb: false,
  indentId: '',
});
const showPassword: Ref<boolean> = ref(false);
const showPasswordConfirm: Ref<boolean> = ref(false);
const formValid: Ref<boolean> = ref(false);
const confirmPassword: Ref<string> = ref('');
const passwordStrength = computed(() => {
  return stringEntropy(registerDTO.value.password);
});
const strengthColor = computed(() => {
  if (passwordStrength.value < 33) return 'error';
  if (passwordStrength.value < 66) return 'warning';
  return 'success';
});

const userService = useUserService();
const registerStore = useRegisterStore();

async function submit() {
  if (!formValid.value) return;
  await userService.register(registerDTO.value).then(() => {
    navigateTo('/account/login');
  }).catch((e) => {
    throw e;
  });
}
</script>

<style scoped>

</style>
