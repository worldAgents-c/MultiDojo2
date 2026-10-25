"""Check a Multidojo² website repository or standalone site; standard library only."""
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT/'docs' if (ROOT/'docs/index.html').is_file() else ROOT


def sha(path):
    value=hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda:stream.read(1024*1024),b''):value.update(block)
    return value.hexdigest()


def check():
    issues=[];checked_links=0
    def require(condition,message):
        if not condition:issues.append(message)
    class Links(HTMLParser):
        def __init__(self):super().__init__();self.links=[];self.ids=set()
        def handle_starttag(self,tag,attrs):
            values=dict(attrs)
            if values.get('id'):self.ids.add(values['id'])
            for key in ('href','src','poster'):
                if values.get(key):self.links.append(values[key])
    def slug(value):
        value=re.sub(r'<[^>]+>','',value).strip().lower()
        value=re.sub(r'[^\w\s-]','',value)
        return re.sub(r'\s','-',value)
    cache={}
    def ids(path):
        if path not in cache:
            raw=path.read_text(encoding='utf-8');parser=Links();parser.feed(raw)
            values=set(parser.ids)
            if path.suffix=='.md':values.update(slug(x) for x in re.findall(r'^#{1,6}\s+(.+)$',raw,re.M))
            cache[path]=values
        return cache[path]
    files=[p for p in ROOT.rglob('*') if p.is_file() and '.git' not in p.relative_to(ROOT).parts and '__pycache__' not in p.parts]
    for path in files:
        relative=path.relative_to(ROOT)
        require(not path.is_symlink(),f'Symlink in release: {relative}')
        require(path.stat().st_size<100*1024**2,f'File reaches GitHub regular Git limit: {relative}')
        if path.suffix not in ('.html','.md','.css','.js','.json','.yml','.yaml'):continue
        raw=path.read_text(encoding='utf-8')
        require(not re.search(r'(?:sk-|hf_|gh[pousr]_|github_pat_)[A-Za-z0-9_]{20,}',raw),f'Credential-like token: {relative}')
        require('/home/a/' not in raw and '/media/a/' not in raw,f'Local absolute path: {relative}')
        if path.suffix not in ('.html','.md','.css'):continue
        # Markdown references inside code samples are not website links.
        cleaned=re.sub(r'```.*?```','',raw,flags=re.S) if path.suffix=='.md' else raw
        parser=Links();parser.feed(cleaned)
        links=parser.links
        if path.suffix=='.md':links+=re.findall(r'!?\[[^\]\n]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)',cleaned)
        if path.suffix=='.css':links+=re.findall(r'url\([\'\"]?([^\)\'\"]+)',cleaned)
        for link in links:
            value=urlsplit(link)
            if value.scheme or value.netloc:continue
            checked_links+=1
            target=(path.parent/unquote(value.path)).resolve() if value.path else path.resolve()
            require(target==ROOT or ROOT in target.parents,f'Link leaves release: {relative}: {link}')
            if target.is_dir():target=target/'index.html'
            require(target.is_file(),f'Missing link target: {relative}: {link}')
            if target.is_file() and value.fragment and target.suffix in ('.html','.md'):
                require(unquote(value.fragment) in ids(target),f'Missing anchor: {relative}: {link}')
    config=json.loads((SITE/'project-config.json').read_text())
    require(set(config)=={'brand','deployment','official_site_url','github_url','live_benchmark_url'},'Unexpected public config keys')
    require(config.get('brand')=='Multidojo²' and config.get('deployment')=='static','Incorrect static configuration')
    for key in ('official_site_url','github_url','live_benchmark_url'):
        if config.get(key) is None:continue
        value=config[key]
        if not isinstance(value,str):issues.append(f'Invalid URL: {key}');continue
        parsed=urlsplit(value)
        require(parsed.scheme=='https' and bool(parsed.hostname) and not (parsed.username or parsed.password or parsed.query or parsed.fragment) and not re.search(r'[\s\\]',value),f'Invalid public URL: {key}')
    catalog=json.loads((SITE/'assets/task-catalog.json').read_text())
    tasks=catalog['tasks'];require(len(tasks)==20 and {t['id'] for t in tasks}=={f'{i:02d}' for i in range(20)},'Task IDs differ from 00–19')
    require(len({t['task'] for t in tasks})==20,'Duplicate canonical task')
    covered=[]
    for task in tasks:
        require(task['training_episodes']==task['exam_scenes']==100,f'Incorrect count: {task["id"]}')
        require(task['arms'] in (2,3,4,8),'Invalid scored arm count')
        lines=[n for a,b in task['training_index_rows_1_based'] for n in range(a,b+1)]
        require(len(lines)==100,f'Incorrect training row spans: {task["id"]}');covered+=lines
        require(bool(task['view_sets']) and all(len(v)>=task['arms']+1 for v in task['view_sets']),f'Incomplete camera catalog: {task["id"]}')
    require(sorted(covered)==list(range(1,2001)),'Training row mapping is not a partition of 2000 rows')
    manifest=json.loads((SITE/'manifest.json').read_text())
    for name,expected in manifest['files'].items():
        path=SITE/name
        require(path.is_file() and sha(path)==expected,f'Asset checksum mismatch: {name}')
    readme=(ROOT/'README.md').read_text()
    require('%%' not in readme,'Unresolved README template token')
    positions=[readme.find(f'assets/fan-{x}.gif') for x in ('isomorphic','heterogeneous','humanoid')]
    require(all(x>=0 for x in positions) and positions==sorted(positions),'Fan showcase order changed')
    require('All-to-One' in readme and 'One-to-All' in readme,'Collaboration principle missing')
    require(len(re.findall(r'^\| \d{2} \|',readme,re.M))==20,'README task catalog has incorrect row count')
    chinese=(ROOT/'README.zh-CN.md').read_text()
    require('%%' not in chinese,'Unresolved Chinese README template token')
    require(len(re.findall(r'^\| \d{2} \|',chinese,re.M))==20,'Chinese README task catalog has incorrect row count')
    require('href="README.zh-CN.md"' in readme and 'href="README.md"' in chinese,'README language switch is incomplete')
    for task in tasks:
        require(task['task'] in readme and task['task'] in chinese,f'Bilingual task identifier missing: {task["id"]}')
    pending=[key for key in ('official_site_url','github_url','live_benchmark_url') if config[key] is None]
    print(json.dumps(dict(passed=not issues,files=len(files),local_links=checked_links,task_families=len(tasks),training_rows=len(covered),pending_public_addresses=pending,issues=issues),ensure_ascii=False,indent=2))
    return 1 if issues else 0


if __name__=='__main__':
    try:sys.exit(check())
    except (OSError,ValueError,KeyError,TypeError) as error:
        print(f'Release check failed: {error}',file=sys.stderr);sys.exit(1)
