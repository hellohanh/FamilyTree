const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},hasTouch:true,isMobile:true,deviceScaleFactor:2});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
await p.tap('#snapB');await p.waitForTimeout(600);
const lbl=()=>p.evaluate(()=>document.getElementById('genLbl').innerText.replace(/\n/g,' · '));
const out=['no view: '+await lbl()];
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);drawArcLabels(1)});
for(let i=0;i<4;i++){ out.push('Hạnh g'+await p.evaluate(()=>SNAPG)+': '+await lbl()); await p.tap('#genNext').catch(()=>{}); await p.waitForTimeout(500) }
await p.evaluate(()=>{SNAPG=1;setView([...MEMBER_NODE.keys()].find(m=>m.name==='Sydney'),true);snapGo()});await p.waitForTimeout(600);
for(let i=0;i<4;i++){ out.push('Sydney g'+await p.evaluate(()=>SNAPG)+': '+await lbl()); if(i===1) await p.screenshot({path:S+'/mock/pill.png'}); await p.tap('#genNext').catch(()=>{}); await p.waitForTimeout(500) }
console.log(out.join('\n'),errs);await b.close();})();
