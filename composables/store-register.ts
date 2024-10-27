export const useRegisterStore = defineStore('RegisterStore', () => {
  const showPrivacyWarning: Ref<boolean> = ref(true);

  return {
    showPrivacyWarning,
  };
}, { persist: true });
