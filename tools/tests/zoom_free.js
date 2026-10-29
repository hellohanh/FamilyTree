// Entry 191: the + / − buttons have no limit on any view (whole wheel, snapped, Side, Top, Simple, The Multiverse);
// pinch / Ctrl + scroll keep their old range but never snap back from beyond it.
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
const press=async(p,id,n)=>{for(let i=0;i<n;i++){await p.evaluate(x=>document.getElementById(x).click(),id);await p.waitForTimeout(25)}await p.waitForTimeout(500)};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(6000);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000);
 // whole wheel: old range 0.8×–4× of the fitted size
 const base=await p.evaluate(()=>wholeV().k);
 await press(p,'zIn',30);let r=await p.evaluate(()=>V.k/wholeV().k);ok(r>4.5,`${tag} whole wheel: + ×30 → ${r.toFixed(2)}× (was capped at 4×)`);
 if(tag==='desktop'){await p.mouse.move(800,450);await p.keyboard.down('Control');await p.mouse.wheel(0,-60);await p.keyboard.up('Control');await p.waitForTimeout(300);
  const r2=await p.evaluate(()=>V.k/wholeV().k);ok(r2>=r-1e-6,`${tag} whole wheel: Ctrl+scroll in after that keeps ${r2.toFixed(2)}× (no snap back)`)}
 await press(p,'zOut',60);r=await p.evaluate(()=>V.k/wholeV().k);ok(r<.7,`${tag} whole wheel: − ×60 → ${r.toFixed(3)}× (was stopped at 0.8×)`);
 await p.screenshot({path:`${OUT}/zoom-${tag}-wheel-out.png`});
 await press(p,'zIn',Math.round(Math.log(1/r)/Math.log(1.1)));
 // snapped: old range ½×–4× of the snapped size
 await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Hậu');const d=q.d;snapTo((((d.a0??d.x0??0)+(d.a1??d.x1??0))/2%TAU+TAU)%TAU,d.depth)});await p.waitForTimeout(2500);
 if(await p.evaluate(()=>!!SNAP)){
  await press(p,'zIn',20);r=await p.evaluate(()=>V.k/snapV(TH,RING,V.rot).k);ok(r>4.5,`${tag} snapped: + ×20 → ${r.toFixed(2)}× (was capped at 4×)`);
  await press(p,'zOut',40);r=await p.evaluate(()=>V.k/snapV(TH,RING,V.rot).k);ok(r<.45,`${tag} snapped: − ×40 → ${r.toFixed(3)}× (was stopped at ½×)`);
  await p.screenshot({path:`${OUT}/zoom-${tag}-snapped-out.png`});
 }else ok(false,`${tag} snapped: could not snap`);
 // Side / Top: old range 0.15×–4× (the view's own scale)
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hậu');paintFocal();paneSync()});
 for(const [v,id] of [['side','pSide'],['top','pTop']]){
  await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(6000);
  const k=()=>p.evaluate(()=>{const t=document.querySelector('#fsv > g').getAttribute('transform')||'';const m=/scale\(([\d.e-]+)/.exec(t);return m?+m[1]:1});
  const k0=await k();await press(p,'zIn',40);await p.waitForTimeout(400);let kk=await k();
  ok(kk>4&&Math.abs(kk/(k0*Math.pow(1.1,40))-1)<.02,`${tag} ${v}: opened at ${k0.toFixed(3)}, + ×40 → scale ${kk.toFixed(2)} (expected ${(k0*Math.pow(1.1,40)).toFixed(2)}; was capped at 4)`);
  if(tag==='desktop'){await p.mouse.move(900,500);await p.keyboard.down('Control');await p.mouse.wheel(0,-40);await p.keyboard.up('Control');await p.waitForTimeout(400);
   const k2=await k();ok(k2>=kk*0.999,`${tag} ${v}: Ctrl+scroll after that keeps ${k2.toFixed(2)} (no snap back)`)}
  const k1=await k();await press(p,'zOut',80);await p.waitForTimeout(400);kk=await k();ok(kk<.15&&Math.abs(kk/(k1*Math.pow(1.1,-80))-1)<.02,`${tag} ${v}: − ×80 → scale ${kk.toFixed(4)} (expected ${(k1*Math.pow(1.1,-80)).toFixed(4)}; was stopped at 0.15)`);
  await press(p,'zIn',40);
  await p.screenshot({path:`${OUT}/zoom-${tag}-${v}-out.png`});
  await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1500)}
 // Simple: old range ½×–3× of the fitted size
 await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(5000);
 const w0=await p.evaluate(()=>window.UZS);
 await press(p,'zIn',20);let u=await p.evaluate(()=>window.UZS);ok(u>3.1,`${tag} simple: + ×20 → ${u.toFixed(2)}× (was capped at 3×)`);
 await press(p,'zOut',40);u=await p.evaluate(()=>window.UZS);ok(u<.45,`${tag} simple: − ×40 → ${u.toFixed(3)}× (was stopped at ½×)`);
 await p.screenshot({path:`${OUT}/zoom-${tag}-simple-out.png`});
 ok(errs.length===0,`${tag} main page: no errors ${errs.join(' | ')}`);
 // The Multiverse: old camera distance 3–60
 const q=await ctx.newPage();const e3=[];q.on('pageerror',e=>e3.push(e.message));
 await q.goto('http://localhost:8765/3d/');await q.waitForTimeout(5000);
 const hasDist=await q.evaluate(()=>{try{return typeof dist==='number'}catch(e){return false}});
 if(hasDist){await q.evaluate(()=>{try{show()}catch(e){}});await q.waitForTimeout(2500);
  await press(q,'zIn',60);let d=await q.evaluate(()=>dist);ok(d<3,`${tag} multiverse: + ×60 → distance ${d.toFixed(2)} (was stopped at 3)`);
  if(tag==='desktop'){await q.mouse.move(700,450);await q.mouse.wheel(0,-50);await q.waitForTimeout(300);const d2=await q.evaluate(()=>dist);ok(d2<=d*1.0001,`${tag} multiverse: scroll in after that keeps ${d2.toFixed(2)} (no snap back)`)}
  await press(q,'zOut',90);d=await q.evaluate(()=>dist);ok(d>60,`${tag} multiverse: − ×90 → distance ${d.toFixed(1)} (was capped at 60)`);
  await q.screenshot({path:`${OUT}/zoom-${tag}-3d-out.png`});
 }else ok(false,`${tag} multiverse: camera distance not reachable from the test`);
 ok(e3.length===0,`${tag} multiverse: no errors ${e3.join(' | ')}`);
 await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
