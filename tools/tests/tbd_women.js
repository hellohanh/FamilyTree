const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1400,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Maternal Tree'));await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>focusByLabel('Vinh & Ngâu'));await p.waitForTimeout(2400);
await p.evaluate(()=>{const n=nodes.filter(d=>d.data.members[0].name==='TBD').pop();const t=d3.zoomTransform(svg.node());});
await p.mouse.move(700,500);for(let i=0;i<12;i++){await p.mouse.wheel(0,400);await p.waitForTimeout(60)}
await p.waitForTimeout(400);await p.screenshot({path:S+'/mock/tbd-women.png'});console.log(errs);await b.close();})();
