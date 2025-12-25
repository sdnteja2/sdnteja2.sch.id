import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default <Partial<Config>> {
  theme: {
    extend: {
      typography: () => ({
        night: {
          css: {
            '--tw-prose-body': 'var(--color-night-800)',
            '--tw-prose-headings': 'var(--color-night-700)',
            '--tw-prose-lead': 'var(--color-night-700)',
            '--tw-prose-links': 'var(--color-night-900)',
            '--tw-prose-bold': 'var(--color-night-800)',
            '--tw-prose-counters': 'var(--color-night-600)',
            '--tw-prose-bullets': 'var(--color-night-400)',
            '--tw-prose-hr': 'var(--color-night-300)',
            '--tw-prose-quotes': 'var(--color-night-900)',
            '--tw-prose-quote-borders': 'var(--color-night-300)',
            '--tw-prose-captions': 'var(--color-night-700)',
            '--tw-prose-code': 'var(--color-night-900)',
            '--tw-prose-pre-code': 'var(--color-night-100)',
            '--tw-prose-pre-bg': 'var(--color-night-900)',
            '--tw-prose-th-borders': 'var(--color-night-300)',
            '--tw-prose-td-borders': 'var(--color-night-200)',
            '--tw-prose-invert-body': 'var(--color-night-300)',
            '--tw-prose-invert-headings': 'var(--color-white)',
            '--tw-prose-invert-lead': 'var(--color-night-300)',
            '--tw-prose-invert-links': 'var(--color-white)',
            '--tw-prose-invert-bold': 'var(--color-white)',
            '--tw-prose-invert-counters': 'var(--color-night-400)',
            '--tw-prose-invert-bullets': 'var(--color-night-600)',
            '--tw-prose-invert-hr': 'var(--color-night-700)',
            '--tw-prose-invert-quotes': 'var(--color-night-100)',
            '--tw-prose-invert-quote-borders': 'var(--color-night-700)',
            '--tw-prose-invert-captions': 'var(--color-night-400)',
            '--tw-prose-invert-code': 'var(--color-white)',
            '--tw-prose-invert-pre-code': 'var(--color-night-300)',
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': 'var(--color-night-600)',
            '--tw-prose-invert-td-borders': 'var(--color-night-700)',
          },
        },
      }),
    },
  },
  plugins: [
    plugin(({ addComponents }: { addComponents: any, theme: any }) => {
      addComponents({
        '.headline': {},
        '.subheadline': {},
        '.cardHover': {},
      })
    }),
  ],
}
