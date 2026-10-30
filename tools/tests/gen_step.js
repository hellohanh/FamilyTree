// Entry 205: Side / Top ‹ › generation pill — the generation stepped to is full size (focal card 325 px on a computer),
// the ladder re-centred; the focal and titles stay; ends disabled; a new focal / reopening starts at the focal's.
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]].filter(([t])=>!process.argv[3]||t===process.argv[3])){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());await ctx.addInitScript(()=>{try{sessionStorage.setItem('hft-splash-seen','1')}catch(e){}});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/');await p.waitForTimeout(6000);
 for(const [v,id] of [['side','pSide'],['top','pTop']]){
  await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1000);
  await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hạnh'&&x.i===0&&/Hậu/.test(x.d.parent.data.n.join()));paintFocal();paneSync()});
  await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(8000);
  const st=()=>p.evaluate(()=>{const lbl=document.getElementById('fgLbl');const big=[...document.querySelectorAll('#fsv g.fc')].map(g=>({n:[...g.querySelectorAll('text')].map(t=>t.textContent).join(' '),w:g.querySelector('rect.hit').getBoundingClientRect().width})).sort((a,b)=>b.w-a.w)[0];
   const foc=[...document.querySelectorAll('#fsv rect[filter]')].map(r=>[...r.parentNode.querySelectorAll('text')].pop().textContent);
   return {lbl:lbl.querySelector('b').textContent+' · '+lbl.querySelector('small').textContent,big:big.n,bw:Math.round(big.w),foc:foc.join(','),prev:document.getElementById('fgPrev').disabled,next:document.getElementById('fgNext').disabled,shown:getComputedStyle(document.getElementById('famGen')).display!=='none'}});
  let a=await st();ok(a.shown&&/Đời Hạnh/.test(a.lbl),`${tag} ${v}: pill shown "${a.lbl}"; largest card ${a.big} ${a.bw}px`);
  await p.click('#fgPrev');await p.waitForTimeout(1200);await p.click('#fgPrev');await p.waitForTimeout(1500);a=await st();
  ok(/Ông Bà Nội/.test(a.lbl)||/Nội/.test(a.lbl),`${tag} ${v}: ‹ ‹ → "${a.lbl}"`);
  ok(/Ông Nội|Bà Nội/.test(a.big)&&(tag==='phone'||Math.abs(a.bw-325)<=2),`${tag} ${v}: grandparents now full size: ${a.big} ${a.bw}px`);
  ok(a.foc==='Hạnh',`${tag} ${v}: Hạnh is still the focal (glow on ${a.foc})`);
  await p.screenshot({path:`${OUT}/gen-${tag}-${v}-grandparents.png`});
  for(let i=0;i<8;i++){if(await p.evaluate(()=>document.getElementById('fgPrev').disabled))break;await p.click('#fgPrev');await p.waitForTimeout(700)}
  a=await st();ok(a.prev&&!a.next,`${tag} ${v}: oldest generation → ‹ disabled ("${a.lbl}")`);
  for(let i=0;i<12;i++){if(await p.evaluate(()=>document.getElementById('fgNext').disabled))break;await p.click('#fgNext');await p.waitForTimeout(700)}
  a=await st();ok(a.next,`${tag} ${v}: youngest → › disabled ("${a.lbl}", largest ${a.big})`);
  await p.screenshot({path:`${OUT}/gen-${tag}-${v}-youngest.png`});
  await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(3000);a=await st();ok(/Đời Hạnh/.test(a.lbl),`${tag} ${v}: reopening starts at the focal's generation`)}
 // Simple: ˄ only — one generation up each time; the focal and titles stay; tapping a child picks a new focal
 await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1000);
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hạnh'&&x.i===0&&/Hậu/.test(x.d.parent.data.n.join()));paintFocal();paneSync()});
 await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(5000);
 const ss=()=>p.evaluate(()=>({lbl:document.getElementById('sgLbl').innerText.replace(/\n/g,' · '),up:!document.getElementById('sgUp').disabled,shown:getComputedStyle(document.getElementById('simGen')).display!=='none',
   top:[...document.querySelectorAll('#ssv g.card')].map(g=>[...g.querySelectorAll('text')].map(t=>t.textContent).join(' ')).join(' | ')}));
 let q=await ss();ok(q.shown&&q.up&&/Đời Hạnh/.test(q.lbl),`${tag} simple: ˄ shown "${q.lbl}"`);
 await p.click('#sgUp');await p.waitForTimeout(2500);q=await ss();ok(/Hậu/.test(q.top)&&/Ba Má|Đời Ba/.test(q.lbl),`${tag} simple: ˄ → ${q.lbl} — ${q.top}`);
 await p.screenshot({path:`${OUT}/gen-${tag}-simple-parents.png`});
 await p.click('#sgUp');await p.waitForTimeout(2500);q=await ss();ok(/Ông Nội|Bà Nội/.test(q.top),`${tag} simple: ˄ ˄ → ${q.lbl} — titles from Hạnh: ${q.top}`);
 await p.screenshot({path:`${OUT}/gen-${tag}-simple-grandparents.png`});
 for(let i=0;i<5&&(await ss()).up;i++){await p.click('#sgUp');await p.waitForTimeout(2000)}q=await ss();ok(!q.up,`${tag} simple: oldest → ˄ disabled (${q.lbl})`);
 await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(3000);q=await ss();ok(/Đời Hạnh/.test(q.lbl),`${tag} simple: reopening starts at the focal's family`);
 ok(errs.length===0,`${tag}: no errors ${errs.join(' | ')}`);await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
