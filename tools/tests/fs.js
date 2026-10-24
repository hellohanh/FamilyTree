const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const fs of [11,13,15,17]){const p=await b.newPage({viewport:{width:600,height:600}});
await p.goto('file://'+S+'/mock/family-tree.html?nointro&fs='+fs);await p.waitForFunction(()=>window.__ready);
const info=await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);drawArcLabels(1);
 const n=nodes.find(d=>d.data.members[0].name==='Hậu'&&d.depth===2);const c=ARC.centroid(n);const W=stage.clientWidth,H=stage.clientHeight;
 svg.call(zoom.transform,d3.zoomIdentity.translate(W/2-c[0],H/2-c[1]).scale(1));return (RING/110).toFixed(2)});
await p.waitForTimeout(250);await p.screenshot({path:S+`/mock/fs-${fs}.png`,clip:{x:0,y:72,width:600,height:528}});
await p.evaluate(()=>svg.call(zoom.transform,fitT(sunBox())));await p.waitForTimeout(150);await p.screenshot({path:S+`/mock/fsw-${fs}.png`,clip:{x:0,y:72,width:600,height:528}});
console.log(fs,'wheel ×'+info);await p.close();}
await b.close();})();
