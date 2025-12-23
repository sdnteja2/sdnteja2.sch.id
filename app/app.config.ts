export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
      secondary: 'red',
    },

    button: {
      slots: {
        base: 'font-bold',
      },
      variants: {
        size: {
          md: {
            leadingIcon: 'size-4',
          },
        },
      },
      compoundVariants: [{
        color: 'neutral',
        variant: 'outline',
        class: 'ring-default hover:bg-accented',
      }],
      defaultVariants: {
        color: 'neutral',
        variant: 'outline',
      },
    },
  },
})
