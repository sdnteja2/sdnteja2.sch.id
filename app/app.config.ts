export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
    },
    icons: {
      arrowDown: 'i-ph-arrow-down-duotone',
      arrowLeft: 'i-ph-arrow-left-duotone',
      arrowRight: 'i-ph-arrow-right-duotone',
      arrowUp: 'i-ph-arrow-up-duotone',
      caution: 'i-ph-warning-circle-duotone',
      check: 'i-ph-check-fat-duotone',
      chevronDoubleLeft: 'i-ph-caret-double-left-duotone',
      chevronDoubleRight: 'i-ph-caret-double-right-duotone',
      chevronDown: 'i-ph-caret-down-duotone',
      chevronLeft: 'i-ph-caret-left-duotone',
      chevronRight: 'i-ph-caret-right-duotone',
      chevronUp: 'i-ph-caret-up-duotone',
      close: 'i-ph-x-duotone',
      copy: 'i-ph-copy-duotone',
      copyCheck: 'i-ph-check-square-duotone',
      dark: 'i-ph-moon-duotone',
      drag: 'i-ph-dots-six-vertical-duotone',
      ellipsis: 'i-ph-dots-three-outline-duotone',
      error: 'i-ph-warning-octagon-duotone',
      external: 'i-ph-arrow-square-up-right-duotone',
      eye: 'i-ph-eye-duotone',
      eyeOff: 'i-ph-eye-slash-duotone',
      file: 'i-ph-file-text-duotone',
      folder: 'i-ph-folder-duotone',
      folderOpen: 'i-ph-folder-open-duotone',
      hash: 'i-ph-hash-duotone',
      info: 'i-ph-info-duotone',
      light: 'i-ph-sun-dim-duotone',
      loading: 'i-ph-hourglass-simple-low-duotone',
      menu: 'i-ph-list-duotone',
      minus: 'i-ph-minus-duotone',
      panelClose: 'i-ph-arrows-in-line-horizontal-duotone',
      panelOpen: 'i-ph-arrows-out-line-horizontal-duotone',
      plus: 'i-ph-plus-duotone',
      reload: 'i-ph-arrows-clockwise-duotone',
      search: 'i-ph-magnifying-glass-duotone',
      stop: 'i-ph-stop-duotone',
      success: 'i-ph-circle-wavy-check-duotone',
      system: 'i-ph-laptop-duotone',
      tip: 'i-ph-lightbulb-duotone',
      upload: 'i-ph-upload-simple-duotone',
      warning: 'i-ph-warning-duotone',
    },
    prose: {
      h1: {
        slots: {
          base: 'text-4xl font-bold mb-8 scroll-mt-[calc(45px+var(--ui-header-height))] lg:scroll-mt-(--ui-header-height)',
          // Hapus 'text-highlighted' dari class base
        },
      },
      h2: {
        slots: {
          base: 'relative text-2xl font-bold mt-12 mb-6 scroll-mt-[calc(48px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))]',
          // Hapus 'text-highlighted' dari sini juga
        },
      },
      h3: {
        slots: {
          base: 'relative text-xl font-bold mt-8 mb-3 scroll-mt-[calc(32px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(32px+var(--ui-header-height))]',
          // Hapus 'text-highlighted' dari sini juga
        },
      },
      h4: {
        slots: {
          base: 'text-lg font-bold mt-6 mb-2 scroll-mt-[calc(24px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(24px+var(--ui-header-height))]',
          // Hapus 'text-highlighted' dari sini juga
        },
      },
    },

    // prose: {
    //   p: {
    //     base: 'leading-[1.0] text-pretty my-0',
    //   },
    // },
  },
  site: {
    copyright: '© 2025 narr07. All rights reserved.',
    socialMedia: {
      email: {
        title: 'Email',
        icon: 'i-ph-envelope-simple-duotone',
        url: 'mailto:sdsnteja2@gmail.com',
      },
      instagram: {
        title: 'Instagram',
        icon: 'i-ph-instagram-logo-duotone',
        url: 'https://instagram.com/sdnteja2',
      },
    },
    government: {
      disdikMajalengka: {
        title: 'DISDIK MAJALENGKA',
        links: {
          link1: {
            name: 'Website Disdik Majalengka',
            url: 'https://disdik.majalengkakab.go.id/',
          },
          link2: {
            name: 'Aplikasi Dapodik',
            url: 'https://dapo.kemdikbud.go.id/',
          },
          link3: {
            name: 'PPDB Online',
            url: 'https://ppdb.majalengkakab.go.id/',
          },
          link4: {
            name: 'E-Learning',
            url: 'https://elearning.majalengkakab.go.id/',
          },
        },
      },
      disdikJabar: {
        title: 'DISDIK JABAR',
        links: {
          link1: {
            name: 'Website Disdik Jabar',
            url: 'https://disdik.jabarprov.go.id/',
          },
          link2: {
            name: 'Jabar Digital Service',
            url: 'https://digitalservice.jabarprov.go.id/',
          },
          link3: {
            name: 'SIAP Online',
            url: 'https://siap-online.com/',
          },
          link4: {
            name: 'Portal Data Jabar',
            url: 'https://opendata.jabarprov.go.id/',
          },
        },
      },
      kemdikdasmen: {
        title: 'KEMDIKDASMEN',
        links: {
          link1: {
            name: 'Website Kemdikdasmen',
            url: 'https://ditpsd.kemdikbud.go.id/',
          },
          link2: {
            name: 'Merdeka Belajar',
            url: 'https://merdekabelajar.kemdikbud.go.id/',
          },
          link3: {
            name: 'Platform Merdeka Mengajar',
            url: 'https://guru.kemdikbud.go.id/',
          },
          link4: {
            name: 'ANBK',
            url: 'https://anbk.kemdikbud.go.id/',
          },
        },
      },
    },
  },
})
