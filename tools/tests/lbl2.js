const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const m of ['fixed','fit','screen']) for(const k of [0.25,0.5]){
 const p=await b.newPage({viewport:{width:640,height:560}});
 await p.goto('file://'+S+'/mock/family-tree.html?nointro&lbl='+m);await p.waitForFunction(()=>window.__ready);
 await p.evaluate(k=>{const n=nodes.find(d=>/^Hợp/.test(d.data.members[0].name));const c=ARC.centroid(n);const W=stage.clientWidth,H=stage.clientHeight;
   svg.call(zoom.transform,d3.zoomIdentity.translate(W/2-c[0]*k,H/2-c[1]*k).scale(k));drawArcLabels(1)},k);
 await p.waitForTimeout(300);await p.screenshot({path:S+`/mock/l2-${m}-${k}.png`,clip:{x:0,y:72,width:640,height:488}});await p.close();}
await b.close();})();
