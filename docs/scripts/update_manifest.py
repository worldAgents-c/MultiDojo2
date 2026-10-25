"""Refresh hashes after reviewing local static-site edits; standard library only."""
import hashlib
import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
site=root/'docs' if (root/'docs/index.html').is_file() else root
manifest=site/'manifest.json'
value=json.loads(manifest.read_text())
paths=[p for p in site.rglob('*') if p.is_file() and p!=manifest and '.git' not in p.parts and '__pycache__' not in p.parts]
def sha(path):
    h=hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda:stream.read(1024*1024),b''):h.update(block)
    return h.hexdigest()
value['files']={str(p.relative_to(site)):sha(p) for p in sorted(paths)}
partial=manifest.with_suffix('.partial');partial.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n');partial.replace(manifest)
print('Updated',len(paths),'static file hashes. Run scripts/check_release.py to verify.')
