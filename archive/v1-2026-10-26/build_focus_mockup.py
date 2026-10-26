import base64,sys
S=sys.argv[1]
t=open(S+"/mock/focus.template.html",encoding="utf-8").read()
w="data:image/png;base64,"+base64.b64encode(open(S+"/wings_marigold.png","rb").read()).decode()
for k,v in {"__D3__":open(S+"/npm/node_modules/d3/dist/d3.min.js",encoding="utf-8").read(),
            "__FLUBBER__":open(S+"/npm/node_modules/flubber/build/flubber.min.js",encoding="utf-8").read(),
            "__WINGS__":w,"__DATA__":open(S+"/tree.json",encoding="utf-8").read()}.items():
    t=t.replace(k,v)
ff=""
for w,fn in ((400,"segoeui"),(700,"segoeuib")):
    b64=base64.b64encode(open(S+"/fonts/"+fn+".woff2","rb").read()).decode()
    ff+="@font-face{font-family:'HFT Segoe';font-weight:%d;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}\n"%(w,b64)
t=t.replace("__FONTS__",ff)
t=t.replace("__THREE__",open(S+"/npm/node_modules/three/build/three.min.js",encoding="utf-8").read())
for i in (1,2): t=t.replace("__INTRO%d__"%i,"data:image/webp;base64,"+base64.b64encode(open(S+"/intro/splash%d.webp"%i,"rb").read()).decode())
open(S+"/mock/family-tree.html","w",encoding="utf-8").write(t)
