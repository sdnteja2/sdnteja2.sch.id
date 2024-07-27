/* eslint-disable unused-imports/no-unused-vars */

import type { Config } from 'tailwindcss'

import plugin from 'tailwindcss/plugin'

export default <Partial<Config>> {

  theme: {
    extend: {
      colors: {
        kuning: {
          DEFAULT: '#F2A516',
          50: '#FCE8C4',
          100: '#FBE1B1',
          200: '#F8D28A',
          300: '#F6C363',
          400: '#F4B43D',
          500: '#F2A516',
          600: '#C5840B',
          700: '#906008',
          800: '#5B3D05',
          900: '#261902',
          950: '#0B0701',
        },
        merah: {
          DEFAULT: '#F22727',
          50: '#FCD4D4',
          100: '#FBC1C1',
          200: '#F99A9A',
          300: '#F77474',
          400: '#F44D4D',
          500: '#F22727',
          600: '#D40D0D',
          700: '#9F0A0A',
          800: '#6A0606',
          900: '#350303',
          950: '#1B0202',
        },
        gelap: {
          DEFAULT: '#110E26',
          50: '#B4AEE1',
          100: '#A69FDC',
          200: '#8B81D1',
          300: '#6F63C6',
          400: '#5445BB',
          500: '#463A9D',
          600: '#392F7F',
          700: '#2C2462',
          800: '#1E1944',
          900: '#110E26',
          950: '#080612',
        },

      },
      fontFamily: {
        title: ['Poppins'],
        body: ['Lato'],
      },
      typography: ({ theme }: { theme: any }) => ({
        merah: {
          css: {
            '--tw-prose-body': theme('colors.merah[800]'),
            '--tw-prose-headings': theme('colors.merah[900]'),
            '--tw-prose-lead': theme('colors.merah[700]'),
            '--tw-prose-links': theme('colors.merah[900]'),
            '--tw-prose-bold': theme('colors.merah[900]'),
            '--tw-prose-counters': theme('colors.merah[600]'),
            '--tw-prose-bullets': theme('colors.merah[400]'),
            '--tw-prose-hr': theme('colors.merah[300]'),
            '--tw-prose-quotes': theme('colors.merah[900]'),
            '--tw-prose-quote-borders': theme('colors.merah[300]'),
            '--tw-prose-captions': theme('colors.merah[700]'),
            '--tw-prose-code': theme('colors.merah[900]'),
            '--tw-prose-pre-code': theme('colors.merah[100]'),
            '--tw-prose-pre-bg': theme('colors.merah[900]'),
            '--tw-prose-th-borders': theme('colors.merah[300]'),
            '--tw-prose-td-borders': theme('colors.merah[200]'),
            '--tw-prose-invert-body': theme('colors.merah[200]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.merah[300]'),
            '--tw-prose-invert-links': theme('colors.white'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.merah[400]'),
            '--tw-prose-invert-bullets': theme('colors.merah[600]'),
            '--tw-prose-invert-hr': theme('colors.merah[700]'),
            '--tw-prose-invert-quotes': theme('colors.merah[100]'),
            '--tw-prose-invert-quote-borders': theme('colors.merah[700]'),
            '--tw-prose-invert-captions': theme('colors.merah[400]'),
            '--tw-prose-invert-code': theme('colors.white'),
            '--tw-prose-invert-pre-code': theme('colors.merah[300]'),
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': theme('colors.merah[600]'),
            '--tw-prose-invert-td-borders': theme('colors.merah[700]'),
          },
        },
      }),
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    plugin(({ addComponents, theme }: { addComponents: any, theme: any }) => {
      addComponents({
        '.headline': {},
        '.subheadline': {},
        '.cardHover': {},
      })
    }),
  ],
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './content/**/*.md',
  ],
}
