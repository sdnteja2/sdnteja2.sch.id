// @ts-nocheck
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: {
      css: 'prettier',
      html: true,
      markdown: false,
    },
    vue: true,
    stylistic: true,
    typescript: true,
  }),

  {
    // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
    files: ['**/*.vue'],
    rules: {
      'style/no-tabs': 'off',
      'style/no-mixed-spaces-and-tabs': 'off',
      'vue/component-name-in-template-casing': 'off',
    },
  },

)
