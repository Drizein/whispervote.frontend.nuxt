// https://nuxt.com/docs/api/configuration/nuxt-config
import { vuetifyConfig } from './vuetify.config';
import 'reflect-metadata';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['vuetify-nuxt-module', '@nuxt/eslint', ['@pinia/nuxt', { disableVuex: true }], 'pinia-plugin-persistedstate/nuxt'],
  app: {
    head: {
      title: 'WhisperVote',
      htmlAttrs: {
        lang: 'de',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  devtools: {
    enabled: true,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: true,
      },
    },
  },
  vuetify: {
    moduleOptions: {
      /* module specific options */
    },
    vuetifyOptions: vuetifyConfig,
  },
  piniaPluginPersistedstate: {
    key: 'whispervote_%id_state',
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
    },
    debug: true,
  },
  runtimeConfig: {
    public: {
      apis: {
        auth: '',
        signature: '',
        vote: '',
      },
    },
  },
});
