<template>
  <v-card :title="`Meldung (${report.reportSurveyId})`">
    <v-divider />
    <v-card-text>
      <p
        style="white-space: pre-wrap"
        class="mb-6"
      >
        {{ report.reason }}
      </p>
      <v-card
        variant="outlined"
        class="border-thin"
        elevation="0"
      >
        <v-list-item
          title="Umfrage anzeigen"
          class="py-3 px-4"
          @click="showSurvey = !showSurvey"
        />
        <v-divider v-if="showSurvey" />
        <v-expand-transition>
          <v-sheet
            v-if="showSurvey"
            class="pa-6"
          >
            <v-card
              :title="report.survey.title"
              variant="outlined"
              class="border-thin"
            >
              <v-divider />
              <v-card-text>
                <v-row no-gutters>
                  <v-col cols="12">
                    <div class="d-flex flex-row flex-wrap mb-6 mt-2">
                      <v-chip
                        v-for="tag in report.survey.tags"
                        :key="tag.id"
                        :text="tag.value"
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
                            style="white-space: pre-wrap;"
                          >
                            {{ report.survey.description }}
                          </p>
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
                            style="white-space: pre-wrap;"
                          >
                            {{ report.survey.information }}
                          </p>
                        </v-card-text>
                      </v-expand-transition>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-card
                      class="mb-3 border-thin"
                      variant="flat"
                      elevation="0"
                      density="comfortable"
                    >
                      <v-card-title class="text-subtitle-1">
                        Optionen
                      </v-card-title>
                      <v-divider />
                      <template
                        v-for="(option, i) in report.survey.options"
                        :key="`option-${i}`"
                      >
                        <v-list-item
                          color="success"
                        >
                          <v-list-item-title>
                            {{ option.value }}
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-sheet>
        </v-expand-transition>
      </v-card>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="success"
        prepend-icon="mdi-flag"
        text="Auflösen"
        @click="openResolutionDialog"
      />
    </v-card-actions>
    <v-dialog
      v-model="resolutionDialogOpen"
      width="600"
    >
      <v-card title="Meldung auflösen">
        <v-divider />
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field
                v-model="resolutionPayload.reportSurveyId"
                class="mb-4"
                prepend-inner-icon="mdi-flag"
                label="Umfrage-ID"
                disabled
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="resolutionPayload.resolution"
                prepend-inner-icon="mdi-text-box-check-outline"
                class="mb-2"
                label="Begründung"
                rows="10"
                maxlength="1000"
                counter
                persistent-counter
              />
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                v-model:search="tagSearchValue"
                v-model="selectedTags"
                chips
                multiple
                density="default"
                :items="tags"
                label="Tags hinzufügen"
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
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="resolutionPayload.strikeUser"
                color="error"
                label="Ersteller der Meldung verwarnen"
              />
            </v-col>
            <v-col cols="12">
              <v-checkbox
                v-model="resolutionPayload.strikeSurveyCreator"
                color="error"
                label="Ersteller der Wahl verwarnen"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="error"
            text="Abbrechen"
            prepend-icon="mdi-close"
            @click="resolutionDialogOpen = false"
          />
          <v-btn
            color="success"
            prepend-icon="mdi-flag"
            text="Auflösen"
            @click="resolve()"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import type { ReportGetDto } from '~/composables/dtos/Report.get.dto.ts';
import { CloseReportPostDto } from '~/composables/dtos/CloseReport.post.dto';

const report = defineModel('report', {
  required: true,
  type: Object as PropType<ReportGetDto>,
});

const votingService = useVotingService();
const showSnackbar = useSnackbar().show;

const readMore = ref(false);
const readMoreInfo = ref(false);
const showSurvey = ref(false);
const resolutionDialogOpen = ref(false);
const resolutionPayload = ref(new CloseReportPostDto());
const tags = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const tagSearchValue = ref<string>('');

onMounted(async () => {
  tags.value = await votingService.getAllTags();
  // exclude any tags that are already attached to the survey
  tags.value = tags.value.filter(t => !report.value.survey.tags.some(st => st.value === t));
});

function addTag(tag: string) {
  if (selectedTags.value.some(t => t === tag)) {
    tagSearchValue.value = '';
    return;
  }
  if (report.value.survey.tags.some(t => t.value === tag)) {
    tagSearchValue.value = '';
    showSnackbar({
      message: 'Dieser Tag ist bereits in der Umfrage enthalten.',
      mode: 'error',
    });
    return;
  }
  selectedTags.value.push(tag);
  tagSearchValue.value = '';
}

const emit = defineEmits<{
  (e: 'updateReports'): void;
}>();

function openResolutionDialog() {
  resolutionPayload.value = new CloseReportPostDto();
  resolutionPayload.value.reportSurveyId = report.value.reportSurveyId;
  resolutionDialogOpen.value = true;
}

async function resolve() {
  const service = useReportService();
  const votingService = useVotingService();
  if (selectedTags.value.length > 0) {
    await votingService.addTagsToSurvey(report.value.survey.id, selectedTags.value).catch(() => {
      return;
    });
  }
  await service.closeReport(resolutionPayload.value);
  emit('updateReports');
  resolutionDialogOpen.value = false;
}
</script>
