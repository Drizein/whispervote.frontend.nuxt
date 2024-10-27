// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
).append({
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/no-v-html': 'off',
    'vue/valid-v-slot': 'off',
    'vue/multi-word-component-names': 'off',
  },
});
