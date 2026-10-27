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
P('const T=__TREE__, KIN=__KIN__;', src('kin.js') + '\n' + src('store.js') + '\nlet T=MINH.tree(), KIN=buildKin(T);')
# 3. after a save the page comes back without the splash
P('(function splash(){', "(function splash(){if(MINH.restore){document.getElementById('splash').remove();return}")
# 4. an empty wheel (only Thương's parents): a tap opens the Simple view to start adding people
P("if(!SNAP){const ring=", "if(!P.length){$('pSimple').click();return}if(!SNAP){const ring=")
P(":'Tap anywhere on the wheel'}", ":(P.length?'Tap anywhere on the wheel':'Tap to start adding the family')}")
# 5. pencils: Simple view rows, Side / Top cards (cards widen by 30 to make room)
P("+W(q.nm,FSC,q===VF()?700:400)+16};", "+W(q.nm,FSC,q===VF()?700:400)+16+30};")
P(".text(fit(q.nm,f,w-x0-12,q===VF()?700:400))})}", ".text(fit(q.nm,f,w-x0-42,q===VF()?700:400));window.PEN(R,w-34,cy,22,q)})}")
P("+W(q.nm,FS,q===VF()?700:400)+16};", "+W(q.nm,FS,q===VF()?700:400)+16+30};")
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
# 7. the editor
P('<script src="../v2/d3.min.js"></script>', src('editor.html') + '\n<script src="../v2/d3.min.js"></script>')
ed = src('editor.js').replace('__VN_GIVEN__', js(given)).replace('__VN_LAST__', js(last))
assert t.rstrip().endswith('</script>\n</body>\n</html>'.rstrip()) or t.count('</script>\n</body>') == 1
P('</script>\n</body>', ed + '\n</script>\n</body>')
assert '__' + 'TREE__' not in t and '__KIN__' not in t
(R/'minh').mkdir(exist_ok=True)
(R/'minh/index.html').write_text(t, encoding='utf-8')
print('minh/index.html', len(t)//1024, 'KB;', len(given), 'given names,', len(last), 'family names')
