# Why pdf-inspector over markitdown/anydoc for PDF (verified 2026-09-19)

pdf-inspector was chosen over MarkItDown and Firecrawl's own anydoc for PDF
specifically. This file records why, so a future session doesn't need to
re-litigate it - and so it doesn't over-trust the numbers either. Every row
marked "tested" below was run by hand while building this skill, not copied
from a README.

## What was actually tested

Two synthetic PDFs were built for this: one with a real text layer
(reportlab), and one **image-only** page (PIL-rendered text, flattened to a
PDF page with zero extractable text) - to force the scanned-PDF path
honestly rather than trust either tool's own claim about it.

| | markitdown (already installed) | anydoc | pdf-inspector |
|---|---|---|---|
| Text PDF - heading kept? | **No** - tested output has no `#` on the title | Yes | Yes |
| Text PDF - time (1 doc, informal) | 58ms | ~2s warm via `npx` (mostly Node/npx startup, not conversion - excluded from anydoc's own benchmark for this reason) | 29ms via direct Python call |
| Scanned PDF - behavior | **Silently returns an empty string.** No exception, no signal - a caller that doesn't check output length won't notice | Fails loudly: exit code 3, `"page 1 of 1 needs OCR"` | Classified `pdf_type=scanned` in 0.5ms, `markdown=None` until OCR is requested |
| Free local OCR for scanned PDFs? | **No.** Needs Azure Document Intelligence (paid) or an LLM vision client (also a paid API in practice) | **No.** `--ocr hosted` sends the **entire document** to Firecrawl Parse (no per-page selection); free tier without signup, but not local | **Yes - verified end to end.** After downloading two DLLs (~80MB, one-time) and letting a ~31MB model auto-download, OCR correctly recovered all text from the synthetic scanned page, including the heading, fully offline afterward |
| OCR time (pdf-inspector only) | — | — | ~2.7-5.3s/page warm (CPU), ~44s on the very first call (model download). Not instant, but nothing leaves the machine |

## Third-party benchmark (cited, not run by this skill)

pdf-inspector's README cites the
[opendataloader-bench](https://github.com/opendataloader-project/opendataloader-bench)
corpus (200 real PDFs, OCR disabled, non-OCR local engines only):

| Engine | Overall | Reading order | Tables | Headings | Speed (200 docs) |
|---|---|---|---|---|---|
| pdf-inspector | **0.875** | **0.915** | **0.814** | 0.788 | **0.470s** |
| liteparse | 0.873 | 0.913 | 0.693 | **0.811** | 0.750s |
| opendataloader | 0.831 | 0.902 | 0.489 | 0.739 | 2.569s |
| pymupdf4llm | 0.735 | 0.886 | 0.401 | 0.424 | 17.117s |
| markitdown | 0.589 | 0.844 | 0.273 | **0.000** | 16.165s |

**Caveat, stated plainly**: this benchmark was run and published by
pdf-inspector's own authors (Firecrawl), on a corpus they chose, judged by
their own harness. It is directionally consistent with the hands-on test
above (markitdown lost heading structure in both cases independently), which
is why it's cited here at all - but it is not independently reproduced by
this skill, and "0.000" on headings for markitdown specifically matches
what was independently observed, which is the main reason to trust the rest
of the table's direction even though the exact numbers are self-reported.
anydoc publishes a similar self-authored benchmark (81/100 vs markitdown's
65/100 on a 14-format corpus) - not independently re-run here since this
skill's scope is PDF only.

## Why not anydoc, given it also beat markitdown on structure

anydoc's PDF path has no local OCR at all - it is a hard dependency on
Firecrawl's hosted Parse API for any scanned page, and it sends the whole
document (no page selection) when that happens. If the user's actual goal
is "read this PDF, scanned or not, ideally without sending it anywhere,"
anydoc doesn't satisfy that for scanned documents. It also doesn't do
per-page table/column layout analysis or font-position extraction the way
pdf-inspector does. anydoc remains a reasonable choice if the actual need is
converting **Office documents** (Word/PPT/Excel/OpenDocument/RTF) to
Markdown, which pdf-inspector does not touch at all - that would be a MarkItDown-or-anydoc
decision, not a reason to reach for this skill.

## Non-PDF formats

pdf-inspector only handles PDF. Word/Excel/PowerPoint/HTML/CSV/EPUB/audio/
YouTube/etc. are out of scope for this skill entirely - there is no other
document-conversion skill in this repo to route to for those right now.
