"""
Script untuk mengonversi semua cover buku PNG ke WebP menggunakan Pillow (libwebp Google)
disimpan di folder baru: public/cover-buku-webp/
dan menampilkan perbandingan ukuran sebelum vs sesudah.
"""

import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image

try:
    from tqdm import tqdm
except ImportError:
    tqdm = None

# Konfigurasi Path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
SOURCE_DIR = os.path.join(PROJECT_ROOT, "public", "cover-buku")
TARGET_DIR = os.path.join(PROJECT_ROOT, "public", "cover-buku-webp")

# Pengaturan Kualitas WebP
WEBP_QUALITY = 80  # Sweet spot web standar (visual tajam & ukuran sangat ramping)
WEBP_METHOD = 6   # Kompresi tertinggi libwebp (paling hemat)


def convert_single_image(filename: str) -> dict:
    """Mengonversi 1 file PNG ke format WebP."""
    src_path = os.path.join(SOURCE_DIR, filename)
    base_name = os.path.splitext(filename)[0]
    dst_name = f"{base_name}.webp"
    dst_path = os.path.join(TARGET_DIR, dst_name)

    try:
        size_png = os.path.getsize(src_path)

        with Image.open(src_path) as img:
            # Pertahankan transparansi jika ada RGBA / LA / palet transparan
            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                img_conv = img.convert("RGBA")
            else:
                img_conv = img.convert("RGB")

            img_conv.save(dst_path, "WEBP", quality=WEBP_QUALITY, method=WEBP_METHOD)

        size_webp = os.path.getsize(dst_path)

        return {
            "status": "OK",
            "file": dst_name,
            "size_png": size_png,
            "size_webp": size_webp,
        }
    except Exception as e:
        return {
            "status": "ERROR",
            "file": filename,
            "error": str(e),
            "size_png": 0,
            "size_webp": 0,
        }


def format_size(bytes_val: int) -> str:
    """Format bytes ke satuan yang mudah dibaca."""
    for unit in ["B", "KB", "MB", "GB"]:
        if bytes_val < 1024.0:
            return f"{bytes_val:.2f} {unit}"
        bytes_val /= 1024.0
    return f"{bytes_val:.2f} TB"


def main():
    print("=" * 65)
    print("KONVERTER COVER BUKU KE WEBP (Pillow - Google libwebp)")
    print("=" * 65)

    if not os.path.exists(SOURCE_DIR):
        print(f"[ERROR] Folder sumber tidak ditemukan: {SOURCE_DIR}")
        sys.exit(1)

    png_files = [f for f in os.listdir(SOURCE_DIR) if f.lower().endswith(".png")]
    total_files = len(png_files)

    if total_files == 0:
        print(f"[ERROR] Tidak ada file PNG di {SOURCE_DIR}")
        sys.exit(1)

    os.makedirs(TARGET_DIR, exist_ok=True)

    print(f"Folder Sumber (PNG) : {SOURCE_DIR}")
    print(f"Folder Tujuan (WebP): {TARGET_DIR}")
    print(f"Jumlah File         : {total_files} gambar")
    print(f"Kualitas WebP       : Quality={WEBP_QUALITY}, Method={WEBP_METHOD}")
    print("-" * 65)

    start_time = time.time()
    results = []

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(convert_single_image, f): f for f in png_files}

        if tqdm:
            iterator = tqdm(as_completed(futures), total=len(futures), desc="Mengonversi ke WebP")
        else:
            iterator = as_completed(futures)

        for future in iterator:
            res = future.result()
            results.append(res)
            if not tqdm:
                if res["status"] == "OK":
                    hemat = round((1 - res["size_webp"] / res["size_png"]) * 100, 1)
                    print(f"[OK] {res['file']} -> hemat {hemat}%")
                else:
                    print(f"[ERROR] {res['file']}: {res.get('error')}")

    elapsed = round(time.time() - start_time, 2)

    # Perhitungan Total
    total_png_bytes = sum(r["size_png"] for r in results if r["status"] == "OK")
    total_webp_bytes = sum(r["size_webp"] for r in results if r["status"] == "OK")
    saved_bytes = total_png_bytes - total_webp_bytes
    percent_saved = (saved_bytes / total_png_bytes * 100) if total_png_bytes > 0 else 0
    success_count = sum(1 for r in results if r["status"] == "OK")
    error_count = sum(1 for r in results if r["status"] == "ERROR")

    print("\n" + "=" * 65)
    print("HASIL PERBANDINGAN UKURAN (PNG vs WebP)")
    print("=" * 65)
    print(f"Total File Berhasil : {success_count} / {total_files}")
    if error_count > 0:
        print(f"File Gagal          : {error_count}")
    print(f"Waktu Proses        : {elapsed} detik")
    print("-" * 65)
    print(f"Ukuran Asli (PNG)   : {format_size(total_png_bytes)} ({total_png_bytes:,} bytes)")
    print(f"Ukuran Baru (WebP)  : {format_size(total_webp_bytes)} ({total_webp_bytes:,} bytes)")
    print(f"Ruang Yang Dihemat  : {format_size(saved_bytes)} ({saved_bytes:,} bytes)")
    print(f"Persentase Penghematan: {percent_saved:.2f}% LEBIH RINGAN!")
    print("=" * 65)
    print(f"Folder WebP tersimpan di: {TARGET_DIR}")


if __name__ == "__main__":
    main()
