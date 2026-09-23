export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()
  const limit = Math.min(Number(query.limit) || 20, 50)

  if (!q || q.length < 2) {
    return []
  }

  const needle = q.toLowerCase()
  const results: Array<{
    id: string
    title: string
    titles: string[]
    content: string
    icon: string
    score: number
    level: number
  }> = []

  // Helper scoring
  function scoreMatch(title: string, desc: string = '') {
    const t = title.toLowerCase()
    const d = desc.toLowerCase()
    let score = 0
    if (t === needle) score += 100
    else if (t.startsWith(needle)) score += 50
    else if (t.includes(needle)) score += 30
    if (d.includes(needle)) score += 10
    return score
  }

  try {
    // 1. Panduan Pembelajaran & Bab
    const panduanList = await queryCollection(event, 'panduan').all()
    for (const item of panduanList) {
      const matchScore = scoreMatch(item.title, `${item.description} ${item.guideTitle}`)
      if (matchScore > 0) {
        results.push({
          id: item.path,
          title: item.title,
          titles: ['Panduan', item.guideTitle],
          content: item.description || '',
          icon: item.icon || 'i-lucide-book-open',
          score: matchScore,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search panduan query failed:', err)
  }

  try {
    // 2. Artikel & Opini
    const artikelList = await queryCollection(event, 'artikel').all()
    for (const item of artikelList) {
      const matchScore = scoreMatch(item.title, item.description)
      if (matchScore > 0) {
        results.push({
          id: item.path,
          title: item.title,
          titles: ['Publikasi', 'Artikel'],
          content: item.description || '',
          icon: 'i-lucide-file-text',
          score: matchScore,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search artikel query failed:', err)
  }

  try {
    // 3. Warta & Berita
    const beritaList = await queryCollection(event, 'berita').all()
    for (const item of beritaList) {
      const matchScore = scoreMatch(item.title, item.description)
      if (matchScore > 0) {
        results.push({
          id: item.path,
          title: item.title,
          titles: ['Publikasi', 'Berita'],
          content: item.description || '',
          icon: 'i-lucide-megaphone',
          score: matchScore,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search berita query failed:', err)
  }

  try {
    // 4. Dokumentasi Kegiatan
    const kegiatanList = await queryCollection(event, 'kegiatan').all()
    for (const item of kegiatanList) {
      const matchScore = scoreMatch(item.title, `${item.description} ${item.tag}`)
      if (matchScore > 0) {
        results.push({
          id: item.path,
          title: item.title,
          titles: ['Publikasi', 'Kegiatan'],
          content: item.description || '',
          icon: 'i-lucide-calendar',
          score: matchScore,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search kegiatan query failed:', err)
  }

  try {
    // 5. Buku Digital
    const bukuList = await queryCollection(event, 'buku').all()
    for (const item of bukuList) {
      const matchScore = scoreMatch(item.title, `${item.pelajaran} Kelas ${item.kelas} ${item.tipe}`)
      if (matchScore > 0) {
        results.push({
          id: item.path,
          title: item.title,
          titles: ['Buku Digital', `Kelas ${item.kelas}`],
          content: `Mata Pelajaran ${item.pelajaran} • ${item.tipe || 'Buku Siswa'}`,
          icon: 'i-lucide-book-copy',
          score: matchScore,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search buku query failed:', err)
  }

  try {
    // 6. Guru & Tenaga Kependidikan
    const guruList = await queryCollection(event, 'guru').all()
    for (const item of guruList) {
      const matchScore = scoreMatch(item.name, `${item.role} ${item.tugas} ${item.category}`)
      if (matchScore > 0) {
        results.push({
          id: '/data/guru',
          title: item.name,
          titles: ['Dewan Guru & GTK', item.role],
          content: `Tugas: ${item.tugas} (${item.pendidikan})`,
          icon: 'i-lucide-graduation-cap',
          score: matchScore + 5,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search guru query failed:', err)
  }

  try {
    // 7. Video Pembelajaran
    const videoList = await queryCollection(event, 'video').all()
    for (const item of videoList) {
      const matchScore = scoreMatch(item.title, `${item.pelajaran} Kelas ${item.kelas}`)
      if (matchScore > 0) {
        results.push({
          id: '/media/video',
          title: item.title,
          titles: ['Video Edukasi', `Kelas ${item.kelas}`],
          content: `Mata Pelajaran: ${item.pelajaran}`,
          icon: 'i-lucide-video',
          score: matchScore,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search video query failed:', err)
  }

  try {
    // 8. Anggaran Dana BOS
    const bosDoc = await queryCollection(event, 'bos').first()
    if (bosDoc) {
      const matchScore = scoreMatch('Anggaran BOS', `${bosDoc.title} ${bosDoc.description} BOSP ARKAS`)
      if (matchScore > 0 || needle.includes('bos') || needle.includes('anggaran') || needle.includes('dana')) {
        results.push({
          id: '/data/bos',
          title: bosDoc.title || 'Transparansi Anggaran BOS',
          titles: ['Informasi Publik', 'Dana BOSP'],
          content: bosDoc.description || 'Laporan transparansi alokasi dan realisasi anggaran BOS SDN Teja II.',
          icon: 'i-lucide-receipt',
          score: matchScore > 0 ? matchScore : 25,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search bos query failed:', err)
  }

  try {
    // 9. Profil Sekolah
    const sekolahDoc = await queryCollection(event, 'sekolah').first()
    if (sekolahDoc) {
      const matchScore = scoreMatch('Profil Sekolah', `${sekolahDoc.title} ${sekolahDoc.description} akreditasi sarana`)
      if (matchScore > 0 || needle.includes('sekolah') || needle.includes('profil') || needle.includes('npsn')) {
        results.push({
          id: '/data/sekolah',
          title: sekolahDoc.title || 'Profil & Data Sekolah',
          titles: ['Profil Kelembagaan', 'Identitas'],
          content: sekolahDoc.description || 'Identitas resmi, legalitas, akreditasi, dan sarana prasarana sekolah.',
          icon: 'i-lucide-school',
          score: matchScore > 0 ? matchScore : 20,
          level: 1
        })
      }
    }
  } catch (err) {
    console.warn('Search sekolah query failed:', err)
  }

  // Urutkan berdasarkan skor tertinggi
  results.sort((a, b) => b.score - a.score)

  // Potong sesuai limit
  return results.slice(0, limit)
})
