<template>
  <v-snackbar
    v-model="store.show"
    :title="title"
    :text="store.snackbar.message"
    :color="color"
  />
</template>

<script setup lang="ts">
const store = useSnackbarStore();
const title = computed<string>(() => {
  switch (store.snackbar.mode) {
    case 'error':
      return 'Fehler';
    case 'success':
      return 'Erfolg';
    case 'warning':
      return 'Warnung';
    default:
      return 'Information';
  }
});
const color = computed<string>(() => {
  switch (store.snackbar.mode) {
    case 'error':
      return 'error';
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    default:
      return 'info';
  }
});
</script>

<style scoped>

</style>
