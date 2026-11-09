// Entry 234 (Hanh): a level above Ông Cố / Bà Cố. "Father" / "Mother" only on the person at the very top; the new
// person becomes the top, the old top couple one level under; the title is Ông Sơ / Bà Sơ (was the Northern Kỵ).
// Editors' page and main page (a "top" update). Local copy: Hạnh's (Hậu/Thường) Paternal Grandma tree.
// Usage: node add_parents.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop',LINK='hanh-maternal-grandpa';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},ADMIN);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const doc=async()=>{await L.q('reset role');const d=(await L.q(`select doc from trees where link='${LINK}'`)).rows[0].doc;await L.q('set role anon');return d};
 const rels=()=>p.evaluate(()=>[...document.querySelectorAll('#edRels .rel')].map(b=>b.textContent+(b.disabled?'(off)':'')).join(' '));
 await L.q('reset role');await L.q("delete from updates where ops->0->>'op'='top'");await L.q('set role anon');   // earlier runs
 const top0=(await doc()).k[0];
 // editors' page
 await p.goto(`http://localhost:8765/editor/?tree=${LINK}`);await p.waitForTimeout(7000);
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Lịch')));await p.waitForTimeout(800);
 ok(!/Father/.test(await rels()),`${TAG} editor: no Father/Mother on Lịch (${await rels()})`);
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Bà Cố')));await p.waitForTimeout(800);
 ok(!/Father/.test(await rels()),`${TAG} editor: none on Bà Cố (married in)`);
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Ông Cố')));await p.waitForTimeout(800);
 ok(/Father Mother$/.test(await rels()),`${TAG} editor: Ông Cố → ${await rels()}`);
 await p.evaluate(()=>[...document.querySelectorAll('#edRels .rel')].find(b=>b.dataset.r==='father').click());await p.waitForTimeout(300);
 const st=await p.evaluate(()=>({h:document.getElementById('edAdd').textContent,hint:document.getElementById('edHint').textContent,list:document.getElementById('edList').hidden}));
 ok(/Ông Cố’s father/.test(st.h)&&/new top/.test(st.hint)&&st.list,`${TAG} editor: "${st.h}" — ${st.hint}`);
 await p.fill('#nF','Tổ');await p.evaluate(()=>document.getElementById('edAdd').scrollIntoView({block:'start'}));await p.waitForTimeout(200);await p.screenshot({path:`${OUT}/father-${TAG}.png`});
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(8000);
 let d=await doc();ok(d.k.length===1&&d.c.length===1&&d.c[0].k[0]===top0,`${TAG} editor: saved — new top ${d.k[0]}, Ông Cố & Bà Cố under him`);
 const tt=await p.evaluate(()=>{const R=MINH.DB.root,top=R.k[0];let f=null,deep=0;(function w(n,d){if(d>deep&&n.k[0]){deep=d;f=n.k[0]}(n.c||[]).forEach(c=>w(c,d+1))})(R,0);
  const P=MINH.DB.people;return {d:deep,who:P[f]&&P[f].first,t:titleOf(f,top),c:titleOf(f,R.c[0].k[0]),me:P[top]&&P[top].first}});
 ok(tt.d===4?/^Ông Sơ/.test(tt.t):tt.d===5?/^Ông Sơ/.test(tt.c):true,`${TAG}: from ${tt.who} (${tt.d} levels under ${tt.me}): "${tt.t}", Ông Cố "${tt.c}"`);
 // his wife from his card, as the hint says
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Tổ')));await p.waitForTimeout(800);
 ok(/Father Mother$/.test(await rels()),`${TAG} editor: Tổ is the top now → ${await rels()}`);
 await p.evaluate(()=>{document.getElementById('edCancel')&&document.getElementById('edCancel').click();const id=MINH.DB.root.c[0].k[0];window.EDIT(Object.values(CP).find(x=>x.cell===id)||{cell:id,nm:'Ông Cố',i:0,d:{}})});await p.waitForTimeout(800);
 ok(!/Father/.test(await rels()),`${TAG} editor: no Father/Mother on Ông Cố any more (${await rels()})`);
 // main page: put it back by removing Tổ is not allowed at the top → reload the original and add a Mother there
 await L.q('reset role');await L.q(`update trees set doc=doc->'c'->0 where link='${LINK}'`);await L.q('set role anon');
 d=await doc();ok(d.k[0]===top0,`${TAG}: (reset to Ông Cố on top)`);
 await p.goto(`http://localhost:8765/?tree=${LINK}`);await p.waitForTimeout(7000);
 await p.evaluate(t=>window.EDIT(Object.values(CP).find(x=>x.cell===t)),top0);await p.waitForTimeout(800);
 await p.evaluate(()=>[...document.querySelectorAll('#edRels .rel')].find(b=>b.dataset.r==='mother').click());await p.waitForTimeout(300);
 await p.fill('#nF','Tổ Mẫu');await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(9000);
 const u=(await L.q("select status,ops from updates order by id desc limit 1")).rows[0];
 ok(u.status==='ok'&&u.ops[0].op==='top'&&u.ops[0].below===top0,`${TAG} main: a "top" update, confirmed straight in (${JSON.stringify(u.ops[0]).slice(0,110)})`);
 d=await doc();ok(d.c[0].k[0]===top0,`${TAG} main: written back — the new top is ${d.k[0]}`);
 ok(await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Tổ Mẫu');return !!q&&MINH.DB.root.k[0]===q.cell}),`${TAG} main: after the reload Tổ Mẫu is at the top`);
 await p.evaluate(()=>{ANCHOR=Object.values(CP).find(x=>x.nm==='Tổ Mẫu');document.getElementById('pSimple').click()});await p.waitForTimeout(3000);await p.screenshot({path:`${OUT}/top-${TAG}.png`});
 // put the local copy back
 await L.q('reset role');await L.q(`update trees set doc=doc->'c'->0 where link='${LINK}' and doc->'c'->0->'k'->>0='${top0}'`);await L.q("delete from updates where ops->0->>'op'='top'");await L.q('set role anon');
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
