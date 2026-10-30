// Entry 210: "Already in another tree" while typing a new person's first name. Hanh's case: adding Thương as a son on
// the main page — he is already in Sơn's tree as Phúc's husband. Picking him links the same person and brings Phúc
// and their children's families. Also the editors' page (a test tree) linking Hiền from Hạnh's Paternal tree.
// Local database copy (publish_reset.sh first). Usage: node xlink_live.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
const SON='son-s-trung-van-paternal-grandparents';
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const who=async c=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},c);return ctx};
 // Thương & Phúc in Sơn's tree
 await L.q('reset role');const P=Object.fromEntries((await L.q('select id,data from people')).rows.map(r=>[r.id,r.data]));
 const sdoc=(await L.q('select doc from trees where link=$1',[SON])).rows[0].doc;await L.q('set role anon');
 const fd=(n,f)=>{if(n.k.some(k=>(P[k]||{}).first===f&&n.k.indexOf(k)>0))return n;for(const c of n.c||[]){const r=fd(c,f);if(r)return r}};
 const box=fd(sdoc,'Thương');const TH=box.k.find(k=>P[k].first==='Thương');const cnt=n=>n.k.length+(n.c||[]).reduce((s,c)=>s+cnt(c),0);
 const expect=2+box.c.filter(c=>box.k.length===2||c.m===TH).reduce((s,c)=>s+cnt(c),0);
 console.log(`  Sơn's tree: ${box.k.map(k=>P[k].first).join(' & ')} (${TH}), family of ${expect}`);
 // ---------- main page (Hạnh's Maternal tree), Hanh with Edit on ----------
 let ctx=await who(ADMIN),p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/?tree=hanh-maternal');await p.waitForTimeout(7000);
 const par=await p.evaluate(()=>{const q=Object.values(CP).find(x=>{const f=MINH.find(x.cell);return f&&f.i===0&&f.node.k.length===2&&(f.node.c||[]).length>0});return q.nm});
 await p.evaluate(nm=>window.EDIT(Object.values(CP).find(x=>x.nm===nm)),par);await p.waitForTimeout(900);
 await p.evaluate(()=>document.getElementById('nF').scrollIntoView({block:'center'}));
 await p.type('#nF','Thươ',{delay:60});await p.waitForTimeout(2500);
 const list=await p.evaluate(()=>[...document.querySelectorAll('#nX .xo')].map(b=>b.innerText.replace(/\n/g,' | ')));
 ok(list.some(t=>/Thương/.test(t)&&/của Phúc/.test(t)&&/Sơn's/.test(t)),`main/${TAG}: typing "Thươ" under ${par} → ${list.length} suggestion(s): ${list.join(' // ')}`);
 await p.screenshot({path:`${OUT}/xlink-${TAG}-list.png`});
 await p.evaluate(()=>{const b=[...document.querySelectorAll('#nX .xo')].find(b=>/của Phúc/.test(b.innerText));b.click()});await p.waitForTimeout(500);
 const lk=await p.evaluate(()=>document.getElementById('nX').innerText.replace(/\n/g,' | '));
 ok(/Linked/.test(lk)&&/Phúc/.test(lk)&&new RegExp('\\('+expect+' people\\)').test(lk),`main/${TAG}: linked → "${lk}"`);
 ok(await p.evaluate(()=>document.getElementById('nF').readOnly&&document.getElementById('nF').value==='Thương'),`main/${TAG}: name filled in and locked while linked`);
 await p.screenshot({path:`${OUT}/xlink-${TAG}-linked.png`});
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(9000);
 const got=await p.evaluate(([nm,th])=>{const f=MINH.find(Object.values(CP).find(x=>x.nm===nm).cell);const c=(f.node.c||[]).find(c=>c.k[0]===th);const ids=n=>[...n.k,...(n.c||[]).flatMap(ids)];
  return c?{k:c.k.map(k=>MINH.DB.people[k].first),n:ids(c).length,pend:MINH.PEND.size,inCP:!!CP[th]}:null},[par,TH]);
 ok(got&&got.k.join()==='Thương,Phúc'&&got.n===expect&&got.pend===0&&got.inCP,`main/${TAG}: saved → under ${par}: ${got&&got.k.join(' & ')}, ${got&&got.n} people, nothing pending`);
 const ups=(await L.q("select status,jsonb_array_length(ops) n from updates order by id")).rows;
 ok(ups.length===Math.ceil(expect/20)&&ups.every(u=>u.status==='ok'),`main/${TAG}: sent as ${ups.length} update(s) of ${ups.map(u=>u.n).join('+')} (20 at most each), confirmed`);
 await p.evaluate(nm=>{FOCAL=Object.values(CP).find(x=>x.nm===nm);document.getElementById('pSimple').click()},par);await p.waitForTimeout(3500);await p.screenshot({path:`${OUT}/xlink-${TAG}-simple.png`});
 // an edit to Thương in Sơn's tree (main page) shows on his copy in Hạnh's Maternal tree
 await p.goto('http://localhost:8765/?tree='+SON);await p.waitForTimeout(7000);
 await p.evaluate(th=>{MINH.DB.people[th].alt='Tom'},TH);await p.evaluate(async()=>await MINH.save(null));
 await p.goto('http://localhost:8765/?tree=hanh-maternal');await p.waitForTimeout(7000);
 ok(await p.evaluate(th=>MINH.DB.people[th].alt==='Tom',TH),`main/${TAG}: his nickname set in Sơn's tree shows in Hạnh's Maternal tree`);
 ok(!errs.length,`main/${TAG}: no page errors ${errs.join('|')}`);await ctx.close();
 // ---------- editors' page: a new tree links Hiền (Hạnh's Paternal, built in) ----------
 await L.q('reset role');await L.q("delete from trees where link='xl-test'");
 await L.q(`select public.create_tree('HANHTRANX','xl-test','XL test','{"k":["xl-f","xl-m"],"c":[]}'::jsonb,'{"xl-f":{"first":"Cha","g":"M"},"xl-m":{"first":"Mẹ","g":"F"}}'::jsonb)`);await L.q('set role anon');
 ctx=await who(ADMIN);p=await ctx.newPage();const e2=[];p.on('pageerror',e=>e2.push(e.message));await p.goto('http://localhost:8765/editor/?tree=xl-test');await p.waitForTimeout(7000);
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Cha')));await p.waitForTimeout(900);
 await p.evaluate(()=>{document.querySelector('#edRels [data-r=son]').click()});
 await p.type('#nF','Hiề',{delay:60});await p.waitForTimeout(2500);
 const l2=await p.evaluate(()=>[...document.querySelectorAll('#nX .xo')].map(b=>b.innerText.replace(/\n/g,' | ')));
 ok(l2.some(t=>/Hiền/.test(t)&&/Paternal Grandpa/.test(t)),`editor/${TAG}: typing "Hiề" (Son) → ${l2.join(' // ')}`);
 await p.evaluate(()=>{const b=[...document.querySelectorAll('#nX .xo')].find(b=>/Hiền/.test(b.innerText)&&/Paternal Grandpa/.test(b.innerText));b.click()});await p.waitForTimeout(400);
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(7000);
 await L.q('reset role');const d2=(await L.q("select doc from trees where link='xl-test'")).rows[0].doc;await L.q('set role anon');
 const ch=d2.c&&d2.c[0];ok(ch&&ch.k[0].startsWith('hp:')&&cnt(ch)>3,`editor/${TAG}: saved — Hiền's box ${ch&&JSON.stringify(ch.k)} with ${ch?cnt(ch):0} people (shared hp: ids)`);
 ok(await p.evaluate(()=>!document.querySelector('#linkDlg.on')),`editor/${TAG}: no after-Save "Same person?" question for a linked person`);
 ok(!e2.length,`editor/${TAG}: no page errors ${e2.join('|')}`);
 // The Multiverse: Thương joins Sơn's tree and Hạnh's Maternal tree (database-made id)
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
