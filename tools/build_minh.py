#!/usr/bin/env python3
"""Build minh/index.html — Minh's tree (Bà Thương's family), Entry 126.

Same engine as v2: reads v2/src/index.template.html and applies a short list of exact patches (each must match the
expected number of times, or the build stops), so fixes to v2 carry over. Adds:
  minh/src/kin.js     kinship titles computed in the page (v1's rules; matches v2/src/kin.json on Ông Hai's tree)
  minh/src/store.js   Minh's tree (this browser for now), starting with Thương's parents, unnamed
  minh/src/editor.*   pencils + the locked v2 edit pop-up, with name suggestions from data/vn_names.txt
Run: python3 tools/build_minh.py .
"""
import json, sys, pathlib
def tree_links(R, here=None, base='../'):   # Entry 129: the Options pane's TREES list, from data/trees.json
    import json, html
    trees = {k: v for k, v in json.load(open(R/'data/trees.json', encoding='utf-8')).items() if not k.startswith('_')}
    icon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="5"/><path d="M12 13v9M12 17l-3-2M12 16l3-2"/></svg>'
    return '\n '.join(f'<a class="item{" here" if k == here else ""}" href="{html.escape((base + v["url"].removeprefix("./")) or "./")}"{" aria-current=\"page\"" if k == here else ""}>{icon}<span class="grow">{html.escape(v["name"])}<span class="sub">{"Open now" if k == here else "Open this tree"}</span></span></a>' for k, v in trees.items())

R = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
t = (R/'v2/src/index.template.html').read_text(encoding='utf-8')
src = lambda p: (R/'minh/src'/p).read_text(encoding='utf-8')

def P(old, new, count=1):
    global t
    n = t.count(old)
    assert n == count, f'patch expected {count}× but found {n}×: {old[:70]!r}'
    t = t.replace(old, new)

# name suggestions (data/vn_names.txt: "Name|meaning" lines for given names, "@Name" words for family names)
given, last = [], []
for line in (R/'data/vn_names.txt').read_text(encoding='utf-8').splitlines():
    line = line.strip()
    if not line or line.startswith('#'): continue
    if line.startswith('@'): last += [w[1:] for w in line.split()]; continue
    n, m = line.split('|'); given.append([n, m])
js = lambda v: json.dumps(v, ensure_ascii=False, separators=(',', ':'))

# 1. shared files live in v2/
P('<script src="d3.min.js"></script>', '<script src="../v2/d3.min.js"></script>')
P('<script src="flubber.min.js"></script>', '<script src="../v2/flubber.min.js"></script>')
P("assets/avatars/", "../v2/assets/avatars/", t.count("assets/avatars/"))
# 2. the tree comes from Minh's store; titles are computed in the page
# Entry 132: the tree comes from Supabase — store.js loads it, then starts the engine (kept in a text/hft-engine block)
P('<script>\nconst T=__TREE__, KIN=__KIN__;', '<script>\n' + src('store.js') + '\n</script>\n<script type="text/hft-engine" id="engine">\n' + src('kin.js') + '\nwindow.PENW=30;window.PID=c=>c;let T=MINH.tree(), KIN=buildKin(T);')
# 3. after a save the page comes back without the splash
P('(function splash(){', "(function splash(){if(MINH.restore){document.getElementById('splash').remove();return}")
# 4. an empty wheel (only Thương's parents): a tap opens the Simple view to start adding people
P("if(!SNAP){const ring=", "if(!P.length){$('pSimple').click();return}if(!SNAP){const ring=")
P(":'Tap anywhere on the wheel'}", ":(P.length?'Tap anywhere on the wheel':'Tap to start adding the family')}")
# 5. pencils: Simple view rows, Side / Top cards (window.PENW = 30 widens the cards to make room; wings sit left of it)
P("attr('width',WGW).attr('height',WGH)})}", "attr('width',WGW).attr('height',WGH);window.PEN(R,w-34,cy,22,q)})}")
P("attr('fill','transparent')});   // Entry 122: the whole card", "attr('fill','transparent');window.PEN(G,c.w-34*s,c.h/2,22*s,q)});   // Entry 122: the whole card")
# 6. a reload after a save is the same visit: keep each couple's avatar set and the drop-once-per-visit memory
P("const setOf=d=>SETMAP.get(d)??5;",
  "(function(){let S={};try{S=JSON.parse(sessionStorage.getItem('hft-minh-sets'))||{}}catch(e){}"
  "h.each(d=>{const c=d.data.k[0];if(S[c]!=null&&d!==h)SETMAP.set(d,S[c])});"
  "h.each(d=>{const ks=d.children||[],used=new Set([SETMAP.get(d)]);ks.forEach(c=>{if(S[c.data.k[0]]!=null)used.add(SETMAP.get(c))});"
  "ks.forEach(c=>{if(S[c.data.k[0]]!=null)return;let v=SETMAP.get(c);if(used.has(v)){const f=[0,1,2,3,4,5].find(x=>!used.has(x));if(f!=null)v=f}SETMAP.set(c,v);used.add(v)})});"
  "h.each(d=>{S[d.data.k[0]]=SETMAP.get(d)});try{sessionStorage.setItem('hft-minh-sets',JSON.stringify(S))}catch(e){}})();\n"
  " const setOf=d=>SETMAP.get(d)??5;")
P("let T0=d3.zoomIdentity,cards=[],lines=[],cols={},LV={},DROPPED={};",
  "let T0=d3.zoomIdentity,cards=[],lines=[],cols={},LV={},DROPPED=(()=>{try{return JSON.parse(sessionStorage.getItem('hft-minh-dropped'))||{}}catch(e){return {}}})();")
P("DROPPED[MODE]=true;", "DROPPED[MODE]=true;try{sessionStorage.setItem('hft-minh-dropped',JSON.stringify(DROPPED))}catch(e){}")
# 6b. Minh's tree has no name yet: keep v2's original wording
P('__TREENAME__', 'Our Family Tree', 2)
P('__TREELINKS__', tree_links(R, None))
# 7. the editor
P('<script src="../v2/d3.min.js"></script>', src('editor.html') + '\n<script src="../v2/d3.min.js"></script>')

# Entry 135 (step 3): Bà Thương's branch from Hạnh's Paternal Grandpa, packed for the link offer (Entry 130).
# Shared records use the id "hp:<cell>" (hp = Hạnh's Paternal Grandpa sheet). Ông Hai's box N262; Bà Thương N264;
# her children = the boxes whose mother is N264 (incl. the catalogued Tường branch W267, Entry 98).
import re as _re
_t = json.loads((R/'data/tree.json').read_text(encoding='utf-8'))['H.HN.T Paternal Tree']
def _find(b, cell):
    if any(m['cell'] == cell for m in b['members']): return b
    for c in b['children']:
        r = _find(c, cell)
        if r: return r
_hai = _find(_t['roots'][0], 'N262')
_people = {}
# person ids must match supabase/02_minh.sql's check ^[A-Za-z0-9:._-]{1,60}$ — other characters (e.g. '+' in
# '+E64-1', a spouse added by structure.json) are written as _<hex>
_id = lambda cell: 'hp:' + _re.sub(r'[^A-Za-z0-9._-]', lambda x: '_%x' % ord(x.group()), cell)
def _p(m):
    i = _id(m['cell'])
    _people[i] = {'first': _re.sub(r'^(Ông|Bà) ', '', m['name']), 'middle': '', 'last': '', 'alt': m.get('alt', ''),
                  'g': m.get('gender') or '?', 'dead': bool(m.get('deceased')), 'src': 'H.HN.T Paternal Tree!' + m['cell']}
    return i
def _conv(b):
    n = {'k': [_p(m) for m in b['members']], 'c': [_conv(c) for c in b['children']]}
    if b.get('mother'): n['m'] = _id(b['mother'])
    return n
_th = next(m for m in _hai['members'] if m['cell'] == 'N264'); _p(_th); _p(next(m for m in _hai['members'] if m['cell'] == 'N262'))
_kids = []
for c in _hai['children']:
    if c.get('mother') != 'N264': continue
    k = _conv(c); k['m'] = '@first' if c['members'][0]['cell'] == 'W267' else 'hp:N262'; _kids.append(k)
_count = lambda n: len(n['k']) + sum(_count(c) for c in n['c'])
LINK = {'tree': json.loads((R/'data/trees.json').read_text(encoding='utf-8'))['H.HN.T Paternal Tree']['name'], 'her': 'hp:N264', 'husband': 'hp:N262', 'kids': _kids, 'people': _people,
        'groups': [{'names': ' & '.join(_people[i]['first'] for i in k['k']), 'n': _count(k), 'first': k['m'] == '@first'} for k in _kids]}
assert len(_people) == 46 and sum(g['n'] for g in LINK['groups']) == 44, (len(_people), [g['n'] for g in LINK['groups']])
ed = src('editor.js').replace('__VN_GIVEN__', js(given)).replace('__VN_LAST__', js(last)).replace('__LINK__', js(LINK))
assert t.rstrip().endswith('</script>\n</body>\n</html>'.rstrip()) or t.count('</script>\n</body>') == 1
P('</script>\n</body>', ed + '\n</script>\n</body>')
assert '__' + 'TREE__' not in t and '__KIN__' not in t
(R/'minh').mkdir(exist_ok=True)
(R/'minh/index.html').write_text(t, encoding='utf-8')
print('minh/index.html', len(t)//1024, 'KB;', len(given), 'given names,', len(last), 'family names')
