# pdf-inspector: local OCR runtime setup (Windows)

`scripts/setup_windows.ps1` automates everything in this file. Read this
when it fails, when the user wants to understand what's actually being
downloaded, or when re-verifying after a version bump.

## Why this exists

pdf-inspector's Python/Node wheels ship **without** OCR models, PDFium, or
ONNX Runtime - "clean `auto` requests never load or download them" (i.e. a
normal text-based PDF never touches any of this). OCR only activates when
at least one page is actually routed to it, and at that point it needs two
native shared libraries plus a downloaded model set.

## Pinned versions (the "reproducible path" per upstream docs)

- **PDFium**: [firecrawl/pdfium-rs release `native-v7988`](https://github.com/firecrawl/pdfium-rs/releases/tag/native-v7988) - PDFium `153.0.7988.0`, asset `firecrawl-pdfium-win-x64.tgz`
- **ONNX Runtime**: [microsoft/onnxruntime `v1.27.0`](https://github.com/microsoft/onnxruntime/releases/tag/v1.27.0), asset `onnxruntime-win-x64-1.27.0.zip`
- **OCR model**: PP-OCRv6 Small, artifact revision `oar-ocr-v0.7.0`, from [`GreatV/oar-ocr`](https://github.com/GreatV/oar-ocr/releases/tag/v0.7.0) (Apache-2.0), downloaded automatically by pdf-inspector itself - not by the setup script

These three are versioned together upstream; don't bump ONNX Runtime or
PDFium independently without checking
[`docs/ocr-runtime.md`](https://github.com/firecrawl/pdf-inspector/blob/main/docs/ocr-runtime.md)
in the pdf-inspector repo for the current pinned combination.

## What the setup script actually does

1. Downloads `firecrawl-pdfium-win-x64.tgz` and extracts it (`tar -xzf`,
   built into Windows 10 1803+) into `%LOCALAPPDATA%\pdf-inspector\runtime\`.
2. Downloads `onnxruntime-win-x64-1.27.0.zip` and extracts it
   (`Expand-Archive`) into the same directory.
3. Finds `pdfium.dll` and `onnxruntime.dll` recursively under that
   directory (archive internal layout has changed before between releases,
   so this doesn't hardcode a nested folder name).
4. Sets `PDFIUM_LIB_PATH` and `ORT_DYLIB_PATH` as **user** environment
   variables (registry-level, no admin needed) pointing at the two DLLs.

This was tested end to end while building this skill: after this setup, a
synthetic scanned PDF (no text layer at all) was correctly OCR'd, including
correct heading recovery, entirely offline apart from the one-time model
download.

## Model cache and offline mode

The first page that's actually routed to OCR downloads and SHA-256-verifies
three small artifacts (detection model, recognition model, character
dictionary; ~31MB total) into a platform cache directory. Set
`PDF_INSPECTOR_MODEL_CACHE` to relocate that cache. For an environment that
must never touch the network, even once:

- Python: `process_pdf_with_ocr(path, offline=True, model_directory="C:\\path\\to\\models")`
- CLI (Rust): `pdf2md scan.pdf --ocr auto --ocr-offline --ocr-model-dir C:\path\to\models`

Populate that directory ahead of time on a machine that does have network
access, then copy it over.

## Performance reality check

- **Detection** (`detect_pdf`/`classify_pdf`): ~10-50ms, no OCR runtime
  touched regardless of PDF type.
- **Text extraction on a clean text-based PDF**: well under 200ms in
  upstream's own numbers; measured at ~1-30ms per document in this skill's
  own small-sample testing (single documents, not the full 200-doc
  benchmark corpus - see `comparison.md` for the caveats on both numbers).
- **OCR of a scanned page**: several seconds per page on CPU (measured
  ~2.7-5.3s per page, warm, on the machine this skill was built on) - not
  "instant", but fully local. The first-ever OCR call also pays the
  one-time ~31MB model download, which can add tens of seconds.

## Windows-specific caveat from upstream

`docs/ocr-runtime.md` states plainly: "The full OCR path is exercised end
to end on Linux x64 in CI. macOS and Windows compile and run the feature's
platform-independent tests, while their external-runtime paths should be
treated as preview until equivalent smoke jobs are added." It worked
correctly in this skill's own hands-on test, but this is upstream's own
characterization of Windows OCR maturity, not this skill's guess - mention
it to the user if OCR quality on a specific document looks off, rather than
assuming the runtime itself is broken.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `failed to load PDFium; install a compatible PDFium shared library or set PDFIUM_LIB_PATH` | Runtime not installed, or new terminal not opened since setup | Rerun `setup_windows.ps1` (no `-SkipOcr`), open a **new terminal** |
| Same error but for ONNX Runtime | Same as above, or `ORT_DYLIB_PATH` stale after moving the runtime dir | Rerun setup; it re-detects and rewrites both env vars |
| OCR download fails / times out | Network/proxy, or the release asset name changed upstream | Check the pinned URLs above still resolve; ask the user about a proxy |
| Correct classification but garbled OCR text | Known Windows-preview caveat (see above), or DPI too low for small text | Rerun with a specific `dpi` (Python: `process_pdf_with_ocr(path, dpi=300.0)`) |
| `pages_recommending_hosted` non-empty | Local OCR finished but is low-confidence for that page | Tell the user which pages, suggest manual review or a hosted OCR service - don't silently treat the page as fully read |
| Setup script downloads succeed but `pdfium.dll`/`onnxruntime.dll` not found afterward | Archive layout changed upstream | Check the current release assets manually; the script's recursive search should still find them wherever they land, but a renamed DLL would break it |
