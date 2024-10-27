import type { VOptions } from 'vuetify-nuxt-module';
import { de } from 'vuetify/locale';

export const vuetifyConfig: VOptions = {
  ssr: true,
  locale: {
    locale: 'de',
    messages: { de },
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#6076ef',
          secondary: '#424242',
          error: '#ea6464',
          info: '#57bfd0',
          success: '#6bce70',
          warning: '#e7a640',
          background: '#121212',
        },
      },
      light: {
        colors: {
          primary: '#9145e0',
          secondary: '#424242',
          error: '#d24949',
          info: '#49dcef',
          success: '#57b65b',
          warning: '#ffa807',
          background: '#f5f5f5',
        },
      },
    },
  },
  defaults: {
    VTextField: {
      variant: 'solo-filled',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VSelect: {
      variant: 'solo-filled',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VAutocomplete: {
      variant: 'solo-filled',
      density: 'comfortable',
      hideDetails: 'auto',
    },
    VTextarea: {
      variant: 'solo-filled',
      density: 'comfortable',
      hideDetails: 'auto',
      noResize: true,
    },
    VCard: {
      elevation: 4,
    },
    VBtn: {
      variant: 'elevated',
      size: 'default',
    },
    VCheckbox: {
      hideDetails: 'auto',
      density: 'comfortable',
    },
  },
};
