const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1100}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>{const n=nodes.find(d=>d.data.members[0].cell==='N262');focus(n)});await p.waitForTimeout(2500);
await p.screenshot({path:S+'/mock/hai-1.png'});
// zoomed out whole
await p.evaluate(()=>{const n=nodes.find(d=>d.data.members[0].cell==='N262');zoom.translateExtent([[-1e5,-1e5],[1e5,1e5]]);svg.call(zoom.transform,d3.zoomIdentity.translate(250,550).scale(0.28))});await p.waitForTimeout(300);
await p.screenshot({path:S+'/mock/hai-2.png'});
// Hạnh's view
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.cell==='W170'||(m.name==='Hạnh')),true);const n=nodes.find(d=>d.data.members[0].cell==='N262');focus(n)});await p.waitForTimeout(2500);
await p.screenshot({path:S+'/mock/hai-3.png'});
const t=await p.evaluate(()=>[...document.querySelectorAll('g.card > text')].map(t=>t.textContent).filter(Boolean).slice(0,40).join(' | '));
console.log(t,errs);await b.close();})();
