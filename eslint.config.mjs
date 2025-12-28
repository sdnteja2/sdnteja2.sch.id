// @ts-check
import antfu from '@antfu/eslint-config'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    // Enable formatting for CSS, HTML, and Markdown
    formatters: {
      css: true, // Format CSS with Prettier
      html: true, // Format HTML with Prettier
      markdown: true, // Format Markdown with Prettier
      // Prettier will also sort Tailwind classes via prettier-plugin-tailwindcss
      prettierOptions: {
        plugins: ['prettier-plugin-tailwindcss'],
      },
    },

    // Enable Vue, TypeScript support
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
    vue: true,

    // Enable stylistic formatting rules (instead of Prettier for JS/TS/Vue)
    stylistic: {
      indent: 2, // 2 spaces indentation
      jsx: true, // Enable JSX formatting
      quotes: 'single', // Single quotes
      semi: false, // No semicolons
    },

    // Enable JSONC and YAML support
    jsonc: true,
    yaml: true,

    // Respect .gitignore
    gitignore: true,
  }),

  // Global sorting rules
  {
    rules: {
      // Sort imports
      'perfectionist/sort-imports': ['error', {
        groups: [
          'type',
          ['builtin', 'external'],
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'object',
          'unknown',
        ],
        order: 'asc',
        type: 'natural',
      }],

      // Sort named imports
      'perfectionist/sort-named-imports': ['error', {
        order: 'asc',
        type: 'natural',
      }],
    },
  },

  // Vue-specific rules
  {
    files: ['**/*.vue'],
    rules: {
      // Vue component naming
      'vue/component-name-in-template-casing': ['error', 'PascalCase', {
        ignores: [],
        registeredComponentsOnly: false,
      }],

      // Vue formatting
      'vue/first-attribute-linebreak': ['error', {
        multiline: 'below',
        singleline: 'ignore',
      }],
      'vue/html-closing-bracket-newline': ['error', {
        multiline: 'always',
        singleline: 'never',
      }],
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': ['error', {
        multiline: { max: 1 },
        singleline: { max: 3 },
      }],

      // Vue best practices
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style'],
      }],
      'vue/multi-word-component-names': 'error',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',

      // Vue 3 specific
      'vue/no-ref-object-reactivity-loss': 'warn',
      'vue/no-setup-props-reactivity-loss': 'warn',
      'vue/prefer-import-from-vue': 'error',

      // Tailwind CSS ordering (with class sorting)
      'vue/attributes-order': ['error', {
        alphabetical: false,
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'ATTR_DYNAMIC',
          'ATTR_STATIC',
          'ATTR_SHORTHAND_BOOL',
          'EVENTS',
          'CONTENT',
        ],
      }],
    },
  },

  // TypeScript rules (using antfu's renamed prefix 'ts/')
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      'ts/consistent-type-definitions': ['error', 'interface'],
      'ts/consistent-type-imports': ['error', {
        disallowTypeAnnotations: false,
        prefer: 'type-imports',
      }],
      'ts/no-explicit-any': 'warn',
      'ts/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },

  // Nuxt-specific rules
  {
    files: [
      'pages/**/*.vue',
      'layouts/**/*.vue',
      'components/**/*.vue',
      'composables/**/*.ts',
      'utils/**/*.ts',
      'middleware/**/*.ts',
      'plugins/**/*.ts',
    ],
    rules: {
      // Prefer auto-imports
      'import/first': 'off',
      'import/order': 'off',
    },
  },

  // Disable stylistic rules for Tailwind classes
  {
    files: ['**/*.vue', '**/*.jsx', '**/*.tsx'],
    rules: {
      // Allow long lines for Tailwind classes
      'style/max-len': 'off',
      'vue/max-len': 'off',
    },
  },

  // Sorting rules untuk config files dan objects
  {
    files: ['*.config.{js,ts,mjs,cjs}', 'nuxt.config.ts', 'app.config.ts'],
    rules: {
      // Sort object keys alphabetically
      'perfectionist/sort-objects': ['error', {
        order: 'asc',
        partitionByComment: true,
        type: 'natural',
      }],
    },
  },
)
