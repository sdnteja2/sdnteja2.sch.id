# pdf-inspector: Python API and CLI reference

Source: https://github.com/firecrawl/pdf-inspector, `docs/python.md`, and
`help()` on the installed package (verified against the actual installed
build, not just the docs, while building this skill). The wrapper
(`scripts/read_pdf.py`) only exposes the common conversion path
(`process_pdf` / `process_pdf_with_ocr`, `--pages`, `--ocr`, `--json`). Use
the Python API directly (in a small one-off script, same venv) for anything
below it doesn't cover.

## Core functions

| Function | Signature (confirmed via `help()`) | Notes |
|---|---|---|
| `process_pdf` | `process_pdf(path, pages=None)` | Detect + extract + Markdown, no OCR. `pages` is 1-indexed |
| `process_pdf_bytes` | `process_pdf_bytes(data, pages=None)` | Same, from bytes |
| `process_pdf_with_ocr` | `process_pdf_with_ocr(path, *, mode='auto', page_numbers=None, password=None, dpi=150.0, minimum_confidence=0.0, hosted_recommendation_confidence=0.5, model_directory=None, offline=False)` | `mode`: `auto` (only OCR pages native extraction rejects - never loads the OCR runtime for a clean text PDF), `force` (OCR every selected page), `off` (keep the result/provenance contract without touching the OCR runtime at all) |
| `process_pdf_with_ocr_bytes` | same kwargs, from bytes | |
| `detect_pdf` | `detect_pdf(path)` | Full detection (type, confidence, per-page OCR routing), no text extraction |
| `classify_pdf` | `classify_pdf(path)` | Lighter than `detect_pdf` - skips building the full result. `pages_needing_ocr` here is **0-indexed** (inconsistent with everything else, which is 1-indexed - verified via `help()`, not a typo) |
| `extract_text` | `extract_text(path)` | Plain text, no Markdown formatting |
| `extract_text_with_positions` | `extract_text_with_positions(path, pages=None, bold_from_weight=False)` | Per-item X/Y (PDF points, origin at the visible page box's lower-left, y up), font, bold/italic/underline/strikeout, rotation, `mcid` for tagged PDFs |
| `extract_text_with_positions_and_rotations` | `(path, bold_from_weight=False)` | Same, plus re-bases pages whose text is predominantly rotated so it reads left-to-right; reports each such page's rotation |
| `extract_text_in_regions` | `(path, page_regions, bold_from_weight=False)` | Extract text inside bounding boxes (top-left origin, y down - different convention from the position extractors above) |
| `extract_pages_markdown` | `(path, pages=None)` | Per-page Markdown + layout metadata (tables/columns/OCR need) from a single parse; font stats computed over the whole doc so heading detection stays consistent |
| `extract_structure_elements` | `(path, pages=None)` | Structure-tree roles (`H1`..`H6`, `P`, `Table`, ...) from **tagged** PDFs only - empty list for untagged ones. Join on `(page, mcid)` against `extract_text_with_positions` to recover real heading levels instead of guessing from font size |

Every function has a `_bytes` variant taking raw bytes instead of a path -
useful when the PDF is already in memory and you want to skip a filesystem
round-trip.

## Key result fields

`PdfResult` (from `process_pdf`/`detect_pdf`): `pdf_type` (`text_based` /
`scanned` / `image_based` / `mixed`), `markdown`, `page_count`, `confidence`,
`pages_needing_ocr` (1-indexed), `pages_with_tables`, `pages_with_columns`,
`has_encoding_issues`, `is_complex_layout`, `title`.

`OcrPdfResult` (from `process_pdf_with_ocr`): `markdown`, `pages` (each with
`provenance.source` = `native`/`ocr`/`fused`, `ocr_confidence`, `timings`),
`pages_routed_to_ocr`, `pages_recommended_for_ocr`, `pages_recommending_hosted`
(local OCR finished but is low-confidence/incomplete - flag these to the
user, don't silently trust them), `is_complex`, `processing_time_ms`,
`ocr_time_ms`.

Full type definitions with every field: `docs/python.md` in the upstream
repo, or `pdf_inspector.pyi` shipped with the installed package.

## CLI (Rust binaries, not the Python wrapper)

Only relevant if a Rust toolchain is available and the Python wrapper isn't
wanted (e.g. inside a Rust-only environment). `cargo install pdf-inspector`
installs both binaries:

```bash
pdf2md document.pdf                          # Markdown to stdout
pdf2md document.pdf --json                   # structured JSON
pdf2md document.pdf --items-json             # positioned TextItem JSON
pdf2md document.pdf --raw                    # markdown only, no headers
pdf2md document.pdf --compact                # collapses long dot leaders etc.
pdf2md document.pdf --pages                  # insert <!-- Page N --> markers
pdf2md document.pdf --select-pages 1,3,5-10
detect-pdf document.pdf [--json] [--analyze] # classification (+ layout analysis)

# OCR requires building with the ocr feature, plus the runtime libraries:
cargo install pdf-inspector --features ocr --bin pdf2md
PDFIUM_LIB_PATH=... ORT_DYLIB_PATH=... pdf2md scan.pdf --ocr auto --json
```

## Node.js (napi) equivalents

`npm install @firecrawl/pdf-inspector` gives `processPdf`, `processPdfWithOcr`
(async, releases the event loop), with the same field names camelCased
(`pdfType`, `pagesRoutedToOcr`, etc.). Full reference: `napi/README.md` in
the upstream repo.
