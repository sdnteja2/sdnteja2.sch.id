# SDN Teja II Website

Website resmi SDN Teja II yang dibangun dengan Nuxt 4, menampilkan informasi sekolah dengan fitur modern dan real-time.

## ✨ Fitur

- 🎨 **Modern UI** dengan Nuxt UI v4 dan Tailwind CSS
- 📝 **Content Management** dengan Nuxt Content + Nuxt Studio
- 🗄️ **Cloudflare D1 Database** untuk content storage
- 🌐 **Real-time Visitor Counter** dengan WebSocket
- 🖼️ **Image Optimization** dengan Nuxt Image + IPX
- 🎭 **Smooth Animations** dengan Motion-v
- 🔍 **Full-text Search** dengan fuzzy search
- 🌙 **Dark Mode** support
- ⚡ **Fast & SEO-friendly** dengan SSR dan prerendering
- 📱 **Fully Responsive** design

## 🛠️ Tech Stack

### Core
- [Nuxt 4](https://nuxt.com) - Vue.js Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

### Modules
- [@nuxt/ui v4](https://ui.nuxt.com) - UI Components
- [@nuxt/content](https://content.nuxt.com) - Content Management
- [@nuxthub/core](https://hub.nuxt.com) - Cloudflare Integration
- [@nuxt/image](https://image.nuxt.com) - Image Optimization
- [@vueuse/nuxt](https://vueuse.org) - Composition Utilities
- [nuxt-studio](https://nuxt.studio) - Visual Editor
- [motion-v](https://motion.unovue.com) - Animations

### Infrastructure
- **Hosting**: Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite)
- **WebSocket**: Cloudflare Workers
- **CDN**: Cloudflare

## 🚀 Setup

Install dependencies:

```bash
bun install
```

## 💻 Development Server

Start the development server on `http://localhost:3000`:

```bash
bun dev
```

## 🏗️ Production

Build the application for production:

```bash
bun build
```

Locally preview production build:

```bash
bun preview
```

## 📦 Deployment

Deploy to Cloudflare with:

```bash
npx nuxthub deploy
```

Learn more at [NuxtHub Documentation](https://hub.nuxt.com)

## 🎨 Nuxt Studio Setup

### 1. Buat GitHub OAuth App

1. Pergi ke https://github.com/settings/developers
2. Klik "New OAuth App"
3. Isi form:
   - **Application name**: SDN Teja II Studio
   - **Homepage URL**: https://sdnteja2.sch.id
   - **Authorization callback URL**: https://sdnteja2.sch.id/api/__studio__/auth/github/callback
4. Simpan **Client ID** dan **Client Secret**

### 2. Setup Environment Variables di Cloudflare

Di Cloudflare Pages, tambahkan environment variables:

```env
STUDIO_GITHUB_CLIENT_ID=your_client_id
STUDIO_GITHUB_CLIENT_SECRET=your_client_secret
```

### 3. Access Studio

Setelah deploy, akses editor di: `https://sdnteja2.sch.id/admin`

## ⚙️ Configuration

### Image Optimization
Configured domains:
- Cloudinary (res.cloudinary.com)
- YouTube thumbnails
- Vimeo thumbnails

### WebSocket
Real-time visitor counter menggunakan Nitro WebSocket dengan Cloudflare Workers.

### Database
Content disimpan di Cloudflare D1 database untuk performa optimal.

## 📄 License

Private - SDN Teja II © 2025

Di Cloudflare Pages settings:
- **Build command**: `npm run build`
- **Build output directory**: `.output/public`

### 4. Akses Studio

Setelah deploy, buka: `https://your-domain.com/admin`

Atau gunakan shortcut keyboard: `CMD` + `.`
