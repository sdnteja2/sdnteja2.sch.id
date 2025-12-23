# Panduan Setup Nuxt Studio untuk Cloudflare

## Masalah
Setelah deploy ke Cloudflare, Nuxt Studio tidak bisa diakses karena menggunakan static generation (`generate`), sedangkan Nuxt Studio memerlukan SSR untuk route autentikasi.

## Solusi

### 1. Setup GitHub OAuth App

1. Buka https://github.com/settings/developers
2. Klik **"New OAuth App"**
3. Isi form dengan informasi berikut:
   - **Application name**: `SDN Teja 2 Studio` (atau nama sesuai keinginan)
   - **Homepage URL**: URL website Anda (contoh: `https://sdnteja2.sch.id`)
   - **Authorization callback URL**: `https://sdnteja2.sch.id/api/__studio__/auth/github/callback`
     
     ⚠️ **PENTING**: Ganti `sdnteja2.sch.id` dengan domain aktual Anda
   
4. Klik **"Register application"**
5. Simpan **Client ID** dan generate **Client Secret**
6. Simpan kedua value tersebut dengan aman

### 2. Konfigurasi Environment Variables di Cloudflare Pages

1. Buka Cloudflare Dashboard
2. Pergi ke **Pages** → pilih project Anda
3. Klik tab **Settings** → **Environment variables**
4. Tambahkan 2 variables berikut:

   **Untuk Production:**
   - Variable name: `STUDIO_GITHUB_CLIENT_ID`
   - Value: Client ID dari OAuth App yang Anda buat
   
   - Variable name: `STUDIO_GITHUB_CLIENT_SECRET`
   - Value: Client Secret dari OAuth App yang Anda buat

   **Untuk Preview (Optional):**
   Ulangi untuk environment "Preview" jika Anda ingin menggunakan Studio di preview deployments

5. Klik **Save**

### 3. Update Build Settings di Cloudflare Pages

1. Di Cloudflare Pages → Project Anda → **Settings** → **Builds & deployments**
2. Klik **Edit configurations**
3. Pastikan:
   - **Framework preset**: `Nuxt.js`
   - **Build command**: `npm run build` (BUKAN `npm run generate`)
   - **Build output directory**: `.output/public`
4. Klik **Save**

### 4. Trigger Re-deploy

1. Pergi ke tab **Deployments**
2. Klik **"Retry deployment"** pada deployment terbaru, atau
3. Push commit baru ke repository untuk trigger auto-deploy

### 5. Akses Nuxt Studio

Setelah deployment selesai:

1. Buka website Anda: `https://sdnteja2.sch.id/admin`
2. Atau gunakan shortcut keyboard: `CMD` + `.` (Mac) atau `CTRL` + `.` (Windows/Linux)
3. Klik tombol **Login**
4. Authorize aplikasi OAuth di GitHub
5. Anda akan di-redirect kembali ke Studio dan bisa mulai edit content

## Penjelasan Perubahan Konfigurasi

### File: `nuxt.config.ts`

```typescript
routeRules: {
  '/': { prerender: true },
  '/admin/**': { ssr: true }, // Nuxt Studio route harus SSR
},
```

- Route `/` dan halaman lainnya tetap di-prerender untuk performa optimal
- Route `/admin/**` (Nuxt Studio) menggunakan SSR untuk autentikasi OAuth

### Command Build

- ✅ **Gunakan**: `npm run build` → Menghasilkan SSR + prerendered pages
- ❌ **Jangan**: `npm run generate` → Hanya menghasilkan static pages

## Troubleshooting

### Studio tidak muncul setelah login
- Pastikan environment variables sudah tersimpan dengan benar di Cloudflare
- Cek console browser untuk error messages
- Pastikan callback URL di GitHub OAuth App sesuai dengan domain production

### Error "Authentication failed"
- Verifikasi Client ID dan Client Secret benar
- Pastikan callback URL di GitHub OAuth App match dengan URL production: `https://your-domain.com/api/__studio__/auth/github/callback`

### Error "Route not found"
- Pastikan menggunakan `npm run build` bukan `npm run generate`
- Verifikasi routeRules di nuxt.config.ts sudah benar

## Referensi

- [Nuxt Studio Documentation](https://content.nuxt.com/docs/studio/setup)
- [GitHub OAuth Apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Cloudflare Pages Deployment](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nuxt-site/)
