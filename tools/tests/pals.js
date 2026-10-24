const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const pal of ['branch']){
const p=await b.newPage({viewport:{width:900,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro&pal='+pal);await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);drawArcLabels(1)});await p.waitForTimeout(250);
await p.screenshot({path:S+`/mock/pal-${pal}-whole.png`,clip:{x:0,y:72,width:900,height:828}});
await p.evaluate(()=>{const n=nodes.find(d=>d.data.members[0].cell==='N262');const c=ARC.centroid(n);const W=stage.clientWidth,H=stage.clientHeight,k=2.4;svg.call(zoom.transform,d3.zoomIdentity.translate(W/2-c[0]*k*1.6,H/2-c[1]*k*1.6).scale(k))});
await p.waitForTimeout(250);await p.screenshot({path:S+`/mock/pal-${pal}-zoom.png`,clip:{x:0,y:72,width:900,height:828}});
if(pal==='branch'){ // name click test
 const r=await p.evaluate(()=>{const t=[...document.querySelectorAll('g.plabel')].find(t=>/Huyền Nhi/.test(t.textContent));t.dispatchEvent(new MouseEvent('click',{bubbles:true}));return firstName(VIEW)+' mode='+mode});
 console.log('name click →',r);}
console.log(pal,errs);await p.close();}
await b.close();})();
