#!/usr/bin/env python3
"""Build photo/index.html — the picture page (Entry 143) — from photo/src/index.template.html.
Hạnh's tree is the same tree the main page shows (tools/build_v2.py v2_tree);
other trees load from Supabase in the page.
Run: python3 tools/build_v2.py . && python3 tools/build_photo.py ."""
import json, re, sys, pathlib
R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from build_v2 import v2_tree   # Entry 144: the same tree the main page starts from
TJ = {k: v for k, v in json.load(open(R/'data/trees.json', encoding='utf-8')).items() if not k.startswith('_') and 'link' in v}
tree = json.dumps([{'tree': v2_tree(R, k), 'name': v['name'], 'link': v['link'], 'pre': v['prefix']} for k, v in TJ.items()], ensure_ascii=False, separators=(',', ':'))
t = (R/'photo/src/index.template.html').read_text(encoding='utf-8')
assert t.count('__TREE__') == 1
LK = json.load(open(R/'data/links.json', encoding='utf-8'))['groups'] if (R/'data/links.json').exists() else []
canon = {i: 'hp:' + g['hanh-paternal'] for g in LK if 'hanh-paternal' in g for t2, i in g.items() if t2 != 'hanh-paternal'}
assert t.count('__CANON__') == 1
t = t.replace('__TREE__', tree).replace('__CANON__', json.dumps(canon, ensure_ascii=False))
(R/'photo/index.html').write_text(t, encoding='utf-8')
print('photo/index.html', len(t)//1024, 'KB')

# the printable QR card (Entry 143): the QR opens the picture page; Hanh types the family code in before printing
# (the code itself is never stored in the repo)
import qrcode, qrcode.image.svg, io
URL = 'https://hellohanh.github.io/FamilyTree/photo/'
b = io.BytesIO(); qrcode.make(URL, image_factory=qrcode.image.svg.SvgPathImage, border=1).save(b)
svg = b.getvalue().decode().split('?>', 1)[-1]
q = (R/'photo/src/qr.template.html').read_text(encoding='utf-8')
assert q.count('__QR__') == 1
(R/'photo/qr.html').write_text(q.replace('__QR__', svg), encoding='utf-8')
print('photo/qr.html')
