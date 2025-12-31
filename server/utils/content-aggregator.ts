// server/utils/content-aggregator.ts
import { queryCollection } from '@nuxt/content/server'

/**
 * Format guru data into readable text
 */
function formatGuru(guru: any[]): string {
  if (!guru || guru.length === 0)
    return 'Tidak ada data guru tersedia.'

  const lines = guru.map((g) => {
    const parts = [
      `**${g.nama}**${g.lengkap ? ` (${g.lengkap})` : ''}`,
      g.jabatan ? `- Jabatan: ${g.jabatan}` : null,
      g.kelas ? `- Kelas: ${g.kelas}` : null,
      g.pendidikan ? `- Pendidikan: ${g.pendidikan}` : null,
      g.catatan ? `- Catatan: ${g.catatan}` : null,
    ]
    return parts.filter(Boolean).join('\n')
  })

  return `## Data Guru SDN Teja II\n\n${lines.join('\n\n')}`
}

/**
 * Format berita data into readable text
 */
function formatBerita(berita: any[]): string {
  if (!berita || berita.length === 0)
    return 'Tidak ada berita tersedia.'

  const lines = berita.map((b) => {
    const parts = [
      `**${b.title}**`,
      b.description ? `${b.description}` : null,
      b.date ? `Tanggal: ${new Date(b.date).toLocaleDateString('id-ID')}` : null,
      b.tags && b.tags.length > 0 ? `Tags: ${b.tags.join(', ')}` : null,
      b.path ? `Link: https://sdnteja2.sch.id${b.path}` : null,
    ]
    return parts.filter(Boolean).join('\n')
  })

  return `## Berita Terbaru\n\n${lines.join('\n\n')}`
}

/**
 * Format artikel data into readable text
 */
function formatArtikel(artikel: any[]): string {
  if (!artikel || artikel.length === 0)
    return 'Tidak ada artikel tersedia.'

  const lines = artikel.map((a) => {
    const parts = [
      `**${a.title}**`,
      a.description ? `${a.description}` : null,
      a.author ? `Penulis: ${a.author}` : null,
      a.date ? `Tanggal: ${new Date(a.date).toLocaleDateString('id-ID')}` : null,
      a.tags && a.tags.length > 0 ? `Tags: ${a.tags.join(', ')}` : null,
      a.path ? `Link: https://sdnteja2.sch.id${a.path}` : null,
    ]
    return parts.filter(Boolean).join('\n')
  })

  return `## Artikel Pendidikan\n\n${lines.join('\n\n')}`
}

/**
 * Format kegiatan data into readable text
 */
function formatKegiatan(kegiatan: any[]): string {
  if (!kegiatan || kegiatan.length === 0)
    return 'Tidak ada data kegiatan tersedia.'

  const lines = kegiatan.map((k) => {
    const parts = [
      `**${k.title}**`,
      k.description ? `${k.description}` : null,
      k.date ? `Tanggal: ${new Date(k.date).toLocaleDateString('id-ID')}` : null,
      k.tag ? `Tag: ${k.tag}` : null,
      k.path ? `Link: https://sdnteja2.sch.id${k.path}` : null,
    ]
    return parts.filter(Boolean).join('\n')
  })

  return `## Kegiatan Sekolah\n\n${lines.join('\n\n')}`
}

/**
 * Format media data into readable text
 */
function formatMedia(media: any[]): string {
  if (!media || media.length === 0)
    return 'Tidak ada data media pembelajaran tersedia.'

  const lines = media.map((m) => {
    const parts = [
      `**${m.title}**`,
      m.kelas ? `- Kelas: ${m.kelas}` : null,
      m.pelajaran ? `- Pelajaran: ${m.pelajaran}` : null,
      m.idVideo ? `- Video YouTube: https://youtube.com/watch?v=${m.idVideo}` : null,
      m.link ? `- Link: ${m.link}` : null,
    ]
    return parts.filter(Boolean).join('\n')
  })

  return `## Media Pembelajaran\n\n${lines.join('\n\n')}`
}

/**
 * Format buku data into readable text
 */
function formatBuku(buku: any[]): string {
  if (!buku || buku.length === 0)
    return 'Tidak ada data buku tersedia.'

  const lines = buku.map((b) => {
    const parts = [
      `**${b.title}**`,
      b.kelas ? `- Kelas: ${b.kelas}` : null,
      b.pelajaran ? `- Pelajaran: ${b.pelajaran}` : null,
      b.tipe ? `- Tipe: ${b.tipe}` : null,
      b.link ? `- Link Download: ${b.link}` : null,
    ]
    return parts.filter(Boolean).join('\n')
  })

  return `## Buku Pembelajaran\n\n${lines.join('\n\n')}`
}

/**
 * Format sekolah info into readable text
 */
function formatSekolah(sekolah: any): string {
  if (!sekolah || !sekolah.data)
    return 'Tidak ada informasi sekolah tersedia.'

  const { npsn, nss, kepalaSekolah, deskripsi } = sekolah.data

  return `## Informasi SDN Teja II

**NPSN**: ${npsn}
**NSS**: ${nss}
**Kepala Sekolah**: ${kepalaSekolah}
**Alamat**: Kecamatan Rajagaluh, Kabupaten Majalengka, Jawa Barat
**Website**: https://sdnteja2.sch.id

**Deskripsi**:
${deskripsi}`
}

/**
 * Aggregate all content data for RAG system prompt
 */
export async function aggregateContentData(event: any): Promise<string> {
  try {
    // Fetch all data with limits to avoid context overflow
    const [guruData, beritaData, artikelData, kegiatanData, mediaData, bukuData, sekolahData] = await Promise.all([
      queryCollection(event, 'guru').all(),
      queryCollection(event, 'berita').all().then((items: any[]) =>
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10),
      ),
      queryCollection(event, 'artikel').all().then((items: any[]) =>
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10),
      ),
      queryCollection(event, 'kegiatan').all().then((items: any[]) =>
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10),
      ),
      queryCollection(event, 'media').all().then((items: any[]) => items.slice(0, 20)),
      queryCollection(event, 'buku').all().then((items: any[]) => items.slice(0, 20)),
      (async () => {
        try {
          const homePage = await queryCollection(event, 'content').path('/index').first()
          return {
            success: true,
            data: {
              npsn: '20246133',
              nss: '12133141241244',
              kepalaSekolah: 'Susi Susanti, S.Pd.I., M.Pd.',
              deskripsi: 'SDN Teja II adalah institusi pendidikan dasar yang berkomitmen untuk memberikan layanan terbaik bagi perkembangan akademik dan karakter siswa kami.',
            },
          }
        }
        catch {
          return { success: false }
        }
      })(),
    ])

    // Format all data sections
    const sections = [
      formatSekolah(sekolahData),
      formatGuru(guruData),
      formatBerita(beritaData),
      formatArtikel(artikelData),
      formatKegiatan(kegiatanData),
      formatMedia(mediaData),
      formatBuku(bukuData),
    ]

    const aggregatedData = sections.join('\n\n---\n\n')

    console.log('[Content Aggregator] Data aggregated successfully')
    console.log('[Content Aggregator] Total length:', aggregatedData.length, 'characters')

    return aggregatedData
  }
  catch (error) {
    console.error('[Content Aggregator] Error:', error)
    return 'Terjadi kesalahan saat mengambil data sekolah. Silakan coba lagi nanti.'
  }
}
