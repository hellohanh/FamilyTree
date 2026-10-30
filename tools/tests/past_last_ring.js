// Entry 218: someone past the wheel's last ring (a 6th generation — Hanh's 2026-10-30 backup has a ~INC~ child under
// Lucia Xuan, update 31) gets no label or title chip on the wheel (no floating "Chít"); still in the Simple view.
const {chromium}=require('playwright');const live=require('./livedb.js');const OUT=process.argv[2];
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(()=>{sessionStorage.setItem('hft-splash-seen','1')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(7000);
 const deep=await p.evaluate(()=>P.filter(x=>x.d.depth>=5).map(x=>x.nm+' (under '+x.d.parent.data.n.join(' & ')+')'));
 ok(deep.length>0,`a 6th-generation person in the data: ${deep.join(', ')}`);
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hậu');paintFocal();labels()});await p.waitForTimeout(500);
 const chit=await p.evaluate(()=>[...document.querySelectorAll('svg text')].filter(t=>t.textContent==='Chít').length);
 ok(chit===0,`wheel: no floating "Chít" chip (${chit})`);
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Lucia Xuan');document.getElementById('pSimple').click()});await p.waitForTimeout(3500);
 ok(await p.evaluate(()=>[...document.querySelectorAll('#simple text')].some(t=>/~INC~/.test(t.textContent))),'Simple view (Lucia Xuan): the ~INC~ child is there to remove');
 ok(!errs.length,'no page errors '+errs.join('|'));await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
