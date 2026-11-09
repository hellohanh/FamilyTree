// Entry 237 (Hanh: "why does the wheel stop here; there's one more generation that is not captured"): after Ông Sơ &
// Bà Sơ went on top (Entry 234) the tree has 5 generations under the top, the wheel drew 4. Now: one ring per
// generation; snapping steps to "Rings 4–5 of 5". Local copy: Hạnh's (Hậu/Thường) Paternal Grandma tree + a new top.
// Usage: node wheel_rings.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop',LINK='hanh-maternal-grandpa';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 await L.q('reset role');await L.q("insert into people(id,data) values ('t-top','{\"first\":\"Ông Sơ\",\"g\":\"M\"}') on conflict (id) do nothing");
 await L.q(`update trees set doc=jsonb_build_object('k','["t-top"]'::jsonb,'c',jsonb_build_array(doc)) where link='${LINK}' and doc->'k'->>0<>'t-top'`);await L.q('set role anon');
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(()=>{sessionStorage.setItem('hft-splash-seen','1')});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto(`http://localhost:8765/?tree=${LINK}`);await p.waitForTimeout(7000);
 const w=await p.evaluate(()=>{let deep=[];(function g(n,d){if(d===5)deep.push(MINH.DB.people[n.k[0]].first);(n.c||[]).forEach(c=>g(c,d+1))})(MINH.DB.root,0);
  const txt=[...document.querySelectorAll('#sun text, svg text')].map(t=>t.textContent);return {n:deep.length,shown:deep.filter(x=>txt.some(t=>t.startsWith(x.slice(0,3)))).length,deep:deep.slice(0,4)}});
 ok(w.n>0&&w.shown>=Math.min(w.n,3),`${TAG}: 5th generation under the top drawn — ${w.shown}/${w.n} names on the wheel (${w.deep.join(', ')})`);
 await p.screenshot({path:`${OUT}/rings-${TAG}.png`});
 // snapped: step to the last pair
 await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.d&&x.d.depth===5);if(q)window.SNAPTO&&0;});
 const box=await p.evaluate(()=>{const s=document.querySelector('svg');const r=s.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
 await p.mouse.click(box.x+150,box.y+20);await p.waitForTimeout(1500);
 for(let i=0;i<5;i++){if(await p.evaluate(()=>document.getElementById('next').disabled))break;await p.evaluate(()=>document.getElementById('next').click());await p.waitForTimeout(1200)}
 const lbl=await p.evaluate(()=>document.getElementById('genLbl').innerText.replace(/\s+/g,' '));
 ok(/Rings 4–5 of 5/.test(lbl),`${TAG}: snapped to the last two rings — "${lbl}"`);
 await p.screenshot({path:`${OUT}/rings-snap-${TAG}.png`});
 await L.q('reset role');await L.q(`update trees set doc=doc->'c'->0 where link='${LINK}' and doc->'k'->>0='t-top'`);await L.q('set role anon');
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
