# Nuxt Content Starter

Look at the [Nuxt Content documentation](https://content.nuxt.com) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Nuxt Studio Setup

Untuk menggunakan Nuxt Studio di production:

### 1. Buat GitHub OAuth App

1. Pergi ke https://github.com/settings/developers
2. Klik "New OAuth App"
3. Isi form:
   - **Application name**: SDN Teja 2 Studio
   - **Homepage URL**: https://your-domain.com (ganti dengan domain Anda)
   - **Authorization callback URL**: https://your-domain.com/api/__studio__/auth/github/callback
4. Simpan **Client ID** dan **Client Secret**

### 2. Setup Environment Variables di Cloudflare

Di Cloudflare Pages, tambahkan environment variables:

```
STUDIO_GITHUB_CLIENT_ID=your_client_id
STUDIO_GITHUB_CLIENT_SECRET=your_client_secret
```

### 3. Deploy dengan `build` command

**PENTING**: Jangan gunakan `generate` command. Nuxt Studio memerlukan SSR.

Di Cloudflare Pages settings:
- **Build command**: `npm run build`
- **Build output directory**: `.output/public`

### 4. Akses Studio

Setelah deploy, buka: `https://your-domain.com/admin`

Atau gunakan shortcut keyboard: `CMD` + `.`
