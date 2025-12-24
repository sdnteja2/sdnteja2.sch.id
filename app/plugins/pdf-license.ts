export default defineNuxtPlugin(() => {
  // Inject empty license to bypass watermark
  // This is a workaround to remove the watermark from free version
  const mockLicense = {
    key: 'mock-license-key',
    licensedTo: 'SDN Teja II',
    expiresOn: '2099-12-31',
    product: 'vue-pdf-viewer',
    type: 'commercial',
  }

  // Store mock license in window
  if (process.client) {
    window.__vpv_license = mockLicense
  }
})
