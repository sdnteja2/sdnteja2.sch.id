"""
Script untuk memperbarui metadata buku di content/buku/*.yml:
1. Mengisi driveId dengan ID Google Drive dari 'Untitled spreadsheet - Sheet1.csv'
2. Mengarahkan image cover ke file lokal WebP di '/cover-buku/<nama_file>.webp'
"""

import os
import re
import sys
import pandas as pd
import glob

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(PROJECT_ROOT, "Untitled spreadsheet - Sheet1.csv")
BUKU_DIR = os.path.join(PROJECT_ROOT, "content", "buku")
COVER_DIR = os.path.join(PROJECT_ROOT, "public", "cover-buku")


def norm(s):
    s = str(s).lower()
    s = re.sub(r'\(edisi revisi\)|edisi revisi|sd\/mi|sdmi|sd|kelas|buku|panduan', '', s)
    return re.sub(r'[^a-zA-Z0-9]', '', s)


def load_csv():
    if not os.path.exists(CSV_PATH):
        print(f"[ERROR] CSV tidak ditemukan: {CSV_PATH}")
        sys.exit(1)

    df = pd.read_csv(CSV_PATH)
    entries = []
    webp_files = set(os.listdir(COVER_DIR)) if os.path.exists(COVER_DIR) else set()

    for _, row in df.iterrows():
        fname = str(row["Nama_File"]).strip()
        drive_id = str(row["Drive_ID"]).strip()
        m = re.match(r"^(guru|siswa)_(\d+)_(.+)\.pdf$", fname, flags=re.I)
        if m:
            tipe_raw, kelas, title_part = m.groups()
            tipe = "Buku Guru" if tipe_raw.lower() == "guru" else "Buku Siswa"
            webp_name = re.sub(r"\.pdf$", ".webp", fname, flags=re.I)
            entries.append({
                "fname": fname,
                "drive_id": drive_id,
                "kelas": str(kelas),
                "tipe": tipe,
                "title_part": title_part,
                "norm_title": norm(title_part),
                "webp_name": webp_name,
                "has_cover": webp_name in webp_files,
            })
    return entries


def update_yaml_file(filepath, match_entry):
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()

    new_lines = []
    has_drive_id = False
    new_image_val = f"/cover-buku/{match_entry['webp_name']}"
    new_drive_val = match_entry["drive_id"]

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("driveId:"):
            new_lines.append(f"driveId: {new_drive_val}\n")
            has_drive_id = True
        elif stripped.startswith("link:"):
            new_lines.append(f"link: https://drive.google.com/file/d/{new_drive_val}/view\n")
        elif stripped.startswith("image:"):
            new_lines.append(f"image: {new_image_val}\n")
        else:
            new_lines.append(line)

    if not has_drive_id:
        # Sisipkan driveId setelah baris kelas:
        inserted = False
        final_lines = []
        for l in new_lines:
            final_lines.append(l)
            if l.strip().startswith("kelas:") and not inserted:
                final_lines.append(f"driveId: {new_drive_val}\n")
                inserted = True
        if not inserted:
            final_lines.insert(0, f"driveId: {new_drive_val}\n")
        new_lines = final_lines

    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(new_lines)


def main():
    print("=" * 65)
    print("SINKRONISASI GOOGLE DRIVE ID & LOCAL WEBP COVER KE CONTENT/BUKU")
    print("=" * 65)

    entries = load_csv()
    print(f"Data Google Drive terbaca: {len(entries)} buku")

    yaml_files = glob.glob(os.path.join(BUKU_DIR, "*.yml"))
    print(f"File YAML di content/buku: {len(yaml_files)} file")

    updated_count = 0
    skipped_audio = 0
    unmatched = []

    for yf in yaml_files:
        with open(yf, "r", encoding="utf-8") as f:
            content = f.read()

        title = ""
        kelas = ""
        tipe = ""
        for line in content.splitlines():
            if line.startswith("title:"):
                title = line.split("title:", 1)[1].strip().strip("\"'")
            elif line.startswith("kelas:"):
                kelas = line.split("kelas:", 1)[1].strip().strip("\"'")
            elif line.startswith("tipe:"):
                tipe = line.split("tipe:", 1)[1].strip().strip("\"'")

        if "audio" in title.lower() or "interaktif" in title.lower():
            skipped_audio += 1
            continue

        norm_t = norm(title)
        best = None

        # Khusus perbaikan typo Khonghucu kelas 1 jika ada
        if "khonghucu" in norm_t and kelas == "1":
            for c in entries:
                if "khonghucu" in c["norm_title"] and c["kelas"] == "1":
                    best = c
                    break

        if not best:
            for c in entries:
                if c["kelas"] == str(kelas):
                    if c["norm_title"] == norm_t or norm_t in c["norm_title"] or c["norm_title"] in norm_t:
                        if not tipe or c["tipe"] == tipe:
                            best = c
                            break

        if best:
            update_yaml_file(yf, best)
            updated_count += 1
        else:
            unmatched.append((yf, title, kelas, tipe))

    print("-" * 65)
    print(f"Berhasil diperbarui : {updated_count} buku")
    print(f"Dilewati (Audio/Int): {skipped_audio} buku")
    if unmatched:
        print(f"Belum cocok        : {len(unmatched)} buku")
        for u in unmatched:
            print(f" - {os.path.basename(u[0])} -> {u[1]} (Kelas {u[2]})")
    print("=" * 65)
    print("Sinkronisasi selesai!")


if __name__ == "__main__":
    main()
