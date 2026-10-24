const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const sp of ['a']){
const p=await b.newPage({viewport:{width:1000,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro&sp='+sp);await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);drawArcLabels(1)});await p.waitForTimeout(300);
await p.screenshot({path:S+`/mock/sp-${sp}-whole.png`});
// zoom on Hai's branch
await p.evaluate(()=>{const n=nodes.find(d=>d.data.members[0].cell==='N262');const c=ARC.centroid(n);const W=stage.clientWidth,H=stage.clientHeight,k=2.6;svg.call(zoom.transform,d3.zoomIdentity.translate(W/2-c[0]*k*1.6,H/2-c[1]*k*1.6).scale(k))});
await p.waitForTimeout(300);await p.screenshot({path:S+`/mock/sp-${sp}-zoom.png`});
// eye click on a slice → view changes
const r=await p.evaluate(()=>{const e=[...document.querySelectorAll('g.seye')].find(g=>/Huyền Nhi/.test(g.querySelector('title').textContent));if(!e)return 'none';e.dispatchEvent(new MouseEvent('click',{bubbles:true}));return firstName(VIEW)});
console.log(sp,'eyes:',await p.evaluate(()=>document.querySelectorAll('g.seye').length),'after eye click VIEW=',r,errs);await p.close();}
await b.close();})();
