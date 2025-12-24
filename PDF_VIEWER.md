# PDF Viewer Implementation - Using Google Docs Iframe

This document explains the PDF viewer implementation for this project.

## Overview

PDFs are displayed using Google Docs Viewer embedded in an iframe. This approach:
- ✅ No watermarks or license issues
- ✅ No external dependencies to patch
- ✅ Clean and simple implementation
- ✅ Cross-browser compatible

## Implementation

### PdfViewer Component

Location: `/app/components/PdfViewer.client.vue`

The component wraps Google Docs Viewer in an iframe for displaying PDFs without any watermarks or licensing issues.

```vue
<script lang="ts" setup>
defineProps<{
  src: string
  width?: string
  height?: string
}>()
</script>

<template>
  <div :style="{ width: width || '100%', height: height || '700px', margin: '0 auto' }">
    <iframe
      :src="`https://docs.google.com/gview?url=${encodeURIComponent(src)}&embedded=true`"
      :style="{ width: '100%', height: '100%', border: 'none' }"
      allowfullscreen
    />
  </div>
</template>
```

### How It Works

1. **Google Docs Viewer**: Uses Google's free document viewing service
2. **URL Encoding**: PDF URL is properly encoded for the viewer
3. **Responsive**: Adapts to container width/height
4. **No Setup**: Works out of the box, no build configuration needed

### Usage

```vue
<PdfViewer 
  src="https://example.com/file.pdf"
  height="800px"
/>
```

### Props

- `src` (string, required) - URL to the PDF file
- `width` (string, optional) - Container width (default: 100%)
- `height` (string, optional) - Container height (default: 700px)

## Advantages

- ✅ No dependencies to maintain
- ✅ No watermarks
- ✅ No patches needed
- ✅ Simple and reliable
- ✅ Works with external PDF URLs
- ✅ Built-in document controls (print, download, search)
- ✅ No license issues

## Limitations

- Requires internet connection to load Google Docs Viewer
- May not work if Google Docs service is unavailable
- Some organizations may block external embedding

## Migration from Vue PDF Viewer

The project previously used `@vue-pdf-viewer/viewer` which required complex patching to remove watermarks. This has been replaced with the iframe solution which:

1. Eliminates dependency on a problematic library
2. Removes need for patches and workarounds
3. Provides cleaner, more maintainable code
4. Zero licensing/watermark concerns

### Cleanup Done

- ✅ Removed `@vue-pdf-viewer/viewer` package
- ✅ Removed `patch-package` dependency
- ✅ Deleted `patches/` directory
- ✅ Deleted watermark removal scripts
- ✅ Updated nuxt.config.ts (removed transpile config)
- ✅ Simplified PdfViewer component
