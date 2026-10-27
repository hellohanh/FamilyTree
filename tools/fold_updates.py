#!/usr/bin/env python3
"""Fold confirmed Edit Tree updates into the repo (Entry 156).

  python3 tools/fold_updates.py <trancestry-confirmed-updates-YYYY-MM-DD.json>

- data/updates.json keeps every confirmed update (by id; re-running with a newer download adds only new ones).
  tools/build_minh.py base() applies them to the trees built into the main page, so they are part of the tree
  even before the database is read (the page applies them again harmlessly: same ids).
- data/updates_for_spreadsheet.md lists each change with the sheet and cell, for Hanh to copy into his spreadsheet.
"""
import json, sys, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
src = json.load(open(sys.argv[1], encoding='utf-8'))
dst = R/'data/updates.json'
have = json.load(open(dst, encoding='utf-8')) if dst.exists() else {'_about': 'Confirmed Edit Tree updates folded into the repo (Entry 156); applied by tools/build_minh.py.', 'updates': []}
ids = {u['id'] for u in have['updates']}
new = [u for u in src['updates'] if u.get('status') == 'ok' and u['id'] not in ids]
have['updates'] += new; have['updates'].sort(key=lambda u: u['id'])
open(dst, 'w', encoding='utf-8').write(json.dumps(have, ensure_ascii=False, indent=1) + '\n')
# the spreadsheet list
trees = {v['link']: (k, v) for k, v in json.load(open(R/'data/trees.json', encoding='utf-8')).items() if not k.startswith('_') and 'link' in v}
def cell(t, i):
    sheet, v = trees.get(t, (t, {'prefix': ''}))
    pre = v.get('prefix', '')
    if pre and i.startswith(pre): return sheet, i[len(pre):]
    return sheet, (i if not i.startswith('u-') else 'new person')
F = {'first': 'First name', 'middle': 'Middle name', 'last': 'Last name', 'alt': 'Nickname', 'g': 'Male / Female', 'dead': 'Has passed', 'adopted': 'Adopted', 'god': 'Godparents'}
nm = lambda p: ((p.get('title') + ' ') if p.get('title') else '') + (p.get('first') or '??') + (f" ({p['alt']})" if p.get('alt') else '')
lines = ['# Confirmed updates to copy into the spreadsheet', '', f'_Folded {len(have["updates"])} updates; new this time: {len(new)}._', '']
for u in have['updates']:
    lines.append(f"## #{u['id']} · {u['sender']} · {u['at'][:10]} — {u.get('summary', '')}")
    for o in u['ops']:
        t = o.get('t', 'hanh-paternal'); sheet, c = cell(t, o.get('id', ''))
        if o['op'] == 'edit':
            for k, v in (o.get('set') or {}).items():
                lines.append(f"- **{sheet}!{c}** {F.get(k, k)}: {json.dumps((o.get('was') or {}).get(k, ''), ensure_ascii=False)} → {json.dumps(v, ensure_ascii=False)}")
        elif o['op'] == 'remove':
            lines.append(f"- **{sheet}!{c}** remove {nm(o.get('was') or {})} ({o.get('why')})")
        else:
            ps, pc = cell(t, o.get('to', ''))
            lines.append(f"- **{sheet}** add {nm(o.get('person') or {})} as {'spouse' if o['op'] == 'spouse' else 'child'} of the box at {pc} (position {o.get('at')})")
    lines.append('')
open(R/'data/updates_for_spreadsheet.md', 'w', encoding='utf-8').write('\n'.join(lines))
print(f'{len(new)} new confirmed updates folded; {len(have["updates"])} in data/updates.json')
