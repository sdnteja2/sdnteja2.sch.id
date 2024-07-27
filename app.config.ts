export default defineAppConfig({
  ui: {
    primary: 'merah',
    gray: 'cool',
    horizontalNavigation:
    {

      active: 'text-primary-700  dark:text-primary-300 font-black after:bg-primary-500 dark:after:bg-primary-400 after:rounded-full',
      icon: {
        base: 'flex-shrink-0 w-5 h-5 relative',
        active: 'text-primary-700 dark:text-primary-400',
        inactive: 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200',
      },
    },

  },
})
