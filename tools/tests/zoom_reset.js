// Entry 195: ⟲ between + and − puts each view back at its default zoom (greyed when already there) — whole wheel,
// snapped, Side, Top, Simple, The Multiverse; on-screen size of the focal's name / card measured before and after.
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
const press=async(p,id,n)=>{for(let i=0;i<n;i++){await p.evaluate(x=>document.getElementById(x).click(),id);await p.waitForTimeout(30)}await p.waitForTimeout(900)};
const at=p=>p.evaluate(()=>document.getElementById('zReset').classList.contains('at'));
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]].filter(([t])=>!process.argv[3]||t===process.argv[3])){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(6000);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000);
 const order=await p.evaluate(()=>[...document.querySelectorAll('#zoomUI button')].map(b=>b.textContent).join(' '));ok(order==='+ ⟲ −',`${tag}: buttons ${order}`);
 // whole wheel
 const k=()=>p.evaluate(()=>V.k/wholeV().k);ok(await at(p)&&Math.abs(await k()-1)<.002,`${tag} wheel: starts at default, ⟲ greyed`);
 await press(p,'zIn',6);ok(!await at(p),`${tag} wheel: after + ×6 (${(await k()).toFixed(2)}×) ⟲ is active`);
 const rot0=await p.evaluate(()=>V.rot);await press(p,'zReset',1);ok(Math.abs(await k()-1)<.002&&await at(p)&&await p.evaluate(()=>V.rot)===rot0,`${tag} wheel: ⟲ → ${(await k()).toFixed(3)}×, greyed, rotation kept`);
 // snapped
 await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Hậu');FOCAL=q;paintFocal();paneSync();const d=q.d;snapTo((((d.a0??d.x0??0)+(d.a1??d.x1??0))/2%TAU+TAU)%TAU,d.depth)});await p.waitForTimeout(1500);
 const ks=()=>p.evaluate(()=>V.k/snapV(TH,RING,V.rot).k);ok(await at(p),`${tag} snapped: starts at default`);
 await press(p,'zOut',5);ok(!await at(p),`${tag} snapped: after − ×5 (${(await ks()).toFixed(2)}×) ⟲ active`);
 await press(p,'zReset',1);ok(Math.abs(await ks()-1)<.01&&await at(p),`${tag} snapped: ⟲ → ${(await ks()).toFixed(3)}×`);
 await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1500);
 // Side / Top / Simple: the focal card's on-screen width and name font size
 for(const [v,id,sv] of [['side','pSide','#fsv'],['top','pTop','#fsv'],['simple','pSimple','#ssv']]){
  await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(6500);
  const m=()=>p.evaluate(s=>{const g=[...document.querySelectorAll(s+' g.fc, '+s+' g.card')].find(G=>[...G.querySelectorAll('text')].some(t=>t.textContent==='Hậu'));const t=[...g.querySelectorAll('text')].find(t=>t.textContent==='Hậu');
   return {w:Math.round(g.querySelector('rect').getBoundingClientRect().width),fs:+(t.getBoundingClientRect().height).toFixed(1)}},sv);
  const m0=await m();ok(await at(p),`${tag} ${v}: opens at default (card ${m0.w}px, name ${m0.fs}px tall)`);
  await press(p,'zIn',7);const m1=await m();ok(!await at(p)&&m1.w>m0.w,`${tag} ${v}: + ×7 → card ${m1.w}px`);
  await press(p,'zReset',1);await p.waitForTimeout(400);const m2=await m();ok(await at(p)&&Math.abs(m2.w-m0.w)<=1&&Math.abs(m2.fs-m0.fs)<.2,`${tag} ${v}: ⟲ → card ${m2.w}px, name ${m2.fs}px (default ${m0.w} / ${m0.fs})`);
  if(v==='side')await p.screenshot({path:`${OUT}/reset-${tag}-side.png`});
  await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1500)}
 ok(errs.length===0,`${tag} main page: no errors ${errs.join(' | ')}`);
 // The Multiverse
 const q=await ctx.newPage();const e3=[];q.on('pageerror',e=>e3.push(e.message));await q.goto('http://localhost:8765/3d/');await q.waitForTimeout(3500);
 if(tag==='phone'){await q.click('#pickBtn');await q.waitForTimeout(400)}await q.click('#go');await q.waitForTimeout(800);if(await q.evaluate(()=>document.getElementById('ordDlg').classList.contains('on')))await q.click('#ordOK');await q.waitForTimeout(3000);
 const d0=await q.evaluate(()=>dist);ok(await q.evaluate(()=>document.getElementById('zReset').classList.contains('at')),`${tag} multiverse: starts at default (distance ${d0.toFixed(1)})`);
 await press(q,'zIn',8);ok(!await q.evaluate(()=>document.getElementById('zReset').classList.contains('at')),`${tag} multiverse: + ×8 → ${(await q.evaluate(()=>dist)).toFixed(1)}`);
 await press(q,'zReset',1);const d2=await q.evaluate(()=>dist);ok(Math.abs(d2-d0)<.01&&await q.evaluate(()=>document.getElementById('zReset').classList.contains('at')),`${tag} multiverse: ⟲ → ${d2.toFixed(1)}`);
 await q.screenshot({path:`${OUT}/reset-${tag}-3d.png`});ok(e3.length===0,`${tag} multiverse: no errors ${e3.join(' | ')}`);
 await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
