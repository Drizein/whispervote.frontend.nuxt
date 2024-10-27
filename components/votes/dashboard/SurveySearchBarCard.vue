<template>
  <v-card variant="elevated">
    <v-card-title>
      Suche
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-autocomplete
        v-model="selectedTags"
        chips
        multiple
        variant="solo-filled"
        :items="tags"
        label="Tags zum ausschließen"
        hide-details="auto"
      />
    </v-card-text>
    <v-divider />
    <v-card-actions class="pa-4 d-flex flex-column">
      <v-btn
        block
        variant="tonal"
        color="success"
        prepend-icon="mdi-plus"
        class="mb-2"
        @click="navigateTo('/votes/create')"
      >
        Wahl erstellen
      </v-btn>
      <v-btn
        block
        variant="elevated"
        color="primary"
        prepend-icon="mdi-magnify"
        @click="emit('search', selectedTags)"
      >
        Suchen
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const votingService = useVotingService();

const tags = ref<string[]>([]);
const selectedTags = ref<string[]>([]);

const emit = defineEmits<{
  (e: 'search', tags: string[]): void;
}>();

onMounted(async () => {
  tags.value = await votingService.getAllTags();
  if (!tags.value.includes('NSFW')) {
    tags.value.push('NSFW');
    selectedTags.value.push('NSFW');
  }
  else {
    selectedTags.value.push('NSFW');
  }
  if (!tags.value.includes('Explicit')) {
    tags.value.push('Explicit');
    selectedTags.value.push('Explicit');
  }
  else {
    selectedTags.value.push('Explicit');
  }
  if (!tags.value.includes('18+')) {
    tags.value.push('18+');
    selectedTags.value.push('18+');
  }
  else {
    selectedTags.value.push('18+');
  }
});
</script>

<style scoped>

</style>
