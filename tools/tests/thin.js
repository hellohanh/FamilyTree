const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:900,height:700}});
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);drawArcLabels(1);
 const n=nodes.find(d=>/^Hân/.test(d.data.members[0].name));const c=ARC.centroid(n);const W=stage.clientWidth,H=stage.clientHeight,k=2.2;svg.call(zoom.transform,d3.zoomIdentity.translate(W/2-c[0]*k,H/2-c[1]*k).scale(k))});
await p.waitForTimeout(300);await p.screenshot({path:S+'/mock/thin.png',clip:{x:0,y:72,width:900,height:628}});
await p.evaluate(()=>{svg.call(zoom.transform,fitT(sunBox()))});await p.waitForTimeout(200);await p.screenshot({path:S+'/mock/thin-whole.png',clip:{x:0,y:72,width:900,height:628}});
await b.close();})();
