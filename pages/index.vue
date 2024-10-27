<template>
  <v-container class="fill-height">
    <v-row
      v-show="loading"
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        class="d-flex justify-center"
      >
        <v-progress-circular indeterminate />
      </v-col>
      <v-col
        cols="12"
        class="d-flex justify-center"
      >
        Abstimmungen werden geladen...
      </v-col>
    </v-row>
    <v-row v-show="!loading">
      <v-col
        v-if="authed"
        cols="12"
      >
        <SurveySearchBarCard @search="searchByExcludedTags" />
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <SurveySearchResultCard
              v-for="survey in paginatedSurveys"
              :key="survey.Survey.SurveyId"
              :survey="survey.Survey"
              :survey-key="survey.PublicKey"
            />
          </v-col>
          <v-col cols="12">
            <v-container class="max-width">
              <v-pagination
                v-if="totalPages > 1"
                v-model="page"
                :length="totalPages"
              />
            </v-container>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { SurveyGetResponseDto } from '~/composables/dtos/surveyGetResponseDto';
import SurveySearchBarCard from '~/components/votes/dashboard/SurveySearchBarCard.vue';

const votingService = useVotingService();
const tokenService = useAuthToken();
const goTo = useGoTo();

const authed = ref(!tokenService.getTokenExpired());
const surveys: Ref<SurveyGetResponseDto[]> = ref([]);
const loading = ref(true);
const page = ref(1);
const dateSortedSurveys = computed(() => {
  const surveysCopy = surveys.value.slice();
  return surveysCopy.sort((a, b) => {
    return new Date(a.Survey.Runtime).getTime() - new Date(b.Survey.Runtime).getTime();
  });
});
const paginatedSurveys = computed(() => {
  return dateSortedSurveys.value.slice((page.value - 1) * 10, page.value * 10);
});
const totalPages = computed(() => {
  return Math.ceil(surveys.value.length / 10);
});
watch(page, () => {
  goTo(0, {
    duration: 500,
    easing: 'easeInOutQuad',
  });
});

onMounted(async () => {
  // for (let i = 0; i < 200; i++) {
  //   await votingService.createSurvey({
  //     title: 'Title',
  //     description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut lectus hendrerit, facilisis turpis euismod, semper nunc. Quisque sit amet mauris lacus. Pellentesque malesuada dui vel mauris egestas, eleifend imperdiet nisi iaculis. Aenean vehicula et leo ut ultrices. Maecenas condimentum luctus diam, non pretium lacus vulputate quis. Nunc rutrum sodales lorem non varius. Duis faucibus eros libero, tempor malesuada erat bibendum in. Nulla bibendum consectetur est, mattis facilisis enim porttitor a.
  //
  // Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam porta congue imperdiet. Mauris in tortor imperdiet arcu feugiat ornare. Ut pellentesque urna lectus, et ullamcorper sem congue ullamcorper. Aenean porta mollis felis, rhoncus pellentesque mi hendrerit vitae. Vestibulum consectetur et nisi ullamcorper imperdiet. Quisque pharetra, nibh vitae malesuada accumsan, arcu ex mollis nibh, ac eleifend quam neque sed erat.
  //
  // Mauris malesuada volutpat quam nec sagittis. Duis finibus sagittis eleifend. Praesent mollis lacinia ex id consectetur. Quisque porta nibh sed lacus volutpat, sed tristique massa tincidunt. Cras congue aliquam quam nec tristique. Aenean auctor purus ac lacus consequat molestie. Fusce tristique magna id quam convallis, a dictum mi fringilla. Maecenas sagittis risus ut laoreet laoreet. Fusce sodales cursus laoreet. Etiam vel justo sed libero suscipit sagittis.
  //
  // Nunc posuere scelerisque nibh a pellentesque. Integer commodo varius lectus non cursus. Quisque consectetur libero ut purus maximus volutpat. Morbi porta at purus sollicitudin aliquam. Suspendisse aliquet eros ipsum, in ultrices dui congue vitae. Donec sit amet ante eu metus ullamcorper vulputate. Aenean pulvinar ligula tortor, bibendum fringilla metus imperdiet id. Proin tincidunt facilisis libero, non scelerisque massa laoreet at. Aenean laoreet nulla vitae purus tempor cursus. Aenean nec ipsum vel lacus consequat gravida nec a risus.
  //
  // Nunc ex orci, tristique ac finibus vel, posuere quis dolor. Ut dapibus, justo eget ultricies semper, tellus ligula tincidunt massa, bibendum semper elit nunc sit amet est. Suspendisse porttitor massa ut finibus imperdiet. Cras facilisis sit amet eros eu placerat. Nullam a molestie diam. Morbi pretium congue sem et interdum. Curabitur in odio eget arcu condimentum luctus nec vel sem. Nunc ultricies lobortis urna, sit amet porttitor lacus elementum et. Aenean sagittis risus ligula, vel efficitur magna porta placerat. Ut luctus dui et ex vestibulum, at placerat enim eleifend. Cras neque nulla, facilisis et porta et, rhoncus eu lacus. In tempus convallis imperdiet. Sed lacinia nibh quis sem ornare commodo. Vestibulum a aliquam elit, quis sagittis tortor. Nullam finibus, libero a vestibulum venenatis, orci lectus egestas tellus, sit amet vehicula magna magna ut velit. Morbi finibus interdum posuere.`,
  //     options: [
  //       'option1',
  //       'option2',
  //       'option3',
  //       'option4',
  //     ],
  //     runtime: new Date(2025, 1, 1, 1, 1, 1),
  //     tags: ['test', 'test2'],
  //     information: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut lectus hendrerit, facilisis turpis euismod, semper nunc. Quisque sit amet mauris lacus. Pellentesque malesuada dui vel mauris egestas, eleifend imperdiet nisi iaculis. Aenean vehicula et leo ut ultrices. Maecenas condimentum luctus diam, non pretium lacus vulputate quis. Nunc rutrum sodales lorem non varius. Duis faucibus eros libero, tempor malesuada erat bibendum in. Nulla bibendum consectetur est, mattis facilisis enim porttitor a.
  //
  // Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam porta congue imperdiet. Mauris in tortor imperdiet arcu feugiat ornare. Ut pellentesque urna lectus, et ullamcorper sem congue ullamcorper. Aenean porta mollis felis, rhoncus pellentesque mi hendrerit vitae. Vestibulum consectetur et nisi ullamcorper imperdiet. Quisque pharetra, nibh vitae malesuada accumsan, arcu ex mollis nibh, ac eleifend quam neque sed erat.
  //
  // Mauris malesuada volutpat quam nec sagittis. Duis finibus sagittis eleifend. Praesent mollis lacinia ex id consectetur. Quisque porta nibh sed lacus volutpat, sed tristique massa tincidunt. Cras congue aliquam quam nec tristique. Aenean auctor purus ac lacus consequat molestie. Fusce tristique magna id quam convallis, a dictum mi fringilla. Maecenas sagittis risus ut laoreet laoreet. Fusce sodales cursus laoreet. Etiam vel justo sed libero suscipit sagittis.
  //
  // Nunc posuere scelerisque nibh a pellentesque. Integer commodo varius lectus non cursus. Quisque consectetur libero ut purus maximus volutpat. Morbi porta at purus sollicitudin aliquam. Suspendisse aliquet eros ipsum, in ultrices dui congue vitae. Donec sit amet ante eu metus ullamcorper vulputate. Aenean pulvinar ligula tortor, bibendum fringilla metus imperdiet id. Proin tincidunt facilisis libero, non scelerisque massa laoreet at. Aenean laoreet nulla vitae purus tempor cursus. Aenean nec ipsum vel lacus consequat gravida nec a risus.
  //
  // Nunc ex orci, tristique ac finibus vel, posuere quis dolor. Ut dapibus, justo eget ultricies semper, tellus ligula tincidunt massa, bibendum semper elit nunc sit amet est. Suspendisse porttitor massa ut finibus imperdiet. Cras facilisis sit amet eros eu placerat. Nullam a molestie diam. Morbi pretium congue sem et interdum. Curabitur in odio eget arcu condimentum luctus nec vel sem. Nunc ultricies lobortis urna, sit amet porttitor lacus elementum et. Aenean sagittis risus ligula, vel efficitur magna porta placerat. Ut luctus dui et ex vestibulum, at placerat enim eleifend. Cras neque nulla, facilisis et porta et, rhoncus eu lacus. In tempus convallis imperdiet. Sed lacinia nibh quis sem ornare commodo. Vestibulum a aliquam elit, quis sagittis tortor. Nullam finibus, libero a vestibulum venenatis, orci lectus egestas tellus, sit amet vehicula magna magna ut velit. Morbi finibus interdum posuere.`,
  //   });
  // }
  if (authed.value) {
    surveys.value = await votingService.getAllSurveysExcludedByTags(['NSFW', '18+', 'Explicit']);
  }
  else {
    surveys.value = await votingService.getAllSurveys();
  }
  loading.value = false;
});

async function searchByExcludedTags(tags: string[]) {
  loading.value = true;
  surveys.value = await votingService.getAllSurveysExcludedByTags(tags);
  console.log(surveys.value);
  loading.value = false;
}
</script>
