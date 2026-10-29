// Entry 194: the focal glows (breathing halo, 2.4 s) in every view — wheel segment, centre border, Side, Top, Simple;
// only the focal has the glow; screenshots frozen at the brightest (1.2 s) and dimmest (0 s) moments.
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]].filter(([t])=>!process.argv[3]||t===process.argv[3])){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(6000);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000);
 const freeze=(sel,t)=>p.evaluate(([s,t])=>{const e=document.querySelector(s);e.pauseAnimations();e.setCurrentTime(t)},[sel,t]);
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hậu');paintFocal();paneSync()});await p.waitForTimeout(600);
 let n=await p.evaluate(()=>[...document.querySelectorAll('#sv path[filter]')].length);ok(n===1,`${tag} wheel: one glowing segment (${n})`);
 ok(await p.evaluate(()=>!!document.querySelector('#glowW animate')),`${tag} wheel: halo animates`);
 await freeze('#sv',1.2);await p.screenshot({path:`${OUT}/glow-${tag}-wheel-bright.png`});await freeze('#sv',0);await p.screenshot({path:`${OUT}/glow-${tag}-wheel-dim.png`});
 await p.evaluate(()=>document.getElementById('sv').unpauseAnimations());
 for(const [v,id,sv] of [['side','pSide','#fsv'],['top','pTop','#fsv'],['simple','pSimple','#ssv']]){
  await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(6500);
  n=await p.evaluate(s=>[...document.querySelectorAll(s+' rect[filter]')].map(r=>[...r.parentNode.querySelectorAll('text')].pop().textContent),sv);
  ok(n.length===1&&n[0]==='Hậu',`${tag} ${v}: only the focal glows (${n.join(',')})`);
  await freeze(sv,1.2);await p.screenshot({path:`${OUT}/glow-${tag}-${v}-bright.png`});await freeze(sv,0);await p.screenshot({path:`${OUT}/glow-${tag}-${v}-dim.png`});
  await p.evaluate(s=>document.querySelector(s).unpauseAnimations(),sv);
  await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1500)}
 // clear focal → no glow anywhere
 await p.evaluate(()=>document.getElementById('pClear').click());await p.waitForTimeout(800);
 ok(await p.evaluate(()=>document.querySelectorAll('#sv [filter]').length===0),`${tag}: Clear focal → no glow`);
 // centre person as focal → the centre border glows
 await p.evaluate(()=>{FOCAL=ROOTP[0];paintFocal();paneSync()});await p.waitForTimeout(500);
 ok(await p.evaluate(()=>!!document.querySelector('#sv rect[filter]')),`${tag}: Ông Cố as focal → centre border glows`);
 await freeze('#sv',1.2);await p.screenshot({path:`${OUT}/glow-${tag}-centre-bright.png`});
 ok(errs.length===0,`${tag}: no errors ${errs.join(' | ')}`);await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
