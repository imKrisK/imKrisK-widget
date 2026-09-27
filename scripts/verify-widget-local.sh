#!/usr/bin/env bash
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

python3 - <<'PY'
import json, re
from pathlib import Path

root = Path('.').resolve()
html = (root / 'index.html').read_text()
json_text = (root / 'telemetry-safe.json').read_text()

if re.search(r'https?://', html, re.I):
    raise SystemExit('External URL detected in index.html')
if 'jsdelivr' in html.lower() or 'cdnjs' in html.lower() or 'unpkg' in html.lower():
    raise SystemExit('Remote CDN dependency detected in index.html')
if '/architecture-deep-dive/admin-metrics' not in html:
    raise SystemExit('Honeypot trap is missing from index.html')
if 'env -u PORT' not in json_text and 'env -u PORT' not in html:
    print('Warning: clean-room shell-isolation hint not found, but still valid')

json.loads(json_text)
print('local widget verification passed')
PY
