<template>
  <v-card
    :title="survey.Title"
    variant="flat"
    class="mb-4"
  >
    <v-divider />
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="12">
          <div class="d-flex flex-row flex-wrap mb-6 mt-2">
            <v-chip
              v-for="tag in survey.Tags"
              :key="tag.Id"
              :text="tag.Value"
              label
              density="comfortable"
              size="small"
              class="mr-2"
            />
          </div>
        </v-col>
        <v-col cols="12">
          <v-card
            variant="outlined"
            class="border-thin mb-6 pa-0"
            elevation="0"
          >
            <v-list-item
              density="compact"
              class="py-3 px-4"
              @click="readMore = !readMore"
            >
              <v-list-item-title class="text-subtitle-1">
                Beschreibung
              </v-list-item-title>
            </v-list-item>
            <v-divider v-if="readMore" />
            <v-expand-transition>
              <v-card-text
                v-if="readMore"
              >
                <p
                  class="pa-4"
                  v-html="formattedDescription"
                />
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card
            variant="outlined"
            class="border-thin mb-6 pa-0"
            elevation="0"
          >
            <v-list-item
              density="compact"
              class="py-3 px-4"
              @click="readMoreInfo = !readMoreInfo"
            >
              <v-list-item-title class="text-subtitle-1">
                Zusatzinformationen
              </v-list-item-title>
            </v-list-item>
            <v-divider v-if="readMoreInfo" />
            <v-expand-transition>
              <v-card-text
                v-if="readMoreInfo"
              >
                <p
                  class="pa-4"
                  v-html="formattedInformation"
                />
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </v-col>
        <v-col
          v-if="authed"
          cols="12"
        >
          <v-card
            class="mb-3 border-thin"
            variant="flat"
            elevation="0"
            density="comfortable"
          >
            <template
              v-for="(option, i) in survey.Options"
              :key="`option-${i}`"
            >
              <v-list-item
                :active="option.Selected"
                color="success"
                @click="selectOption(option)"
              >
                <template #prepend>
                  <v-checkbox
                    v-model="option.Selected"
                    density="comfortable"
                    class="mr-2"
                  />
                </template>
                <v-list-item-title>
                  {{ option.Value }}
                </v-list-item-title>
              </v-list-item>
              <v-progress-linear
                v-model="option.Count"
                :max="survey.TotalVotes"
                color="success"
              />
            </template>
          </v-card>
        </v-col>
        <v-col
          v-else
          cols="12"
        >
          <v-card
            class="mb-3 border-thin"
            variant="flat"
            elevation="0"
            density="comfortable"
          >
            <template
              v-for="(option, i) in survey.Options"
              :key="`option-${i}`"
            >
              <v-list-item
                :active="option.Selected"
                color="success"
              >
                <v-list-item-title>
                  {{ option.Value }}
                </v-list-item-title>
              </v-list-item>
              <v-progress-linear
                v-model="option.Count"
                :max="survey.TotalVotes"
                color="success"
              />
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <span class="text-medium-emphasis ml-4">
        {{ survey.TotalVotes }} Stimmen
      </span>
      <v-divider
        class="mx-2"
        vertical
      />
      <span class="text-medium-emphasis">
        Läuft bis {{ new Date(survey.Runtime).toLocaleDateString() }}
      </span>
      <v-spacer />
      <v-btn
        v-if="authed"
        color="error"
        text="Wahl melden"
        prepend-icon="mdi-flag-variant"
        @click="openReportDialog"
      />
      <v-btn
        v-if="authed"
        color="success"
        text="Abstimmen"
        :disabled="!canSubmit"
        prepend-icon="mdi-check"
        @click="vote()"
      />
    </v-card-actions>
  </v-card>
  <v-dialog
    v-model="reportDialogOpen"
    width="600"
  >
    <v-card title="Umfrage melden">
      <v-divider />
      <v-card-text>
        <v-textarea
          v-model="reportDialogPayload.reason"
          label="Begründung"
          outlined
          rows="10"
          placeholder="Warum möchtest du diese Umfrage melden? (max. 1000 Zeichen)"
          persistent-counter
          counter
          maxlength="1000"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          prepend-icon="mdi-cancel"
          @click="reportDialogOpen = false"
        >
          Abbrechen
        </v-btn>
        <v-btn
          prepend-icon="mdi-check"
          color="success"
          @click="reportSurvey"
        >
          Anfragen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { SurveyGetResponseOptionDto, SurveyGetResponseSurveyDto } from '~/composables/dtos/surveyGetResponseDto';
import { ReportSurveyPostDto } from '~/composables/dtos/ReportSurvey.post.dto';

const props = defineProps<{
  survey: SurveyGetResponseSurveyDto;
  surveyKey: string;
}>();

const tokenService = useAuthToken();
const votingService = useVotingService();
const authed = ref(!tokenService.getTokenExpired());
const reportDialogOpen = ref(false);
const reportDialogPayload = ref(new ReportSurveyPostDto());

const readMore = ref(false);
const canSubmit = computed(() => props.survey.Options.some(o => o.Selected));

const readMoreInfo = ref(false);
const formattedInformation = props.survey.Information.replace(/\n/g, '<br>');

const formattedDescription = props.survey.Description.replace(/\n/g, '<br>');

function openReportDialog() {
  reportDialogPayload.value.surveyId = props.survey.SurveyId;
  reportDialogOpen.value = true;
}

async function reportSurvey() {
  const service = useReportService();
  await service.reportSurvey(reportDialogPayload.value);
  reportDialogOpen.value = false;
  reportDialogPayload.value = new ReportSurveyPostDto();
}

function selectOption(option: SurveyGetResponseOptionDto) {
  option.Selected = !option.Selected;
  props.survey.Options.forEach((o) => {
    if (o.Value !== option.Value) o.Selected = false;
  });
}

function vote() {
  votingService.vote(props.surveyKey, props.survey.SurveyId, props.survey.Options.find(o => o.Selected)!.OptionId);
}
</script>

<style scoped>

</style>
