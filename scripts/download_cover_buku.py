"""
Script untuk mengunduh semua cover buku (174 buku) dari SIBI Kemendikbudristek
dengan penamaan sesuai dengan 'Nama_File_Baru' dari daftar_buku_drive.csv
dan disimpan ke dalam satu folder di public/cover-buku/.
"""

import os
import re
import sys
import time
import requests
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    from tqdm import tqdm
except ImportError:
    tqdm = None

# Konfigurasi Path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
DEFAULT_CSV = r"E:\website\Buku_SD_MI_Lengkap_2_Compressed\Semua_Buku_Drive\daftar_buku_drive.csv"
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "public", "cover-buku")

API_URL = "https://api.buku.cloudapp.web.id/api/catalogue/getPenggerakTextBooks?limit=2000&type_pdf&order_by=updated_at&level_sd"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}


def sanitize_filename(name: str) -> str:
    """Membersihkan karakter ilegal pada nama file Windows."""
    return re.sub(r'[\\/*?:"<>|]', "", name).strip()


def normalize_title(title: str) -> str:
    """Normalisasi string untuk matching judul."""
    return re.sub(r"[^a-zA-Z0-9]", "", str(title).lower())


def download_single_cover(item: dict) -> dict:
    """Mengunduh 1 cover buku dengan retry."""
    output_path = item["filepath"]
    url = item["cover_url"]
    title = item["judul"]

    if os.path.exists(output_path) and os.path.getsize(output_path) > 1024:
        return {"status": "SKIP", "file": os.path.basename(output_path), "title": title}

    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            res = requests.get(url, headers=HEADERS, timeout=30)
            if res.status_code == 200:
                with open(output_path, "wb") as f:
                    f.write(res.content)
                return {"status": "OK", "file": os.path.basename(output_path), "title": title}
            else:
                time.sleep(1)
        except Exception as e:
            if attempt == max_retries:
                return {
                    "status": "ERROR",
                    "file": os.path.basename(output_path),
                    "title": title,
                    "error": str(e),
                }
            time.sleep(1.5 * attempt)

    return {
        "status": "FAILED",
        "file": os.path.basename(output_path),
        "title": title,
        "error": f"HTTP {res.status_code}",
    }


def main():
    print("=" * 60)
    print("DOWNLOADER COVER BUKU SIBI (174 BUKU)")
    print("=" * 60)

    # 1. Cek file CSV
    if not os.path.exists(DEFAULT_CSV):
        print(f"[ERROR] File CSV tidak ditemukan di: {DEFAULT_CSV}")
        sys.exit(1)

    print(f"[1/4] Membaca CSV dari: {DEFAULT_CSV}")
    df = pd.read_csv(DEFAULT_CSV)
    print(f"      Total baris di CSV: {len(df)}")

    # 2. Mengambil data dari API
    print(f"[2/4] Mengambil data katalog dari API SIBI...")
    try:
        res = requests.get(API_URL, headers=HEADERS, timeout=30)
        api_data = res.json().get("results", [])
        print(f"      Berhasil mengambil {len(api_data)} buku dari API.")
    except Exception as e:
        print(f"[ERROR] Gagal menghubungi API: {e}")
        sys.exit(1)

    # 3. Matching data CSV dengan API
    api_map = {normalize_title(b.get("title", "")): b for b in api_data}

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"[3/4] Folder tujuan: {OUTPUT_DIR}")

    download_queue = []
    unmatched = []

    for _, row in df.iterrows():
        judul_asli = row["Judul_Asli"]
        nama_pdf = row["Nama_File_Baru"]
        norm_key = normalize_title(judul_asli)

        # Ubah ekstensi .pdf -> .png
        cover_name = re.sub(r"\.pdf$", ".png", nama_pdf, flags=re.IGNORECASE)
        cover_name = sanitize_filename(cover_name)
        filepath = os.path.join(OUTPUT_DIR, cover_name)

        if norm_key in api_map:
            book_info = api_map[norm_key]
            cover_url = str(book_info.get("image", "")).strip()

            download_queue.append({
                "judul": judul_asli,
                "cover_name": cover_name,
                "cover_url": cover_url,
                "filepath": filepath,
            })
        else:
            unmatched.append(judul_asli)

    print(f"      Buku siap diunduh: {len(download_queue)}")
    if unmatched:
        print(f"      [WARNING] {len(unmatched)} buku tidak cocok:")
        for u in unmatched[:5]:
            print(f"        - {u}")

    # 4. Download multi-threading
    print(f"[4/4] Memulai pengunduhan cover buku (Multi-threading 8 workers)...")

    results = []
    start_time = time.time()

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_single_cover, item): item for item in download_queue}

        if tqdm:
            iterator = tqdm(as_completed(futures), total=len(futures), desc="Mengunduh Cover")
        else:
            iterator = as_completed(futures)

        for future in iterator:
            res = future.result()
            results.append(res)
            if not tqdm:
                print(f"[{res['status']}] {res['file']}")

    elapsed = round(time.time() - start_time, 2)

    # Ringkasan
    ok_count = sum(1 for r in results if r["status"] == "OK")
    skip_count = sum(1 for r in results if r["status"] == "SKIP")
    fail_count = sum(1 for r in results if r["status"] in ["FAILED", "ERROR"])

    print("\n" + "=" * 60)
    print("RINGKASAN DOWNLOAD COVER BUKU")
    print("=" * 60)
    print(f"Berhasil diunduh : {ok_count}")
    print(f"Sudah ada (Skip) : {skip_count}")
    print(f"Gagal diunduh    : {fail_count}")
    print(f"Total diproses   : {len(results)}")
    print(f"Waktu pengerjaan : {elapsed} detik")
    print(f"Folder Output    : {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
