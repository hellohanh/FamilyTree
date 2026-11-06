// Entry 227 (Option B): someone with two or more spouses — "Husbands / Wives, in order" (drag ⠿) and the children grouped
// by marriage with a switch on each child. Editors' page: the Unnamed tree (Thương: ~INC~, Hai). Main page (Hanh, Edit
// on): Hai's wives Lịch, Thương → a "family" update, confirmed straight in. Local copy: the Unnamed tree at version 12.
// Usage: node spouse_order.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},ADMIN);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const drag=async(sel,from,to)=>{const g=await p.$$(sel+' .grip');const rows=await p.$$(sel+' .li');const a=await g[from].boundingBox(),t=await rows[to].boundingBox();
  await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(a.x+a.width/2,t.y+4,{steps:12});await p.waitForTimeout(150);await p.mouse.up();await p.waitForTimeout(300)};
 const st=()=>p.evaluate(()=>({sp:[...document.querySelectorAll('#edSpL .li')].map(r=>r.innerText.replace(/\s+/g,' ').trim()),h:document.getElementById('edSpH').textContent,
  rows:[...document.querySelectorAll('#edList > *')].map(e=>e.classList.contains('grp')?'['+e.textContent+']':(e.querySelector('.card')||e).innerText.replace(/\s+/g,' ').replace(/^⠿ /,'').trim())}));
 // ---------- editors' page: the Unnamed tree ----------
 await p.goto('http://localhost:8765/editor/?tree=thuong');await p.waitForTimeout(7000);
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>/^Thương/.test(x.nm))));await p.waitForTimeout(900);
 let s=await st();
 ok(s.h==='Husbands, in order'&&/1st marriage ~INC~/.test(s.sp[0])&&/2nd marriage Hai/.test(s.sp[1]),`${TAG} editor: "${s.h}": ${s.sp.join(' | ')}`);
 ok(s.rows[0]==='[With ~INC~]'&&/Tường/.test(s.rows[1])&&s.rows[2]==='[With Hai]',`${TAG} editor: children grouped — ${s.rows.join(' · ')}`);
 await p.evaluate(()=>document.getElementById('edSp').scrollIntoView({block:'start'}));await p.waitForTimeout(200);await p.screenshot({path:`${OUT}/sp-${TAG}-editor.png`});
 // move Dương to ~INC~'s marriage, then drag Hai to the top
 await p.evaluate(()=>{const r=[...document.querySelectorAll('#edList .li')].find(l=>/Dương/.test(l.innerText));[...r.querySelectorAll('.seg button')].find(b=>/INC/.test(b.textContent)).click()});await p.waitForTimeout(300);
 s=await st();ok(s.rows.indexOf('[With Hai]')>s.rows.findIndex(r=>/Dương/.test(r)),`${TAG} editor: Dương switched → now under ~INC~ (${s.rows.join(' · ')})`);
 await drag('#edSpL',1,0);s=await st();ok(/1st marriage Hai/.test(s.sp[0]),`${TAG} editor: Hai dragged to the top → ${s.sp.join(' | ')}; groups ${s.rows.filter(r=>r[0]==='[').join(' ')}`);
 await p.screenshot({path:`${OUT}/sp-${TAG}-editor-changed.png`});
 // put it back: ~INC~ first, Dương back to Hai — then Save, and check the saved tree
 await drag('#edSpL',1,0);await p.evaluate(()=>{const r=[...document.querySelectorAll('#edList .li')].find(l=>/Dương/.test(l.innerText));[...r.querySelectorAll('.seg button')].find(b=>/Hai/.test(b.textContent)).click()});await p.waitForTimeout(300);
 s=await st();{const nm=s.rows.filter(r=>r[0]!=='[').map(r=>r.split(' ')[1]);ok(nm.indexOf('Dương')===nm.indexOf('Chương')+1,`${TAG} editor: Dương back with Hai → back in her place by birth order (${nm.join(', ')})`)}
 await drag('#edSpL',1,0);   // Hai first again, to save a real change
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(7000);
 await L.q('reset role');let d=(await L.q("select doc,version from trees where link='thuong'")).rows[0];await L.q('set role anon');
 const th=d.doc.c[1];ok(th.k.join()==='hp:N264,hp:N262,u-mw3n8s0kas9t'&&th.c[0].m==='hp:N262'&&th.c[th.c.length-1].m==='u-mw3n8s0kas9t',`${TAG} editor: saved (v${d.version}) — card ${th.k.join(', ')}; children ${th.c.map(c=>c.m==='hp:N262'?'Hai':'INC').join(' ')}`);
 // the Simple view follows the order (Hai left now)
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>/^Thương/.test(x.nm));document.getElementById('pSimple').click()});await p.waitForTimeout(3500);
 await p.screenshot({path:`${OUT}/sp-${TAG}-simple-after.png`});
 // and back to ~INC~ first (leave the local copy as it was)
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>/^Thương/.test(x.nm))));await p.waitForTimeout(900);await drag('#edSpL',1,0);
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(7000);
 await L.q('reset role');d=(await L.q("select doc from trees where link='thuong'")).rows[0];await L.q('set role anon');
 ok(d.doc.c[1].k.join()==='hp:N264,u-mw3n8s0kas9t,hp:N262'&&d.doc.c[1].c[0].m==='u-mw3n8s0kas9t',`${TAG} editor: back to ~INC~ · Thương · Hai, Tường with ~INC~ first`);
 // ---------- main page: Hai's wives (Grandpa tree) ----------
 await p.goto('http://localhost:8765/');await p.waitForTimeout(7000);
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Hai'&&x.i===0)));await p.waitForTimeout(900);
 s=await st();ok(s.h==='Wives, in order'&&/Lịch/.test(s.sp[0])&&/Thương/.test(s.sp[1]),`${TAG} main: "${s.h}": ${s.sp.join(' | ')}`);
 const before=(await L.q("select count(*)::int n from updates where status='ok'")).rows[0].n;
 await p.evaluate(()=>{const r=[...document.querySelectorAll('#edList .li')].find(l=>/Hậu/.test(l.innerText));[...r.querySelectorAll('.seg button')].find(b=>/Thương/.test(b.textContent)).click()});await p.waitForTimeout(300);
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(8000);
 const u=(await L.q("select status,ops from updates order by id desc limit 1")).rows[0];
 ok(u.status==='ok'&&u.ops[0].op==='family'&&Object.values(u.ops[0].m||{})[0],`${TAG} main: a "family" update, confirmed straight in (${JSON.stringify(u.ops[0]).slice(0,120)})`);
 ok(await p.evaluate(()=>{const h=Object.values(CP).find(x=>x.nm==='Hậu');const n=MINH.find(h.cell).parent;return (n.c.find(c=>c.k[0]===h.cell)||{}).m===n.k[2]}),`${TAG} main: after the reload Hậu is with Thương`);
 // put Hậu back with Lịch
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Hai'&&x.i===0)));await p.waitForTimeout(900);
 await p.evaluate(()=>{const r=[...document.querySelectorAll('#edList .li')].find(l=>/Hậu/.test(l.innerText));[...r.querySelectorAll('.seg button')].find(b=>/Lịch/.test(b.textContent)).click()});
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(8000);
 ok(await p.evaluate(()=>{const h=Object.values(CP).find(x=>x.nm==='Hậu');const n=MINH.find(h.cell).parent;return (n.c.find(c=>c.k[0]===h.cell)||{}).m===n.k[1]}),`${TAG} main: put back — Hậu with Lịch`);
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
