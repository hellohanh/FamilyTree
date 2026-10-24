const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},hasTouch:true,isMobile:true,deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
// zoom so Huyền Nhi's label is on screen, get its centre
const pt=async name=>p.evaluate(n=>{const g=[...document.querySelectorAll('g.plabel')].find(g=>g.textContent.includes(n));const r=g.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]},name);
await p.evaluate(()=>{const n=nodes.find(d=>d.data.members[0].name==='Huyền Nhi');const c=ARC.centroid(n);const W=stage.clientWidth,H=stage.clientHeight;svg.call(zoom.transform,d3.zoomIdentity.translate(W/2-c[0]*.8,H/2-c[1]*.8).scale(.8))});
await p.waitForTimeout(300);
let [x,y]=await pt('Huyền Nhi');
await p.touchscreen.tap(x,y);await p.waitForTimeout(80);await p.touchscreen.tap(x,y);await p.waitForTimeout(600);
const after2=await p.evaluate(()=>({mode,view:VIEW&&firstName(VIEW)}));
await p.screenshot({path:S+'/mock/dtap-double.png'});
[x,y]=await pt('Huyền Nhi');
await p.touchscreen.tap(x,y);await p.waitForTimeout(2800);
const after1=await p.evaluate(()=>({mode,focus:focusNode&&label(focusNode.data)}));
await p.screenshot({path:S+'/mock/dtap-single.png'});
console.log('double-tap →',JSON.stringify(after2),'| single tap →',JSON.stringify(after1),errs);await b.close();})();
