// Entry 220: zoomed-in generation bands — one chip (‹ generation › | whole-wheel) beside the zoom buttons, bottom right,
// computer and phone; it works (› / ‹ change rings, the wheel button goes back to the whole wheel); hidden on the whole
// wheel and in Simple / Side / Top. Usage: node gen_chip.js OUT
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());await ctx.addInitScript(()=>{sessionStorage.setItem('hft-splash-seen','1')});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/');await p.waitForTimeout(6000);
  ok(await p.evaluate(()=>getComputedStyle(document.getElementById('genNav')).display==='none'),`${tag}: whole wheel — no chip`);
  await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Hậu');const th=(((q.a0+q.a1)/2)%TAU+TAU)%TAU;snapTo(th,2)});await p.waitForTimeout(2500);
  const box=i=>p.evaluate(i=>{const r=document.getElementById(i).getBoundingClientRect();return {l:r.left,t:r.top,r:r.right,b:r.bottom}},i);
  const G=await box('genNav'),W=await box('whole'),Z=await box('zoomUI'),R=await box('rotRail'),V=await p.evaluate(()=>innerWidth);
  ok(W.l>=G.l&&W.r<=G.r&&W.t>=G.t&&W.b<=G.b,`${tag}: the whole-wheel button is inside the chip`);
  ok(Math.abs((V-16)-G.r)<2&&G.b<=await p.evaluate(()=>innerHeight)-15,`${tag}: chip at the bottom right (right edge ${Math.round(G.r)} of ${V})`);
  ok(Z.b<=G.t&&Math.abs(Z.r-G.r)<2&&R.b<=Z.t,`${tag}: rail and zoom buttons stacked right above it, nothing overlaps (zoom ${Math.round(Z.t)}–${Math.round(Z.b)}, chip ${Math.round(G.t)}–${Math.round(G.b)})`);
  await p.screenshot({path:`${OUT}/chip-${tag}.png`});
  const l0=await p.evaluate(()=>document.getElementById('genLbl').textContent);await p.evaluate(()=>document.getElementById('next').click());await p.waitForTimeout(1500);
  const l1=await p.evaluate(()=>document.getElementById('genLbl').textContent);ok(l1!==l0,`${tag}: › → "${l1}" (was "${l0}")`);
  await p.evaluate(()=>document.getElementById('whole').click());await p.waitForTimeout(2000);
  ok(await p.evaluate(()=>!SNAP&&getComputedStyle(document.getElementById('genNav')).display==='none'),`${tag}: the wheel button → back to the whole wheel, chip gone`);
  ok(!errs.length,`${tag}: no page errors ${errs.join('|')}`);await ctx.close()}
 await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
