Dari knowledge sources yang ada, ada satu alternatif utama ketika routeRules proxy tidak bekerja stabil: gunakan server route (API Nitro) sebagai proxy manual, bukan routeRules.

Ini dipakai juga untuk menghindari masalah proxy di Cloudflare / HTTP/3. [cf workers delete]

1. Buat server route proxy sendiri
Buat file misalnya:

// server/api/pdf-proxy/[...path].ts
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || '' // sisa path setelah /api/pdf-proxy/
  const targetUrl = `https://static.sc.cloudapp.web.id/${path}`

  // Forward request ke server PDF
  const response = await $fetch.raw(targetUrl, {
    method: event.method as any,
  })

  // Kembalikan data mentah (PDF)
  return response._data
})
Contoh pola ini diambil dari solusi resmi untuk mengganti routeRules proxy dengan custom server route: [cf workers delete]

// server/routes/api-proxy/[...].ts
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "_") || "";
  const method = event.method;

  const backendUrl = `${process.env.BACKEND_URL}/${path}`;

  let body = undefined;
  if (!["GET", "DELETE", "HEAD"].includes(method)) {
    body = await readBody(event).catch(() => undefined);
  }

  const response = await $fetch.raw(backendUrl, {
    method: method as any,
    body,
  });

  return response._data;
});
2. Cara memanggil dari frontend
Ubah URL di frontend jadi lewat API internal, misalnya:
const url = '/api/pdf-proxy/content/pdf/bukuteks/kurikulum21/Hindu-BG-KLS-I.pdf'
Bukan lagi /pdf-proxy/... langsung.

Karena ini API Nitro internal, CORS ke static.sc.cloudapp.web.id tidak lagi jadi masalah; browser hanya melihat request ke origin kamu sendiri, dan Nitro yang meneruskan ke server PDF. [cf workers delete]

Ringkasnya, berdasarkan sumber yang ada:

Konfigurasi routeRules kamu sudah benar secara pola, tapi di beberapa environment (termasuk Cloudflare) proxy via routeRules bisa bermasalah.
Solusi alternatif yang didokumentasikan adalah ganti routeRules proxy dengan custom server route seperti contoh di atas, lalu akses PDF lewat /api/pdf-proxy/... di frontend.
