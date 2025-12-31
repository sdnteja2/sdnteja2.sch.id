// server/plugins/llms-extend.ts

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('llms:generate', async (event, options) => {
    try {
      // Ambil data guru dengan detail field
      const guruData = await queryCollection(event, 'guru').all()

      if (guruData && guruData.length > 0) {
        // Update section guru dengan detail field
        const guruSection = options.sections.find(section =>
          section.title === 'Profil Guru dan Tenaga Pendidik',
        )

        if (guruSection) {
          // Tambahkan detail guru ke description
          let detailGuru = '\n\nDETAIL GURU SDN TEJA II:\n\n'

          guruData.forEach((guru: any) => {
            detailGuru += `**${guru.nama || ''} (${guru.lengkap || guru.nama || ''})**\n`
            detailGuru += `- Jabatan: ${guru.jabatan || '-'}\n`
            detailGuru += `- Kelas: ${guru.kelas || '-'}\n`
            detailGuru += `- Pendidikan: ${guru.pendidikan || '-'}\n`
            detailGuru += `- Catatan: ${guru.catatan || '-'}\n`

            if (guru.pelatihan && guru.pelatihan.length > 0) {
              detailGuru += `- Pelatihan: ${guru.pelatihan.map((p: any) => `${p.title} (${p.tahun})`).join(', ')}\n`
            }
            else {
              detailGuru += `- Pelatihan: Tidak ada\n`
            }
            detailGuru += '\n'
          })

          // Update description dengan detail
          guruSection.description += detailGuru
        }
      }

      // Ambil data berita
      const beritaData = await queryCollection(event, 'berita').all()
      if (beritaData && beritaData.length > 0) {
        const beritaSection = options.sections.find(section =>
          section.title === 'Berita dan Pengumuman Sekolah',
        )

        if (beritaSection) {
          let detailBerita = '\n\nDETAIL BERITA:\n\n'

          beritaData.forEach((berita: any) => {
            detailBerita += `**${berita.title || ''}**\n`
            detailBerita += `- Deskripsi: ${berita.description || '-'}\n`
            detailBerita += `- Tanggal: ${berita.date ? new Date(berita.date).toLocaleDateString('id-ID') : '-'}\n`
            detailBerita += `- Author: ${berita.author || '-'}\n`
            detailBerita += '\n'
          })

          beritaSection.description += detailBerita
        }
      }

      // Ambil data artikel
      const artikelData = await queryCollection(event, 'artikel').all()
      if (artikelData && artikelData.length > 0) {
        const artikelSection = options.sections.find(section =>
          section.title === 'Artikel Pendidikan dan Informasi Umum',
        )

        if (artikelSection) {
          let detailArtikel = '\n\nDETAIL ARTIKEL:\n\n'

          artikelData.forEach((artikel: any) => {
            detailArtikel += `**${artikel.title || ''}**\n`
            detailArtikel += `- Deskripsi: ${artikel.description || '-'}\n`
            detailArtikel += `- Author: ${artikel.author || '-'}\n`
            detailArtikel += `- Tanggal: ${artikel.date ? new Date(artikel.date).toLocaleDateString('id-ID') : '-'}\n`
            detailArtikel += '\n'
          })

          artikelSection.description += detailArtikel
        }
      }

      // Ambil data kegiatan
      const kegiatanData = await queryCollection(event, 'kegiatan').all()
      if (kegiatanData && kegiatanData.length > 0) {
        const kegiatanSection = options.sections.find(section =>
          section.title === 'Kegiatan dan Program Sekolah',
        )

        if (kegiatanSection) {
          let detailKegiatan = '\n\nDETAIL KEGIATAN:\n\n'

          kegiatanData.forEach((kegiatan: any) => {
            detailKegiatan += `**${kegiatan.title || ''}**\n`
            detailKegiatan += `- Deskripsi: ${kegiatan.description || '-'}\n`
            detailKegiatan += `- Tanggal: ${kegiatan.date ? new Date(kegiatan.date).toLocaleDateString('id-ID') : '-'}\n`
            detailKegiatan += `- Tag: ${kegiatan.tag || '-'}\n\n`
          })

          kegiatanSection.description += detailKegiatan
        }
      }
    }
    catch (error) {
      console.error('Error extending LLMS data:', error)
    }
  })
})
