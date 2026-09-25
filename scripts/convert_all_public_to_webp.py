"""
Script untuk:
1. Mengonversi semua gambar PNG/JPG/JPEG di folder public/ (alumni, artikel, cover, maskot) ke format WebP.
2. Menghapus file gambar lama setelah berhasil dikonversi.
3. Memperbarui semua referensi file di folder content/ dan app/ dari ekstensi lama ke .webp.
"""

import os
import re
import sys
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
CONTENT_DIR = os.path.join(PROJECT_ROOT, "content")
APP_DIR = os.path.join(PROJECT_ROOT, "app")

WEBP_QUALITY = 82
WEBP_METHOD = 6
EXTS = (".png", ".jpg", ".jpeg")


def format_size(bytes_val: int) -> str:
    for unit in ["B", "KB", "MB", "GB"]:
        if bytes_val < 1024.0:
            return f"{bytes_val:.2f} {unit}"
        bytes_val /= 1024.0
    return f"{bytes_val:.2f} TB"


def convert_images():
    print("=" * 65)
    print("1. MENGONVERSI GAMBAR DI PUBLIC KE WEBP")
    print("=" * 65)

    converted_map = {}  # old_rel_path -> new_rel_path
    total_old_size = 0
    total_new_size = 0

    for root, dirs, files in os.walk(PUBLIC_DIR):
        # Lewati cover-buku karena sudah berupa webp
        rel_root = os.path.relpath(root, PUBLIC_DIR).replace("\\", "/")
        if rel_root.startswith("cover-buku"):
            continue

        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in EXTS:
                old_path = os.path.join(root, f)
                base_name = os.path.splitext(f)[0]
                new_filename = f"{base_name}.webp"
                new_path = os.path.join(root, new_filename)

                old_size = os.path.getsize(old_path)
                total_old_size += old_size

                try:
                    with Image.open(old_path) as img:
                        if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                            img_conv = img.convert("RGBA")
                        else:
                            img_conv = img.convert("RGB")
                        img_conv.save(new_path, "WEBP", quality=WEBP_QUALITY, method=WEBP_METHOD)

                    new_size = os.path.getsize(new_path)
                    total_new_size += new_size

                    # Hapus file lama
                    os.remove(old_path)

                    old_rel = os.path.relpath(old_path, PUBLIC_DIR).replace("\\", "/")
                    new_rel = os.path.relpath(new_path, PUBLIC_DIR).replace("\\", "/")
                    converted_map[f] = new_filename
                    converted_map[old_rel] = new_rel

                    hemat = round((1 - new_size / old_size) * 100, 1)
                    print(f"[OK] {old_rel} -> {new_filename} ({format_size(old_size)} -> {format_size(new_size)}, hemat {hemat}%)")

                except Exception as e:
                    print(f"[ERROR] Gagal konversi {old_path}: {e}")

    saved = total_old_size - total_new_size
    percent = (saved / total_old_size * 100) if total_old_size > 0 else 0

    print("-" * 65)
    print(f"Total gambar dikonversi: {len(converted_map) // 2}")
    print(f"Ukuran lama: {format_size(total_old_size)}")
    print(f"Ukuran baru: {format_size(total_new_size)}")
    print(f"Hemat: {format_size(saved)} ({percent:.2f}% lebih ramping)")
    print("=" * 65)

    return converted_map


def update_references(converted_map):
    print("\n" + "=" * 65)
    print("2. MEMPERBARUI REFERENSI DI CONTENT & APP")
    print("=" * 65)

    scan_dirs = [CONTENT_DIR, APP_DIR]
    valid_exts = (".vue", ".ts", ".js", ".mjs", ".yml", ".yaml", ".md", ".json")

    total_files_modified = 0

    for s_dir in scan_dirs:
        for root, dirs, files in os.walk(s_dir):
            for f in files:
                if f.endswith(valid_exts):
                    filepath = os.path.join(root, f)
                    try:
                        with open(filepath, "r", encoding="utf-8") as fp:
                            content = fp.read()

                        original_content = content
                        for old_ref, new_ref in converted_map.items():
                            if old_ref in content:
                                content = content.replace(old_ref, new_ref)

                        if content != original_content:
                            with open(filepath, "w", encoding="utf-8") as fp:
                                fp.write(content)
                            rel_p = os.path.relpath(filepath, PROJECT_ROOT)
                            print(f"[UPDATED] {rel_p}")
                            total_files_modified += 1
                    except Exception as e:
                        print(f"[ERROR] Gagal membaca/menulis {filepath}: {e}")

    print("-" * 65)
    print(f"Total file yang diperbarui referensinya: {total_files_modified}")
    print("=" * 65)


def main():
    converted_map = convert_images()
    if converted_map:
        update_references(converted_map)
    print("\n[SELESAI] Semua gambar telah dikonversi ke WebP dan referensi data sudah diperbarui!")


if __name__ == "__main__":
    main()
