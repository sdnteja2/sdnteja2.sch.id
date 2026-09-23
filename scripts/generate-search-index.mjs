import fs from 'node:fs'
import path from 'node:path'

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const yaml = match[1]
  const result = {}
  for (const line of yaml.split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (kv) {
      let val = kv[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      result[kv[1]] = val
    }
  }
  return result
}

function parseSimpleYaml(content) {
  const result = {}
  for (const line of content.split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (kv) {
      let val = kv[2].trim()
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1)
      }
      result[kv[1]] = val
    }
  }
  return result
}

export function buildSearchIndex() {
  const items = []

  // 1. Artikel
  if (fs.existsSync('content/artikel')) {
    for (const f of fs.readdirSync('content/artikel')) {
      if (!f.endsWith('.md')) continue
      const raw = fs.readFileSync(path.join('content/artikel', f), 'utf-8')
      const fm = parseYamlFrontmatter(raw)
      const slug = f.replace(/^\d+\./, '').replace(/\.md$/, '')
      if (fm.title) {
        items.push({
          id: '/publikasi/artikel/' + slug,
          title: fm.title,
          titles: ['Publikasi', 'Artikel'],
          content: fm.description || '',
          icon: 'i-lucide-file-text',
          level: 1
        })
      }
    }
  }

  // 2. Berita
  if (fs.existsSync('content/berita')) {
    for (const f of fs.readdirSync('content/berita')) {
      if (!f.endsWith('.md')) continue
      const raw = fs.readFileSync(path.join('content/berita', f), 'utf-8')
      const fm = parseYamlFrontmatter(raw)
      const slug = f.replace(/^\d+\./, '').replace(/\.md$/, '')
      if (fm.title) {
        items.push({
          id: '/publikasi/berita/' + slug,
          title: fm.title,
          titles: ['Publikasi', 'Berita'],
          content: fm.description || '',
          icon: 'i-lucide-megaphone',
          level: 1
        })
      }
    }
  }

  // 3. Kegiatan
  if (fs.existsSync('content/kegiatan')) {
    for (const f of fs.readdirSync('content/kegiatan')) {
      const raw = fs.readFileSync(path.join('content/kegiatan', f), 'utf-8')
      const fm = f.endsWith('.md') ? parseYamlFrontmatter(raw) : parseSimpleYaml(raw)
      const slug = f.replace(/^\d+\./, '').replace(/\.(md|yml|yaml)$/, '')
      if (fm.title) {
        items.push({
          id: '/publikasi/kegiatan/' + slug,
          title: fm.title,
          titles: ['Publikasi', 'Kegiatan'],
          content: fm.description || '',
          icon: 'i-lucide-calendar',
          level: 1
        })
      }
    }
  }

  // 4. Panduan
  const scanPanduan = (dir, prefix = '/publikasi/panduan') => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        scanPanduan(fullPath, `${prefix}/${entry.name}`)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const raw = fs.readFileSync(fullPath, 'utf-8')
        const fm = parseYamlFrontmatter(raw)
        const slug = entry.name.replace(/^\d+\./, '').replace(/\.md$/, '')
        if (fm.title) {
          items.push({
            id: `${prefix}/${slug}`,
            title: fm.title,
            titles: ['Panduan', fm.guideTitle || 'IPAS'],
            content: fm.description || '',
            icon: 'i-lucide-book-open',
            level: 1
          })
        }
      }
    }
  }
  scanPanduan('content/panduan')

  // 5. Buku Digital
  if (fs.existsSync('content/buku')) {
    for (const f of fs.readdirSync('content/buku')) {
      const raw = fs.readFileSync(path.join('content/buku', f), 'utf-8')
      const fm = f.endsWith('.md') ? parseYamlFrontmatter(raw) : parseSimpleYaml(raw)
      const slug = f.replace(/^\d+\./, '').replace(/\.(md|yml|yaml)$/, '')
      if (fm.title) {
        items.push({
          id: '/media/buku/' + slug,
          title: fm.title,
          titles: ['Buku Digital', 'Kelas ' + (fm.kelas || '1')],
          content: 'Mata Pelajaran ' + (fm.pelajaran || '') + ' • ' + (fm.tipe || 'Buku Siswa'),
          icon: 'i-lucide-book-copy',
          level: 1
        })
      }
    }
  }

  // 6. Guru & GTK
  if (fs.existsSync('content/guru')) {
    for (const f of fs.readdirSync('content/guru')) {
      const raw = fs.readFileSync(path.join('content/guru', f), 'utf-8')
      const fm = parseSimpleYaml(raw)
      if (fm.name) {
        items.push({
          id: '/data/guru',
          title: fm.name,
          titles: ['Dewan Guru & GTK', fm.role || 'Pendidik'],
          content: 'Tugas: ' + (fm.tugas || '') + ' (' + (fm.pendidikan || '') + ')',
          icon: 'i-lucide-graduation-cap',
          level: 1
        })
      }
    }
  }

  // 7. Video Pembelajaran
  if (fs.existsSync('content/video')) {
    for (const f of fs.readdirSync('content/video')) {
      const raw = fs.readFileSync(path.join('content/video', f), 'utf-8')
      const fm = f.endsWith('.md') ? parseYamlFrontmatter(raw) : parseSimpleYaml(raw)
      if (fm.title) {
        items.push({
          id: '/media/video',
          title: fm.title,
          titles: ['Video Edukasi', 'Kelas ' + (fm.kelas || '1')],
          content: 'Mata Pelajaran: ' + (fm.pelajaran || ''),
          icon: 'i-lucide-video',
          level: 1
        })
      }
    }
  }

  // 8. Anggaran BOS
  if (fs.existsSync('content/3.bos.yml')) {
    const raw = fs.readFileSync('content/3.bos.yml', 'utf-8')
    const fm = parseSimpleYaml(raw)
    items.push({
      id: '/data/bos',
      title: fm.title || 'Transparansi Anggaran BOS',
      titles: ['Informasi Publik', 'Dana BOSP'],
      content: fm.description || 'Laporan alokasi dan realisasi anggaran BOS SDN Teja II.',
      icon: 'i-lucide-receipt',
      level: 1
    })
  }

  // 9. Profil Sekolah
  if (fs.existsSync('content/1.sekolah.yml')) {
    const raw = fs.readFileSync('content/1.sekolah.yml', 'utf-8')
    const fm = parseSimpleYaml(raw)
    items.push({
      id: '/data/sekolah',
      title: fm.title || 'Profil & Data Sekolah',
      titles: ['Profil Kelembagaan', 'Identitas'],
      content: fm.description || 'Identitas resmi, legalitas, akreditasi, dan sarana prasarana sekolah.',
      icon: 'i-lucide-school',
      level: 1
    })
  }

  // 10. Data Siswa, Habits & Extracurriculars
  if (fs.existsSync('content/2.siswa.yml')) {
    const raw = fs.readFileSync('content/2.siswa.yml', 'utf-8')
    const fm = parseSimpleYaml(raw)
    items.push({
      id: '/data/siswa',
      title: fm.title || 'Data Siswa & Kesiswaan',
      titles: ['Data Kesiswaan', 'Statistik'],
      content: fm.description || 'Statistik rombel, profil peserta didik, dan pembiasaan baik.',
      icon: 'i-lucide-users',
      level: 1
    })

    // Ekstrakurikuler (e.g. Pramuka, Seni Tari, Olahraga)
    const extraMatches = raw.matchAll(/- name:\s*(.*)\r?\n\s*schedule:\s*(.*)\r?\n\s*desc:\s*(.*)/g)
    for (const match of extraMatches) {
      const name = match[1].replace(/['"]/g, '').trim()
      const desc = match[3].replace(/['"]/g, '').trim()
      items.push({
        id: '/data/siswa#ekstrakurikuler',
        title: `Ekstrakurikuler ${name}`,
        titles: ['Data Siswa', 'Ekstrakurikuler'],
        content: desc,
        icon: 'i-lucide-compass',
        level: 1
      })
    }
  }

  // 11. Fasilitas Sekolah
  if (fs.existsSync('content/facilities.yml')) {
    const raw = fs.readFileSync('content/facilities.yml', 'utf-8')
    const facMatches = raw.matchAll(/- name:\s*['"]?(.*?)['"]?\r?\n\s*category:\s*['"]?(.*?)['"]?\r?\n\s*description:\s*['"]?(.*?)['"]?\r?\n/g)
    for (const match of facMatches) {
      items.push({
        id: '/data/sekolah#fasilitas',
        title: `Fasilitas: ${match[1].trim()}`,
        titles: ['Profil Sekolah', 'Fasilitas'],
        content: match[3].trim(),
        icon: 'i-lucide-building',
        level: 1
      })
    }
  }

  return items
}

const items = buildSearchIndex()
const outDir = path.resolve('public')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}
const outPath = path.join(outDir, 'search-index.json')
fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf-8')
console.log(`Generated ${items.length} searchable items into ${outPath}`)
