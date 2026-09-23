export function useSearch() {
  const route = useRoute()
  const searchTerm = ref('')

  const links = computed(() => [
    {
      label: 'Beranda',
      description: 'Halaman utama profil dan informasi SDN Teja II',
      icon: 'i-lucide-home',
      to: '/',
      active: route.path === '/'
    },
    {
      label: 'Profil & Legalitas Sekolah',
      description: 'Data identitas, akreditasi, sarana prasarana, visi & misi',
      icon: 'i-lucide-school',
      to: '/data/sekolah',
      active: route.path === '/data/sekolah'
    },
    {
      label: 'Dewan Guru & Tenaga Kependidikan',
      description: 'Profil kepala sekolah, dewan guru bersertifikasi, dan staf',
      icon: 'i-lucide-users',
      to: '/data/guru',
      active: route.path === '/data/guru'
    },
    {
      label: 'Data Siswa & Kesiswaan',
      description: 'Statistik rombel, profil peserta didik, dan pembiasaan baik',
      icon: 'i-lucide-graduation-cap',
      to: '/data/siswa',
      active: route.path === '/data/siswa'
    },
    {
      label: 'Transparansi Anggaran BOS',
      description: 'Laporan alokasi, pencairan, dan realisasi dana BOSP sekolah',
      icon: 'i-lucide-receipt',
      to: '/data/bos',
      active: route.path === '/data/bos'
    },
    {
      label: 'Warta & Pengumuman',
      description: 'Kabar dan pengumuman resmi terkini SDN Teja II',
      icon: 'i-lucide-megaphone',
      to: '/publikasi/berita',
      active: route.path.startsWith('/publikasi/berita')
    },
    {
      label: 'Artikel & Opini Edukatif',
      description: 'Karya tulis edukasi dan inovasi pembelajaran guru',
      icon: 'i-lucide-file-text',
      to: '/publikasi/artikel',
      active: route.path.startsWith('/publikasi/artikel')
    },
    {
      label: 'Dokumentasi Kegiatan Siswa',
      description: 'Galeri foto dan liputan kegiatan kurikuler & ekstrakurikuler',
      icon: 'i-lucide-calendar',
      to: '/publikasi/kegiatan',
      active: route.path.startsWith('/publikasi/kegiatan')
    },
    {
      label: 'Panduan Pembelajaran & Modul',
      description: 'Buku panduan guru, kurikulum, dan tuntunan bab IPAS',
      icon: 'i-lucide-book-open',
      to: '/publikasi/panduan',
      active: route.path.startsWith('/publikasi/panduan')
    },
    {
      label: 'Pojok Baca Buku Digital',
      description: 'Perpustakaan digital 300+ buku kurikulum merdeka kelas 1-6',
      icon: 'i-lucide-library',
      to: '/media/buku',
      active: route.path.startsWith('/media/buku')
    },
    {
      label: 'Video Pembelajaran Interaktif',
      description: 'Media edukasi visual video interaktif untuk siswa',
      icon: 'i-lucide-video',
      to: '/media/video',
      active: route.path.startsWith('/media/video')
    }
  ])

  const groups = computed(() => [])

  return {
    links,
    groups,
    searchTerm
  }
}
