import os
import re
import shutil
import pandas as pd

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(PROJECT_ROOT, "Untitled spreadsheet - Sheet1.csv")
BUKU_DIR = os.path.join(PROJECT_ROOT, "content", "buku")
BACKUP_DIR = os.path.join(PROJECT_ROOT, "content", "buku_backup")
COVER_DIR = os.path.join(PROJECT_ROOT, "public", "cover-buku")


def get_mapel(title: str) -> str:
    t = title.lower()
    if "pendidikan agama islam" in t or "agama islam" in t:
        return "Agama Islam"
    if "pendidikan agama kristen" in t or "agama kristen" in t:
        return "Agama Kristen"
    if "pendidikan agama katolik" in t or "agama katolik" in t:
        return "Agama Katolik"
    if "pendidikan agama hindu" in t or "agama hindu" in t:
        return "Agama Hindu"
    if "pendidikan agama buddha" in t or "agama buddha" in t:
        return "Agama Buddha"
    if "pendidikan agama khonghucu" in t or "agama khonghucu" in t or "konghucu" in t:
        return "Agama Khonghucu"
    if "kepercayaan" in t:
        return "Kepercayaan"
    if "pancasila" in t:
        return "Pendidikan Pancasila"
    if "bahasa indonesia" in t:
        return "Bahasa Indonesia"
    if "bahasa inggris" in t:
        return "Bahasa Inggris"
    if "matematika" in t:
        return "Matematika"
    if "ilmu pengetahuan alam dan sosial" in t or "ipas" in t:
        return "Ipas"
    if "jasmani" in t or "pjok" in t:
        return "PJOK"
    if "seni musik" in t:
        return "Seni Musik"
    if "seni rupa" in t:
        return "Seni Rupa"
    if "seni tari" in t:
        return "Seni Tari"
    if "seni teater" in t:
        return "Seni Teater"
    if "koding" in t or "kecerdasan artifisial" in t:
        return "Koding-Dan-Kecerdasan-Artifisial"
    return "Umum"


def make_slug(title: str, kelas: str, tipe: str) -> str:
    s = f"kelas{kelas} {title} {tipe}".lower()
    s = re.sub(r"[\/\\,()!?:.]", " ", s)
    s = re.sub(r"\s+", "-", s).strip("-")
    s = re.sub(r"-+", "-", s)
    return s


def format_title(title_raw: str) -> str:
    # Perbaiki penulisan SDMI -> SD/MI jika ada
    t = title_raw.strip()
    t = re.sub(r"\bSDMI\b", "SD/MI", t)
    return t


def main():
    if not os.path.exists(CSV_PATH):
        print(f"[ERROR] CSV tidak ditemukan: {CSV_PATH}")
        return

    df = pd.read_csv(CSV_PATH)
    print(f"Total baris CSV: {len(df)}")

    # Backup folder buku lama
    if os.path.exists(BUKU_DIR):
        if os.path.exists(BACKUP_DIR):
            shutil.rmtree(BACKUP_DIR)
        shutil.copytree(BUKU_DIR, BACKUP_DIR)
        print(f"Backup folder lama dibuat di: {BACKUP_DIR}")
        shutil.rmtree(BUKU_DIR)

    os.makedirs(BUKU_DIR, exist_ok=True)

    created_count = 0
    for _, row in df.iterrows():
        fname = str(row["Nama_File"]).strip()
        drive_id = str(row["Drive_ID"]).strip()

        m = re.match(r"^(guru|siswa)_(\d+)_(.+)\.pdf$", fname, flags=re.I)
        if not m:
            print(f"[WARN] Format nama file tidak sesuai: {fname}")
            continue

        tipe_raw, kelas_str, title_raw = m.groups()
        tipe = "Buku Guru" if tipe_raw.lower() == "guru" else "Buku Siswa"
        kelas = str(kelas_str)
        title = format_title(title_raw)
        pelajaran = get_mapel(title)

        base_name = re.sub(r"\.pdf$", "", fname, flags=re.I)
        webp_cover = f"/cover-buku/{base_name}.webp"

        slug = make_slug(title, kelas, tipe)
        yaml_filename = f"{slug}.yml"
        yaml_path = os.path.join(BUKU_DIR, yaml_filename)

        yaml_content = f"""kelas: '{kelas}'
driveId: {drive_id}
link: https://drive.google.com/file/d/{drive_id}/view
pelajaran: {pelajaran}
tipe: {tipe}
title: '{title}'
image: '{webp_cover}'
"""

        with open(yaml_path, "w", encoding="utf-8") as f:
            f.write(yaml_content)

        created_count += 1

    print(f"Sukses membuat {created_count} file YAML di {BUKU_DIR}")


if __name__ == "__main__":
    main()
