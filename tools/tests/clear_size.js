// Entry 187: Ba & Đỏ keep the same box size with a focal and after Clear focal (Side, Top, Simple)
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const p=await (await b.newContext(vp)).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8766/index.html');await p.waitForFunction(()=>typeof CP!=='undefined',null,{timeout:30000});await p.waitForTimeout(3000);await p.mouse.click(200,300);await p.waitForTimeout(800);
 const ba=await p.evaluate(()=>Object.keys(CP).find(k=>CP[k].nm==='Ba'));
 for(const [v,id,sv] of [['side','pSide','#fsv'],['top','pTop','#fsv'],['simple','pSimple','#ssv']]){
  await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(900);
  await p.evaluate(k=>{FOCAL=CP[k];paintFocal();paneSync()},ba);await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(6000);
  const m=()=>p.evaluate(s=>[...document.querySelectorAll(s+' g.fc, '+s+' g.prow')].filter(G=>/^(Ba|Đỏ)$/.test([...G.querySelectorAll('text')].pop().textContent)).map(G=>{const r=(G.querySelector('rect.hit')).getBoundingClientRect();return [...G.querySelectorAll('text')].pop().textContent+' '+r.width.toFixed(0)+'×'+r.height.toFixed(0)}).join(', '),sv);
  const a=await m();await p.screenshot({path:`${OUT}/ba-${tag}-${v}-focal.png`});
  await p.evaluate(()=>document.getElementById('pClear').click());await p.waitForTimeout(3500);
  const c=await m();await p.screenshot({path:`${OUT}/ba-${tag}-${v}-cleared.png`});console.log(tag,v,'| focal:',a,'| cleared:',c)}
 console.log('errors',errs)}
await b.close()})();
