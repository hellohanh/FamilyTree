import base64,sys
S=sys.argv[1]
t=open(S+"/mock/template.html",encoding="utf-8").read()
w="data:image/png;base64,"+base64.b64encode(open(S+"/render/imgs/xl/media/image2.png","rb").read()).decode()
t=t.replace("__D3__",open(S+"/npm/node_modules/d3/dist/d3.min.js",encoding="utf-8").read()).replace("__WINGS__",w).replace("__DATA__",open(S+"/tree.json",encoding="utf-8").read())
open(S+"/mock/layouts.html","w",encoding="utf-8").write(t)
