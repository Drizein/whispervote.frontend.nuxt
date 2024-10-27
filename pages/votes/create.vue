<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
      >
        <v-card>
          <v-card-title>
            Wahl erstellen
          </v-card-title>
          <v-divider />
          <v-form
            v-model="validForm"
            @submit.prevent="submit"
          >
            <v-card-text>
              <v-text-field
                v-model="payload.title"
                label="Titel"
                class="mb-4"
                prepend-inner-icon="mdi-text"
                :rules="[
                  requiredRule,
                ]"
              />
              <v-textarea
                v-model="payload.description"
                label="Beschreibung"
                rows="10"
                class="mb-4"
                prepend-inner-icon="mdi-text-box"
                :rules="[
                  requiredRule,
                ]"
              />
              <v-textarea
                v-model="payload.information"
                label="Zusatzinformationen"
                rows="5"
                class="mb-4"
                prepend-inner-icon="mdi-information"
              />
              <v-autocomplete
                v-model:search="tagSearchValue"
                v-model="payload.tags"
                chips
                multiple
                density="default"
                :items="tags"
                label="Tags"
                hide-details="auto"
                class="mb-4"
                prepend-inner-icon="mdi-tag"
              >
                <template #no-data>
                  <v-list-item
                    prepend-icon="mdi-plus"
                    base-color="success"
                    title="Tag erstellen"
                    @click="addTag(tagSearchValue)"
                  />
                </template>
              </v-autocomplete>
              <v-text-field
                v-model="optionValue"
                prepend-inner-icon="mdi-ballot"
                persistent-hint
                hint="Es müssen mindestens zwei Optionen erstellt werden."
                density="default"
                :items="tags"
                label="Optionen"
                hide-details="auto"
                class="mb-4"
                @keydown.enter="addOption"
              >
                <template #append>
                  <v-btn
                    color="primary"
                    variant="tonal"
                    icon="mdi-send"
                    @click="addOption"
                  />
                </template>
              </v-text-field>
              <v-card
                v-if="payload.options.length > 0"
                variant="outlined"
                class="border-thin mb-4"
                elevation="0"
              >
                <v-card-text class="pa-0">
                  <v-list
                    max-height="300px"
                    class="py-0"
                  >
                    <template
                      v-for="(option, i) in payload.options"
                      :key="`option-${i}`"
                    >
                      <v-divider v-if="i != 0" />
                      <v-list-item
                        :title="option"
                      >
                        <template #append>
                          <v-btn
                            icon
                            color="error"
                            variant="text"
                            @click="payload.options.splice(i, 1)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-card-text>
              </v-card>
              <v-text-field
                v-model="runtimeValue"
                label="Enddatum"
                class="mb-4"
                prepend-inner-icon="mdi-calendar"
                placeholder="tt.mm.jjjj"
                :rules="[
                  validDateRule,
                ]"
              />
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="success"
                prepend-icon="mdi-check"
                variant="elevated"
                :disabled="!validForm"
                @click="submit"
              >
                Erstellen
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { SurveyPostDto } from '~/composables/dtos/survey.post.dto';
import { requiredRule, validDateRule } from '~/globals/validation-rules';

const votingService = useVotingService();

const payload: Ref<SurveyPostDto> = ref(new SurveyPostDto());

const validForm = ref(false);

const tags = ref<string[]>([]);
const tagSearchValue = ref<string>('');

const optionValue = ref<string>('');

const runtimeValue = ref<string>('');

onMounted(async () => {
  tags.value = await votingService.getAllTags();
});

function addTag(tag: string) {
  if (payload.value.tags.some(t => t === tag)) {
    tagSearchValue.value = '';
    return;
  }
  if (tag === '') {
    return;
  }
  payload.value.tags.push(tag);
  tagSearchValue.value = '';
}

function addOption() {
  if (payload.value.options.some(o => o === optionValue.value)) {
    optionValue.value = '';
    return;
  }
  payload.value.options.push(optionValue.value);
  optionValue.value = '';
}

async function submit() {
  if (payload.value.options.length < 2) {
    return;
  }
  if (!validForm.value) {
    return;
  }
  const dateElements = runtimeValue.value.split('.');
  payload.value.runtime = new Date(
    parseInt(dateElements[2]),
    parseInt(dateElements[1]) - 1,
    parseInt(dateElements[0]),
    23,
    59,
    59,
    999,
  );
  await votingService.createSurvey(payload.value);
  navigateTo('/');
}
</script>

<style scoped>

</style>
