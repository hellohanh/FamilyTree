// Entry 192: The Multiverse — instructions panel beside the tree list (collapse / expand, remembered), phones "How to";
// the stack keeps turning and picks up again RESUME ms after any interaction (unless Turn: off).
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/3d/');await p.waitForTimeout(4000);
 await p.click('#go').catch(()=>{});await p.waitForTimeout(800);if(await p.evaluate(()=>document.getElementById('ordDlg').classList.contains('on')))await p.click('#ordOK');await p.waitForTimeout(3500);
 const th=()=>p.evaluate(()=>th);
 if(tag==='desktop'){
  const r=await p.evaluate(()=>({how:document.getElementById('how').getBoundingClientRect().left,stage:document.getElementById('stage').getBoundingClientRect().left,cv:document.getElementById('cv').width}));
  ok(r.how===280&&r.stage===530,`desktop: panel at 280, 3D starts at ${r.stage}`);
  await p.click('#howT');await p.waitForTimeout(700);
  const r2=await p.evaluate(()=>({stage:document.getElementById('stage').getBoundingClientRect().left,w:document.getElementById('cv').getBoundingClientRect().width}));
  ok(await p.evaluate(()=>document.getElementById('howT').textContent)==='›','desktop collapsed: toggle shows ›');
  ok(r2.stage===324,`desktop collapsed: 3D starts at ${r2.stage}, canvas ${r2.w}px wide`);
  await p.screenshot({path:`${OUT}/how-desktop-shut.png`});
  await p.reload();await p.waitForTimeout(4000);ok(await p.evaluate(()=>document.body.classList.contains('howShut')&&document.getElementById('howT').textContent==='›'),'desktop: collapsed is remembered after reload');
  await p.click('#howT');await p.waitForTimeout(600);ok(await p.evaluate(()=>!document.body.classList.contains('howShut')),'desktop: expand from the strip');
  await p.click('#go');await p.waitForTimeout(800);if(await p.evaluate(()=>document.getElementById('ordDlg').classList.contains('on')))await p.click('#ordOK');await p.waitForTimeout(3500);await p.screenshot({path:`${OUT}/how-desktop-open.png`});
  // turning: drag → stays put while held and for ~2 s after, then picks up again; Turn: off keeps it off
  const a0=await th();await p.waitForTimeout(500);ok(await th()>a0,'turning on its own');
  await p.mouse.move(900,500);await p.mouse.down();await p.mouse.move(960,500,{steps:5});const a1=await th();await p.waitForTimeout(800);const a2=await th();ok(Math.abs(a2-a1)<1e-6,'held: no turning while dragging');
  await p.mouse.up();await p.waitForTimeout(1000);const a3=await th();await p.waitForTimeout(500);const a4=await th();ok(Math.abs(a4-a3)<1e-6,'1–1.5 s after letting go: still paused');
  await p.waitForTimeout(1200);const a5=await th();await p.waitForTimeout(500);ok(await th()>a5,'about 2 s after letting go: turning again');
  ok(await p.evaluate(()=>document.getElementById('spinB').textContent)==='Turn: on','button still says Turn: on');
  await p.mouse.wheel(0,-100);const z1=await th();await p.waitForTimeout(600);ok(Math.abs(await th()-z1)<1e-6,'scroll-zoom pauses it too');await p.waitForTimeout(2200);const z2=await th();await p.waitForTimeout(400);ok(await th()>z2,'…and it picks up again');
  await p.click('#spinB');await p.mouse.move(900,500);await p.mouse.down();await p.mouse.up();await p.waitForTimeout(3000);const o1=await th();await p.waitForTimeout(500);ok(Math.abs(await th()-o1)<1e-6,'Turn: off stays off after an interaction');
 }else{
  await p.screenshot({path:`${OUT}/how-phone.png`});
  await p.evaluate(()=>document.body.classList.remove('picking'));await p.click('#howBtn');await p.waitForTimeout(600);await p.screenshot({path:`${OUT}/how-phone-open.png`});
  ok(await p.evaluate(()=>document.getElementById('how').getBoundingClientRect().top>=0),'phone: How to opens');
  await p.click('#pickBtn');await p.waitForTimeout(600);ok(await p.evaluate(()=>!document.body.classList.contains('howOpen')&&document.body.classList.contains('picking')),'phone: Trees closes How to');
 }
 ok(errs.length===0,`${tag}: no errors ${errs.join(' | ')}`);await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
