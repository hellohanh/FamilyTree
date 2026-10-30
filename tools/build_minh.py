#!/usr/bin/env python3
"""Build pages that run v2's engine with the editor (Entries 126, 144).

  build(R, 'minh')        → editor/index.html (Entry 201; minh/index.html forwards there) — Minh's trees (Supabase), pencils on every card, Bà Thương link
  build(R, 'main', T, nm) → index.html      — Hạnh's tree (built in) + family updates (Supabase), "Suggest an update"

Same engine as v2: reads v2/src/index.template.html and applies a short list of exact patches (each must match the
expected number of times, or the build stops), so fixes to v2 carry over. Adds:
  minh/src/kin.js        kinship titles computed in the page (v1's rules; matches v2/src/kin.json on Ông Hai's tree)
  minh/src/store.js      Minh's trees (Supabase)            minh/src/store_main.js  Hạnh's tree + updates (main page)
  minh/src/editor.*      the locked v2 edit pop-up, with name suggestions from data/vn_names.txt
  minh/src/link.js, minh_pane.js (Minh only) · main_extra.js (main only) · dialogs / review (both)
Run: python3 tools/build_minh.py .   (the main page is built by tools/build_v2.py)
"""
import json, sys, pathlib, re
def tree_links(R, here=None, base='../'):   # Entry 129: the Options pane's TREES list, from data/trees.json
    import json, html
    trees = {k: v for k, v in json.load(open(R/'data/trees.json', encoding='utf-8')).items() if not k.startswith('_')}
    icon = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="5"/><path d="M12 13v9M12 17l-3-2M12 16l3-2"/></svg>'
    return '\n '.join(f'<a class="item{" here" if k == here else ""}" href="{html.escape((base + v["url"].removeprefix("./")) or "./")}"{" aria-current=\"page\"" if k == here else ""}>{icon}<span class="grow">{html.escape(v["name"])}<span class="sub">{"Open now" if k == here else "Open this tree"}</span></span></a>' for k, v in trees.items())


def build(R, mode='minh', T=None, name=None):
    global t
    MAIN = mode == 'main'
    V = 'v2/' if MAIN else '../v2/'
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
    P('<script src="d3.min.js"></script>', '<script src="'+V+'d3.min.js"></script>')
    P('<script src="flubber.min.js"></script>', '<script src="'+V+'flubber.min.js"></script>')
    P("assets/avatars/", V+"assets/avatars/", t.count("assets/avatars/"))
    if MAIN:   # Entry 139: the main page sits at the site root — root assets / fonts are one level closer
        P('../assets/', 'assets/', t.count('../assets/'))
        P('url(../fonts/', 'url(fonts/', t.count('url(../fonts/'))
    # 2. the tree comes from Minh's store; titles are computed in the page
    # Entry 132: the tree comes from Supabase — store.js loads it, then starts the engine (kept in a text/hft-engine block)
    P('<script>\nconst T=__TREE__, KIN=__KIN__;', '<script>\n' + (src('store_main.js').replace('__BASE__', json.dumps(linked(R, {lnk: dict(fold(R, lnk, base(tt)), name=nm, pre=pre) for lnk, (tt, nm, pre) in T.items()}), ensure_ascii=False, separators=(',', ':'))).replace('__LINKS__', json.dumps(links(R), ensure_ascii=False, separators=(',', ':'))) if MAIN else src('store.js')) + '\n</script>\n<script type="text/hft-engine" id="engine">\n' + src('kin.js') + '\n' + ('window.PENW=window.EDITON?30:0;' if MAIN else 'window.PENW=30;window.PID=c=>c;') + 'let T=MINH.tree(), KIN=buildKin(T);')
    # 3. after a save the page comes back without the splash
    P('(function splash(){', "(function splash(){if(MINH.restore){document.getElementById('splash').remove();return}")
    # 4. an empty wheel (only Thương's parents): a tap opens the Simple view to start adding people
    P("if(!SNAP){const ring=", "if(!P.length){$('pSimple').click();return}if(!SNAP){const ring=")
    P(":'Tap anywhere on the wheel · drag to move it · drag the outer ring or the rail to turn it'}", ":(P.length?'Tap anywhere on the wheel · drag to move it · drag the outer ring or the rail to turn it':'Tap to start adding the family')}")   # Entry 196
    # 5. pencils: Simple view rows, Side / Top cards (window.PENW = 30 widens the cards to make room; wings sit left of it)
    P("h:LH-6})})}", "h:LH-6});window.PEN(R,w-34,cy,22,q)})}")
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
    P('__TREENAME__', name if MAIN else 'Our Family Tree', 2)
    P('__TREELINKS__', tree_links(R, 'H.HN.T Paternal Tree', '') if MAIN else tree_links(R, None))
    # 7. the editor
    P('<script src="'+V+'d3.min.js"></script>', ('<style>:root{--req:#F0BC4F}</style>\n' if MAIN else '') + src('dialogs.html') + '\n' + src('editor.html') + '\n' + src('review.html') + '\n' + src('main_extra.html') + '\n<script src="'+V+'d3.min.js"></script>')

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
    # Entry 200: the shared records carry confirmed updates (e.g. Trần, Entry 200) so linking Bà Thương on Minh's page
    # never writes over what the database already holds for the same person
    from build_v2 import v2_tree
    _hp = fold(R, 'hanh-paternal', base(v2_tree(R, 'H.HN.T Paternal Tree')))['people']
    for _i, _r in _people.items():
        _c = _r['src'].split('!', 1)[1]
        if _c in _hp:
            for _k in ('last', 'middle', 'alt', 'adopted', 'god'):
                if _hp[_c].get(_k) not in (None, '', False): _r[_k] = _hp[_c][_k]
    assert len(_people) == 46 and sum(g['n'] for g in LINK['groups']) == 44, (len(_people), [g['n'] for g in LINK['groups']])
    ed = src('editor.js').replace('__VN_GIVEN__', js(given)).replace('__VN_LAST__', js(last)).replace('__LINK__', 'null' if MAIN else js(LINK))
    # Entry 206: every built-in tree (confirmed updates folded in, linked people combined) with shared-record ids, for the
    # editors' page "Same person?" offer — Hạnh's Paternal tree as hp:<cell>, the others keep their own ids (hm:/up:/um:)
    BR = []
    if not MAIN:
        TJ = {k: v for k, v in json.load(open(R/'data/trees.json', encoding='utf-8')).items() if not k.startswith('_') and 'link' in v}
        BB = linked(R, {v['link']: fold(R, v['link'], base(v2_tree(R, k))) for k, v in TJ.items()})
        for k, v in TJ.items():
            b = BB[v['link']]; cv = _id if v['link'] == 'hanh-paternal' else (lambda c: c)
            def tr(n): return {'k': [cv(i) for i in n['k']], 'c': [tr(c) for c in n.get('c', [])], **({'m': cv(n['m'])} if n.get('m') else {})}
            BR.append({'link': v['link'], 'name': v['name'], 'root': tr(b['root']), 'people': {cv(i): p for i, p in b['people'].items()}})
    ed += '\n' + (src('main_extra.js') if MAIN else src('link.js').replace('__BRANCHES__', js(BR)) + '\n' + src('minh_pane.js')) + '\n' + src('search_edit.js')   # Entry 172
    assert t.rstrip().endswith('</script>\n</body>\n</html>'.rstrip()) or t.count('</script>\n</body>') == 1
    P('</script>\n</body>', ed + '\n' + src('review.js') + '\n</script>\n</body>')
    assert '__' + 'TREE__' not in t and '__KIN__' not in t
    # Entry 201 (Hanh): editors build their trees at /FamilyTree/editor/?tree=… ; the old /minh/ link forwards there
    out = R/('index.html' if MAIN else 'editor/index.html'); out.parent.mkdir(exist_ok=True)
    out.write_text(t, encoding='utf-8')
    if not MAIN:
        (R/'minh').mkdir(exist_ok=True)
        (R/'minh/index.html').write_text('''<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><title>Trancestry</title><meta name="viewport" content="width=device-width,initial-scale=1">
<script>location.replace('../editor/'+location.search+location.hash)</script>
<meta http-equiv="refresh" content="0; url=../editor/">
<style>body{background:#121212;color:#bbb;font:15px system-ui,sans-serif;padding:24px}a{color:#e0a92a}</style>
</head><body>The editors' page has moved to <a href="../editor/">/FamilyTree/editor/</a>.</body></html>
''', encoding='utf-8')
    print(out.relative_to(R), len(t)//1024, 'KB;', len(given), 'given names,', len(last), 'family names')

def base(T):
    """Entry 144: Hạnh's tree for the main page's store — boxes keep their sheet cells as ids; Ông / Bà is kept apart as
    a title so the editor's First name holds the name alone."""
    people = {}
    def conv(n):
        for i, c in enumerate(n['k']):
            nm = n['n'][i]; m = re.match(r'^(.*?) \((.*)\)$', nm); first, alt = (m.group(1), m.group(2)) if m else (nm, '')
            tm = re.match(r'^(Ông|Bà) (.+)$', first); title, first = (tm.group(1), tm.group(2)) if tm else ('', first)
            people[c] = {'first': first, 'middle': '', 'last': '', 'alt': alt, 'g': n['g'][i] if n['g'][i] in 'MF' else '?',
                         'dead': (n.get('x') or '')[i:i+1] == '1', **({'title': title} if title else {})}
        d = {'k': list(n['k']), 'c': [conv(c) for c in n.get('c', [])]}
        if n.get('m'): d['m'] = n['m']
        if n.get('s'): d['s'] = 1
        return d
    return {'root': conv(T), 'people': people}

def links(R):
    """Entry 159: data/links.json groups → [{tree: id, …}, …]"""
    f = R/'data/links.json'
    return json.load(open(f, encoding='utf-8'))['groups'] if f.exists() else []

def linked(R, BASES):
    """Entry 159: a linked person's details are combined — the first non-empty value of each field, paternal tree
    first (e.g. a nickname given on one side shows on both)."""
    for g in links(R):
        copies = [(t, i) for t, i in g.items() if t in BASES and i in BASES[t]['people']]
        if len(copies) < 2: continue
        merged = {}
        for t, i in copies:
            for k, v in BASES[t]['people'][i].items():
                if k not in merged or (merged[k] in ('', None, False) and v not in ('', None, False)): merged[k] = v
        for t, i in copies: BASES[t]['people'][i] = dict(merged)
    return BASES

def fold(R, link, B):
    """Entry 156: apply the confirmed updates folded into data/updates.json (same rules as the page's store)."""
    f = R/'data/updates.json'
    if not f.exists(): return B
    def find(n, i, par=None):
        if i in n['k']: return n, par
        for c in n.get('c', []):
            r = find(c, i, n)
            if r: return r
    for u in json.load(open(f, encoding='utf-8'))['updates']:
        for o in u['ops']:
            if o.get('t', 'hanh-paternal') != link: continue
            if o['op'] == 'edit' and o['id'] in B['people']: B['people'][o['id']].update(o.get('set') or {})
            elif o['op'] in ('spouse', 'child') and o['id'] not in B['people']:
                r = find(B['root'], o['to'])
                if not r: continue
                b = r[0]; B['people'][o['id']] = dict(o['person'])
                if o['op'] == 'spouse': b['k'].insert(max(1, min(o['at'], len(b['k']))), o['id'])
                else:
                    c = {'k': [o['id']], 'c': []}
                    if o.get('m') and o['m'] in b['k']: c['m'] = o['m']
                    b.setdefault('c', []).insert(max(0, min(o['at'], len(b['c']))), c)
            elif o['op'] == 'remove':
                r = find(B['root'], o['id'])
                if not r or (r[1] is None and r[0]['k'][0] == o['id']): continue
                b, par = r; i = b['k'].index(o['id'])
                if i > 0:
                    two = len(b['k']) == 2; b['k'].pop(i)
                    if two:
                        for c in b.get('c', []): c.setdefault('m', o['id'])
                elif not b.get('c') and par: par['c'].remove(b)
    return B

if __name__ == '__main__':
    build(pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.'))
