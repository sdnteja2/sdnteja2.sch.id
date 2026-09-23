#!/usr/bin/env python3
"""Convert PDF(s) to Markdown with pdf-inspector (Windows-safe wrapper).

Why this wrapper exists instead of calling the library inline:
  * always writes UTF-8,
  * `--ocr auto` (the default) matches pdf_inspector's own default: pages
    that already have a usable text layer never touch the OCR runtime,
  * turns a missing OCR runtime into one actionable message instead of a
    raw Rust/PyO3 exception,
  * handles folders/batches and reports per-file diagnostics (pages routed
    to OCR, tables/columns detected, encoding issues).

Examples:
  python read_pdf.py report.pdf                       # text-based PDF, no OCR
  python read_pdf.py scan.pdf --ocr auto -o out        # OCR only pages that need it
  python read_pdf.py scan.pdf --ocr force              # OCR every selected page
  python read_pdf.py "C:\\docs" --recursive -o out     # whole folder
  python read_pdf.py report.pdf --pages 1,3,5-8
  python read_pdf.py report.pdf --json                 # full result object, not just markdown
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

os.environ.setdefault("PYTHONUTF8", "1")
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8", errors="replace")
    except Exception:  # pragma: no cover
        pass


def eprint(*args):
    print(*args, file=sys.stderr)


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Convert PDF(s) to Markdown with pdf-inspector.")
    p.add_argument("inputs", nargs="*", help="PDF file(s) or folder(s)")
    p.add_argument("-o", "--output", help="Output folder (created if missing). Default: .\\pdf_out")
    p.add_argument("--stdout", action="store_true", help="Print Markdown to the terminal instead of writing files")
    p.add_argument("-r", "--recursive", action="store_true", help="Recurse into sub-folders when an input is a folder")
    p.add_argument("--overwrite", action="store_true", help="Replace existing .md files (default: skip them)")
    p.add_argument("--ocr", choices=["off", "auto", "force"], default="auto",
                   help="off: never touch the OCR runtime (fails clearly on scanned pages). "
                        "auto (default): only OCR pages native extraction can't read - matches "
                        "pdf_inspector's own default and never loads PDFium/ONNX Runtime for a "
                        "clean text-based PDF. force: OCR every selected page.")
    p.add_argument("--pages", help="1-indexed pages/ranges to process, e.g. 1,3,5-8 (default: all)")
    p.add_argument("--offline", action="store_true", help="Prohibit downloading OCR model weights; fail if not already cached")
    p.add_argument("--model-dir", help="Directory of pre-populated OCR model weights (implies offline-capable)")
    p.add_argument("--json", action="store_true", help="Print/write the full result object as JSON instead of plain Markdown")
    return p


def parse_pages(spec: str | None) -> list[int] | None:
    if not spec:
        return None
    pages: list[int] = []
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            pages.extend(range(int(a), int(b) + 1))
        else:
            pages.append(int(part))
    return pages


def collect_files(inputs, recursive):
    for raw in inputs:
        path = Path(raw).expanduser()
        if path.is_file():
            yield path, path.parent
        elif path.is_dir():
            pattern = "**/*.pdf" if recursive else "*.pdf"
            for f in sorted(path.glob(pattern)):
                if f.is_file():
                    yield f, path
        else:
            eprint(f"WARNING: not found, skipped: {path}")


def explain_error(path, exc: Exception) -> str:
    msg = str(exc)
    if "PDFium" in msg or "pdfium" in msg or "PDFIUM_LIB_PATH" in msg:
        return ("OCR runtime not installed. Run scripts\\setup_windows.ps1 (without -SkipOcr), "
                "open a new terminal, and retry. Or pass --ocr off if this file is text-based.")
    if "onnxruntime" in msg or "ORT_DYLIB_PATH" in msg or "ONNX" in msg:
        return ("ONNX Runtime not found. Run scripts\\setup_windows.ps1 (without -SkipOcr), "
                "open a new terminal, and retry.")
    return f"{type(exc).__name__}: {msg[:400]}"


def run_one(pdf_inspector, src: Path, args) -> tuple[str | None, dict | None, list[str]]:
    """Returns (markdown, json_dict_or_None, hints)."""
    pages = parse_pages(args.pages)
    hints: list[str] = []

    if args.ocr == "off":
        result = pdf_inspector.process_pdf(str(src), pages=pages)
        md = result.markdown
        if result.pdf_type != "text_based":
            hints.append(f"pdf_type={result.pdf_type}: has pages that need OCR; rerun with --ocr auto")
        if getattr(result, "has_encoding_issues", False):
            hints.append("has_encoding_issues=True: font encoding looked broken, consider --ocr auto/force")
        data = None
        if args.json:
            data = {
                "pdf_type": result.pdf_type,
                "confidence": result.confidence,
                "page_count": result.page_count,
                "pages_needing_ocr": result.pages_needing_ocr,
                "pages_with_tables": result.pages_with_tables,
                "pages_with_columns": result.pages_with_columns,
                "has_encoding_issues": result.has_encoding_issues,
                "markdown": md,
            }
        return md, data, hints

    result = pdf_inspector.process_pdf_with_ocr(
        str(src),
        mode=args.ocr,
        page_numbers=pages,
        offline=args.offline,
        model_directory=args.model_dir,
    )
    md = result.markdown
    if result.pages_routed_to_ocr:
        hints.append(f"OCR ran on pages {result.pages_routed_to_ocr} ({result.ocr_time_ms}ms)")
    if result.pages_recommending_hosted:
        hints.append(f"pages {result.pages_recommending_hosted} came back low-confidence even after local OCR - "
                      "consider a hosted OCR service or manual review for those pages")
    data = None
    if args.json:
        data = {
            "page_count": result.page_count,
            "pages_routed_to_ocr": result.pages_routed_to_ocr,
            "pages_recommended_for_ocr": result.pages_recommended_for_ocr,
            "pages_recommending_hosted": result.pages_recommending_hosted,
            "pages_with_tables": result.pages_with_tables,
            "pages_with_columns": result.pages_with_columns,
            "is_complex": result.is_complex,
            "processing_time_ms": result.processing_time_ms,
            "ocr_time_ms": result.ocr_time_ms,
            "markdown": md,
        }
    return md, data, hints


def out_path_for(src: Path, base: Path, out_dir: Path, used: set[Path], suffix: str) -> Path:
    try:
        rel = src.relative_to(base).with_suffix(suffix)
    except ValueError:
        rel = Path(src.stem + suffix)
    target = out_dir / rel
    if target in used:
        target = target.with_name(f"{src.stem}.{len(used)}{suffix}")
    used.add(target)
    return target


def write_utf8(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(text)


def main() -> int:
    args = build_parser().parse_args()
    if not args.inputs:
        build_parser().print_help()
        return 2

    try:
        import pdf_inspector
    except ImportError:
        eprint("ERROR: pdf_inspector is not installed in this Python.\n"
               "Run scripts\\setup_windows.ps1 or: pip install pdf-inspector")
        return 2

    out_dir = Path(args.output) if args.output else Path("pdf_out")
    suffix = ".json" if args.json else ".md"
    used: set[Path] = set()
    failures = 0
    converted = 0

    for src, base in collect_files(args.inputs, args.recursive):
        target = None if args.stdout else out_path_for(src, base, out_dir, used, suffix)
        if target and target.exists() and not args.overwrite:
            print(f"SKIP  {src} (exists: {target}; use --overwrite)")
            continue
        try:
            md, data, hints = run_one(pdf_inspector, src, args)
        except Exception as exc:  # noqa: BLE001 - report and continue the batch
            eprint(f"FAILED  {src}\n        {explain_error(src, exc)}")
            failures += 1
            continue

        payload = json.dumps(data, indent=2) if args.json else (md or "")
        if args.stdout:
            print(payload)
        else:
            write_utf8(target, payload)
            print(f"OK  {src} -> {target}  ({len(payload):,} chars)")
        for hint in hints:
            eprint(f"NOTE    {src.name}: {hint}")
        converted += 1

    if not args.stdout:
        print(f"Done: {converted} converted, {failures} failed.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
