const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);drawArcLabels(1)});await p.waitForTimeout(300);
await p.screenshot({path:S+'/mock/d2-1.png'});
// zoom in 2.5x on mouse position
await p.evaluate(()=>{svg.call(zoom.scaleBy,2.5,[900,500])});await p.waitForTimeout(500);await p.screenshot({path:S+'/mock/d2-2.png'});
await p.evaluate(()=>{svg.call(zoom.transform,sunT())});await p.waitForTimeout(300);
await p.click('#snapB');await p.waitForTimeout(900);await p.screenshot({path:S+'/mock/d2-3.png'});
await p.click('#genNext');await p.waitForTimeout(900);await p.screenshot({path:S+'/mock/d2-4.png'});
console.log(await p.evaluate(()=>document.querySelectorAll('g.plabel').length),errs);await b.close();})();
