"""Builds the live page: index.html (repo root) from mockups/sunburst-focus.template.html.
Same page as the mockup, except the tree data is NOT embedded: the page loads data/tree.json (Entry 30/33, Hanh:
separate data file). d3, flubber, fonts, wings and splash pictures are still embedded, so index.html + data/tree.json
are the whole site.   Usage: python3 tools/build_index.py <repo root> <scratch dir with npm/node_modules>"""
import base64, sys, re
R, S = sys.argv[1], sys.argv[2]
t = open(R + "/mockups/sunburst-focus.template.html", encoding="utf-8").read()
b64 = lambda p: base64.b64encode(open(p, "rb").read()).decode()
for k, v in {"__D3__": open(S + "/npm/node_modules/d3/dist/d3.min.js", encoding="utf-8").read(),
             "__FLUBBER__": open(S + "/npm/node_modules/flubber/build/flubber.min.js", encoding="utf-8").read(),
             "__WINGS__": "data:image/png;base64," + b64(R + "/assets/wings_marigold.png")}.items():
    t = t.replace(k, v)
ff = "".join("@font-face{font-family:'HFT Segoe';font-weight:%d;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n"
             % (w, b64(R + "/fonts/" + fn + ".woff2")) for w, fn in ((400, "segoeui"), (700, "segoeuib")))
t = t.replace("__FONTS__", ff)
for i in (1, 2):
    t = t.replace("__INTRO%d__" % i, "data:image/webp;base64," + b64(R + "/assets/splash%d.webp" % i))
# split the main script: the intro runs at once; the rest waits for data/tree.json
a = t.index("<script>\nconst DATA = __DATA__")
z = t.index("</script>", a)
main = t[a + len("<script>\n"):z]
i0 = main.index("// Entry 32: intro splash"); i1 = main.index("})();", i0) + len("})();")
intro, main = main[i0:i1], main[:i0] + main[i1:]
main = main.replace("const DATA = __DATA__,", "const DATA = TREE,", 1)
loader = """<script>%s</script>
<script>
// Entry 33: the live page reads its data from data/tree.json (the file Hanh's "Export changes" replaces).
fetch('data/tree.json',{cache:'no-cache'}).then(r=>{ if(!r.ok) throw new Error('HTTP '+r.status); return r.json() }).then(TREE=>{
%s
}).catch(e=>{ document.getElementById('stage').innerHTML='<div style="padding:40px;color:#c6c6c6;font-size:15px;line-height:1.6">The family data (data/tree.json) could not be loaded.<br>'+(location.protocol==='file:'?'This page has to be opened from the website, not from a file on disk.':'Error: '+e.message)+'</div>'; const i=document.getElementById('intro'); if(i) i.remove() });
</script>""" % (intro, main)
t = t[:a] + loader + t[z + len("</script>"):]
assert "__" + "DATA__" not in t and "__INTRO" not in t
open(R + "/index.html", "w", encoding="utf-8").write(t)
print("index.html", len(t) // 1024, "KB")
