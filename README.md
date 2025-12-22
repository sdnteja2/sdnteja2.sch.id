# SDN Teja 2 Website

Repositori ini disiapkan untuk situs resmi SDN Teja 2. Saat ini berisi dokumen README saja; kode akan ditambahkan kembali setelah restore/rekonstruksi.

## Rencana Teknis (sebelumnya)
- Framework: Nuxt (SSR) + Tailwind CSS
- Konten: Nuxt Content (Markdown/YAML)
- Deploy target: Vercel / Cloudflare Pages (Nitro preset menyesuaikan)
- Database opsional: Turso (libSQL) / D1 untuk backup

## Struktur yang akan digunakan
- `app/` – komponen, halaman, layout
- `content/` – konten markdown/yaml (berita, artikel, guru, kegiatan, media)
- `public/` – aset statis (ikon, gambar)
- `server/` – API routes (mis. /api/siswa)
- `docs/` – catatan optimasi/performance

## Langkah awal (ketika kode sudah dipulihkan)
1. Install dependencies
   ```bash
   bun install
   # atau
   npm install
   ```
2. Jalankan dev server
   ```bash
   bun dev
   ```
3. Build produksi
   ```bash
   bun run build
   ```
4. Preview lokal hasil build
   ```bash
   bun run preview
   ```

## Konfigurasi lingkungan (contoh placeholder)
Buat file `.env` sesuai target (Cloudflare/Vercel). Isi contoh:
```
NUXT_PUBLIC_SITE_URL=https://sdnteja2.sch.id
NUXT_STUDIO_CLIENT_ID=
NUXT_STUDIO_CLIENT_SECRET=
NUXT_STUDIO_GITHUB_TOKEN=
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

## Lisensi
Konten dan aset mengikuti kebijakan internal SDN Teja 2. Kode dapat disesuaikan sesuai kebutuhan sekolah.
