<#
.SYNOPSIS
  Check or install pdf-inspector on Windows, with the optional local-OCR
  runtime (PDFium + ONNX Runtime) needed for scanned PDFs.

.DESCRIPTION
  Creates %USERPROFILE%\.pdf-inspector-venv and installs the `pdf-inspector`
  PyPI package (prebuilt Windows x64 wheel, no Rust toolchain needed).
  Unless -SkipOcr is given, it also downloads the pinned PDFium and ONNX
  Runtime shared libraries into %LOCALAPPDATA%\pdf-inspector\runtime\ and
  points PDFIUM_LIB_PATH / ORT_DYLIB_PATH (user environment variables) at
  them, so any new terminal or process can do local OCR on scanned PDFs
  without extra setup. The OCR MODEL weights (~31 MB) are downloaded
  separately and automatically by pdf-inspector itself on first OCR call,
  not by this script.

  These versions are pinned to the combination pdf-inspector's own docs call
  the "reproducible path" (docs/ocr-runtime.md) - don't casually bump one
  without the other.

.PARAMETER Check
  Only report status; install/download nothing.

.PARAMETER SkipOcr
  Install only the Python package (fast text-based PDFs). Skips the ~80MB
  PDFium/ONNX Runtime download. Scanned PDFs will still classify correctly
  but OCR calls will fail with a clear "PDFium not found" error until this
  is rerun without -SkipOcr.

.PARAMETER VenvPath
  Where the virtual environment lives. Default: %USERPROFILE%\.pdf-inspector-venv

.PARAMETER RuntimeDir
  Where the OCR shared libraries are extracted. Default:
  %LOCALAPPDATA%\pdf-inspector\runtime

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File setup_windows.ps1 -Check
  powershell -ExecutionPolicy Bypass -File setup_windows.ps1
  powershell -ExecutionPolicy Bypass -File setup_windows.ps1 -SkipOcr
#>
param(
  [switch]$Check,
  [switch]$SkipOcr,
  [string]$VenvPath = (Join-Path $env:USERPROFILE ".pdf-inspector-venv"),
  [string]$RuntimeDir = (Join-Path $env:LOCALAPPDATA "pdf-inspector\runtime")
)

$ErrorActionPreference = "Stop"

# Pinned per https://github.com/firecrawl/pdf-inspector/blob/main/docs/ocr-runtime.md
$PdfiumReleaseTag = "native-v7988"
$PdfiumRepo = "firecrawl/pdfium-rs"
$PdfiumAsset = "firecrawl-pdfium-win-x64.tgz"
$OrtVersion = "1.27.0"
$OrtAsset = "onnxruntime-win-x64-$OrtVersion.zip"
$OrtUrl = "https://github.com/microsoft/onnxruntime/releases/download/v$OrtVersion/$OrtAsset"

$venvPython = Join-Path $VenvPath "Scripts\python.exe"

function Get-BasePython {
  foreach ($candidate in @(@("py", "-3"), @("python3"), @("python"))) {
    $exe = $candidate[0]
    if (-not (Get-Command $exe -ErrorAction SilentlyContinue)) { continue }
    $extra = @($candidate | Select-Object -Skip 1)
    try {
      $ver = & $exe @extra -c "import sys; print('%d.%d' % sys.version_info[:2])" 2>$null
      if ($LASTEXITCODE -eq 0 -and $ver -match '^\d+\.\d+$') {
        $parts = $ver.Split('.')
        if ([int]$parts[0] -gt 3 -or ([int]$parts[0] -eq 3 -and [int]$parts[1] -ge 8)) {
          return ,(@($exe) + $extra)
        }
      }
    } catch { }
  }
  return $null
}

function Test-PdfInspector {
  if (-not (Test-Path $venvPython)) { return $false }
  & $venvPython -c "import pdf_inspector" 2>$null
  return ($LASTEXITCODE -eq 0)
}

function Find-Dll($root, $name) {
  if (-not (Test-Path $root)) { return $null }
  $found = Get-ChildItem -Path $root -Filter $name -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($found) { return $found.FullName }
  return $null
}

function Get-OcrStatus {
  $pdfium = Find-Dll $RuntimeDir "pdfium.dll"
  $ort = Find-Dll $RuntimeDir "onnxruntime.dll"
  $envPdfium = [Environment]::GetEnvironmentVariable("PDFIUM_LIB_PATH", "User")
  $envOrt = [Environment]::GetEnvironmentVariable("ORT_DYLIB_PATH", "User")
  [PSCustomObject]@{
    PdfiumFound   = [bool]$pdfium
    OrtFound      = [bool]$ort
    PdfiumPath    = $pdfium
    OrtPath       = $ort
    EnvPdfiumSet  = ($envPdfium -and (Test-Path $envPdfium))
    EnvOrtSet     = ($envOrt -and (Test-Path $envOrt))
  }
}

if ($Check) {
  if (Test-PdfInspector) {
    $v = & $venvPython -m pip show pdf-inspector 2>$null | Select-String "^Version"
    Write-Output "OK: pdf-inspector installed ($v)"
    Write-Output "Python: $venvPython"
  } else {
    $base = Get-BasePython
    if ($base) {
      Write-Output "MISSING: pdf-inspector not installed. Python found ($($base -join ' ')). Run this script without -Check."
    } else {
      Write-Output "MISSING: pdf-inspector not installed and no Python >= 3.8 found. Install Python from python.org, then rerun."
    }
  }
  $ocr = Get-OcrStatus
  if ($ocr.PdfiumFound -and $ocr.OrtFound -and $ocr.EnvPdfiumSet -and $ocr.EnvOrtSet) {
    Write-Output "OK: OCR runtime ready (PDFium + ONNX Runtime found, env vars set)"
  } elseif ($ocr.PdfiumFound -and $ocr.OrtFound) {
    Write-Output "PARTIAL: OCR DLLs present at $RuntimeDir but PDFIUM_LIB_PATH/ORT_DYLIB_PATH user env vars are not set or stale. Rerun setup (without -Check/-SkipOcr) to fix."
  } else {
    Write-Output "MISSING: OCR runtime not installed. Scanned PDFs will fail OCR until this script is rerun without -SkipOcr. Text-based PDFs work regardless."
  }
  exit ($(if (Test-PdfInspector) { 0 } else { 1 }))
}

$base = Get-BasePython
if (-not $base) {
  Write-Error "Python 3.8+ was not found. Install it (winget install Python.Python.3.12) and rerun."
  exit 1
}

if (-not (Test-Path $venvPython)) {
  Write-Output "Creating virtual environment at $VenvPath ..."
  $exe = $base[0]; $extra = @($base | Select-Object -Skip 1)
  & $exe @extra -m venv $VenvPath
}

Write-Output "Installing pdf-inspector ..."
& $venvPython -m pip install --upgrade pip | Out-Null
& $venvPython -m pip install pdf-inspector
if ($LASTEXITCODE -ne 0) { Write-Error "pip install failed (check network/proxy)."; exit 1 }

if (-not (Test-PdfInspector)) {
  Write-Error "Install finished but 'import pdf_inspector' still fails."
  exit 1
}
Write-Output "OK: pdf-inspector installed. Use: $venvPython <skill_dir>\scripts\read_pdf.py <file.pdf>"

if ($SkipOcr) {
  Write-Output "Skipped OCR runtime (-SkipOcr). Text-based PDFs work now; scanned PDFs will raise a clear error until this is rerun without -SkipOcr."
  exit 0
}

$ocr = Get-OcrStatus
if ($ocr.PdfiumFound -and $ocr.OrtFound -and $ocr.EnvPdfiumSet -and $ocr.EnvOrtSet) {
  Write-Output "OK: OCR runtime already set up ($RuntimeDir)."
  exit 0
}

Write-Output "Setting up local OCR runtime (PDFium + ONNX Runtime, ~80MB, one-time download) ..."
New-Item -ItemType Directory -Force -Path $RuntimeDir | Out-Null

if (-not $ocr.PdfiumFound) {
  $pdfiumUrl = "https://github.com/$PdfiumRepo/releases/download/$PdfiumReleaseTag/$PdfiumAsset"
  $pdfiumArchive = Join-Path $env:TEMP $PdfiumAsset
  Write-Output "Downloading PDFium ($PdfiumReleaseTag) ..."
  try {
    Invoke-WebRequest -Uri $pdfiumUrl -OutFile $pdfiumArchive -UseBasicParsing
  } catch {
    Write-Error "PDFium download failed from $pdfiumUrl. Check https://github.com/$PdfiumRepo/releases for the current asset name/tag."
    exit 1
  }
  tar -xzf $pdfiumArchive -C $RuntimeDir
  Remove-Item $pdfiumArchive -Force
}

if (-not $ocr.OrtFound) {
  $ortArchive = Join-Path $env:TEMP $OrtAsset
  Write-Output "Downloading ONNX Runtime ($OrtVersion) ..."
  try {
    Invoke-WebRequest -Uri $OrtUrl -OutFile $ortArchive -UseBasicParsing
  } catch {
    Write-Error "ONNX Runtime download failed from $OrtUrl. Check https://github.com/microsoft/onnxruntime/releases/tag/v$OrtVersion for the current asset name."
    exit 1
  }
  Expand-Archive -Path $ortArchive -DestinationPath $RuntimeDir -Force
  Remove-Item $ortArchive -Force
}

$pdfiumDll = Find-Dll $RuntimeDir "pdfium.dll"
$ortDll = Find-Dll $RuntimeDir "onnxruntime.dll"
if (-not $pdfiumDll -or -not $ortDll) {
  Write-Error "Extraction finished but pdfium.dll and/or onnxruntime.dll were not found under $RuntimeDir. The release archive layout may have changed."
  exit 1
}

[Environment]::SetEnvironmentVariable("PDFIUM_LIB_PATH", $pdfiumDll, "User")
[Environment]::SetEnvironmentVariable("ORT_DYLIB_PATH", $ortDll, "User")
Write-Output "OK: OCR runtime installed."
Write-Output "  PDFIUM_LIB_PATH = $pdfiumDll"
Write-Output "  ORT_DYLIB_PATH  = $ortDll"
Write-Output "Open a new terminal for the env vars to take effect (or set them in this session with `$env:PDFIUM_LIB_PATH`/`$env:ORT_DYLIB_PATH` using the values above)."
Write-Output "The OCR model weights (~31MB) download automatically on the first page that actually needs OCR."
