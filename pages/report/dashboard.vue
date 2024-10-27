<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        v-for="(_report, i) in openReports"
        :key="`${i}-report`"
        cols="12"
      >
        <ReportElementCard
          v-model:report="openReports[i]"
          @update-reports="reloadReports"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import ReportElementCard from '~/components/reports/ReportElementCard.vue';

const reportingService = useReportService();
const openReports = ref(await reportingService.getAllOpenReports());

async function reloadReports() {
  openReports.value = await reportingService.getAllOpenReports();
}
</script>
