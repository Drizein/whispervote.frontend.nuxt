export function useSnackbar() {
  function show(payload: Snackbar) {
    const store = useSnackbarStore();
    store.snackbar = payload;
    store.show = true;
  }

  return {
    show,
  };
}

export const useSnackbarStore = defineStore('SnackbarStore', () => {
  const show = ref(false);
  const snackbar = ref<Snackbar>({
    message: '',
    mode: 'success',
  });

  return {
    show,
    snackbar,
  };
});

interface Snackbar {
  message: string;
  mode: 'success' | 'error' | 'warning';
}
