// Entry 229 (Hanh, Minh's tree on the main page with Edit on): Lâm added as a new son, Phưởng linked onto him from Sơn's
// tree, Phưởng removed, Lâm removed, then Lâm added again by picking "Lâm, chồng của Phưởng" → Phưởng must come too (she
// was left out: her old record made her look "already there"). Also: a straight link with no history still brings her.
// Local copy: the Unnamed/Minh tree ('thuong') at version 12 + Sơn's tree. Usage: node relink_spouse.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
const LAM='m-mvu3n8extfn3',PHUONG='m-mvu3g74hr9jl';
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},ADMIN);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const doc=async()=>{await L.q('reset role');const d=(await L.q("select doc from trees where link='thuong'")).rows[0].doc;await L.q('set role anon');return d};
 const box=(d,id)=>{let r=null;(function w(n){if(n.k.includes(id))r=n;else(n.c||[]).forEach(w)})(d);return r};
 const open=async f=>{await p.evaluate(f=>window.EDIT(Object.values(CP).find(new Function('x','return '+f))),f);await p.waitForTimeout(900)};
 const rel=async r=>{await p.evaluate(r=>[...document.querySelectorAll('#edRels .rel')].find(b=>b.dataset.r===r).click(),r);await p.waitForTimeout(300)};
 const save=async()=>{await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(9000)};
 const pick=async(name,re)=>{await p.focus('#nF');await p.keyboard.type(name);await p.waitForTimeout(1500);
  return p.evaluate(re=>{const h=[...document.querySelectorAll('#edOv .xo')].find(x=>new RegExp(re).test(x.innerText));if(h)h.click();return !!h},re)};
 const remove=async f=>{await open(f);await p.evaluate(()=>document.getElementById('edRm').click());await p.waitForTimeout(300);
  await p.evaluate(()=>{document.querySelector('input[name=rmWhy][value=mistake]').click();document.getElementById('rmOk').click()});await p.waitForTimeout(9000)};
 await p.goto('http://localhost:8765/?tree=thuong');await p.waitForTimeout(7000);
 // 1. Lâm as a brand-new son of Bình
 await open("x.nm==='Bình'");await rel('son');await p.focus('#nF');await p.keyboard.type('Lâm');await p.waitForTimeout(800);await save();
 let d=await doc();const lamNew=d.c[0].c.map(n=>n.k[0]).find(id=>!/^(u-mw3|hp:)/.test(id)&&id!==LAM);
 ok(lamNew&&box(d,lamNew).k.length===1,`${TAG}: 1. new Lâm (${lamNew}) under Bình`);
 // 2. link Phưởng onto him as his wife (comes alone)
 await open(`x.cell==='${lamNew}'||x.nm==='Lâm'&&!x.i`);await rel('spouse');ok(await pick('Phưởng','Sơn'),`${TAG}: 2. Phưởng offered as his wife`);await save();
 d=await doc();ok(box(d,lamNew).k.join()===lamNew+','+PHUONG,`${TAG}: 2. Lâm & Phưởng`);
 // 3. remove Phưởng, 4. remove Lâm
 await remove("x.nm.startsWith('Phưởng')");d=await doc();ok(box(d,lamNew).k.length===1,`${TAG}: 3. Phưởng removed`);
 await remove(`x.nm==='Lâm'`);d=await doc();ok(!box(d,lamNew),`${TAG}: 4. Lâm removed`);
 // 5. Lâm again — picked from Sơn's tree: he, Phưởng and their children
 await open("x.nm==='Bình'");await rel('son');ok(await pick('Lâm','Phưởng'),`${TAG}: 5. "Lâm, chồng của Phưởng" offered`);await save();
 const u=(await L.q("select ops from updates order by id desc limit 1")).rows[0].ops;
 ok(u.some(o=>o.op==='spouse'&&o.id===PHUONG),`${TAG}: 5. the update brings Phưởng (${u.map(o=>o.op+':'+o.id.slice(-4)).join(' ')})`);
 d=await doc();const B=box(d,LAM);
 ok(B&&B.k.join()===LAM+','+PHUONG&&B.c.length===3,`${TAG}: 5. Minh's tree: ${B?B.k.join(' & ')+' with '+B.c.length+' children':'no Lâm'}`);
 ok(await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Lâm'&&!x.i);return !!q&&MINH.find(q.cell).node.k.length===2}),`${TAG}: 5. after the reload the page shows Lâm & Phưởng`);
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Lâm'&&!x.i);document.getElementById('pSimple').click()});await p.waitForTimeout(3500);
 await p.screenshot({path:`${OUT}/relink-${TAG}.png`});
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
