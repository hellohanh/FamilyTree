// Entry 232 (Hanh): Bà Thương (Ông Hai's second wife) "counted as blood". The tick box on her card (spouses only), then:
// Hạnh focal → Minh's tree: the agreed titles (Entry 231); Tường focal → the Grandpa tree: Ông Hai = Ba, Bà Lịch blank,
// Ba (Hậu) Em, Hạnh Cháu. Local copy: the 'thuong' tree (version 12-equivalent) + step/setup.sql (Tịnh, Minh, Thuận …).
// Usage: node step_blood.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},ADMIN);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const go=async u=>{await p.goto('http://localhost:8765'+u);await p.waitForTimeout(7000)};
 const T=names=>p.evaluate(names=>{const o={};Object.values(CP).forEach(q=>{const n=q.nm.replace(/ \(.*\)$/,'');if(names.includes(n)&&!(n in o))o[n]=titleOf(FOCAL?FOCAL.cell:null,q.cell)||'—'});return o},names);
 // 1. the tick box: on Thương (married in) in the Grandpa tree, not on Hạnh
 await go('/');
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>/AF241/.test(x.cell))));await p.waitForTimeout(800);
 ok(await p.evaluate(()=>getComputedStyle(document.getElementById('eBlL')).display==='none'),`${TAG}: no "Count as blood family" on Hạnh (blood)`);
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm.startsWith('Thương')&&x.i>0)));await p.waitForTimeout(800);
 ok(await p.evaluate(()=>getComputedStyle(document.getElementById('eBlL')).display!=='none'),`${TAG}: "Count as blood family" on Bà Thương (married in)`);
 await p.evaluate(()=>{document.getElementById('eBl').scrollIntoView({block:'center'})});await p.screenshot({path:`${OUT}/tick-${TAG}.png`});
 await p.evaluate(()=>{const c=document.getElementById('eBl');if(!c.checked)c.click();document.getElementById('edSave').click()});await p.waitForTimeout(9000);
 const u=(await L.q("select ops from updates order by id desc limit 1")).rows[0].ops;
 ok(u[0].op==='edit'&&u[0].set.blood===true,`${TAG}: saved as an update ${JSON.stringify(u[0].set)}`);
 // 2. Hạnh focal → Minh's tree
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>/AF241/.test(x.cell));paintFocal()});await p.waitForTimeout(600);
 await go('/?tree=thuong');
 const want={Thương:'Bà Nội',Hai:'Ông Nội','??':'Ông',Tường:'Bác',Kỳ:'Bác',Khánh:'Anh',Nhung:'Chị Dâu',Hàng:'Chị',Bình:'Ông Cậu',Lài:'Bà Mợ',Tịnh:'Bác',Châu:'Bác',Minh:'Anh',Khôi:'Chị Dâu','Mỹ-Kiều':'Cháu',Thuận:'Ông Cậu',Mai:'Bà Mợ',Thiện:'Chú',Linh:'O','Thái':'Bà Dì',Văn:'O',Hùng:'Chú'};
 const got=await T(Object.keys(want));
 for(const [n,w] of Object.entries(want)){const g=got[n]||'';ok(g===w||(n==='??'&&g===w)||(w==='Ông'&&g==='Ông'),`${TAG}: Hạnh → ${n} "${g}" (want "${w}")`)}
 ok(await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Ba'&&x.i===0);return q?/^Ông Cố/.test(titleOf(null,q.cell)):false}),`${TAG}: Hạnh → Ba (top) Ông Cố…`);
 await p.evaluate(()=>{ANCHOR=Object.values(CP).find(x=>x.nm.startsWith('Thương')&&x.i===0);document.getElementById('pSimple').click()});await p.waitForTimeout(3500);await p.screenshot({path:`${OUT}/hanh-simple-${TAG}.png`});
 await p.evaluate(()=>document.getElementById('pWheel')&&document.getElementById('pWheel').click());await p.waitForTimeout(3000);await p.screenshot({path:`${OUT}/hanh-wheel-${TAG}.png`});
 // 3. Tường focal → Grandpa tree
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Tường'&&x.i===0);paintFocal()});await p.waitForTimeout(600);
 await go('/');
 const want2={Hai:'Ba',Lịch:'—',Hậu:'Em',Hạnh:'Cháu',Văn:'Em',Hiền:'Em'};
 const got2=await p.evaluate(names=>{const o={};Object.values(CP).forEach(q=>{const n=q.nm.replace(/ \(.*\)$/,'');if(names.includes(n)&&!(n in o)&&(n!=='Hạnh'||/AF241/.test(q.cell)))o[n]=titleOf(null,q.cell)||'—'});return o},Object.keys(want2));
 for(const [n,w] of Object.entries(want2))ok(got2[n]===w,`${TAG}: Tường → ${n} "${got2[n]}" (want "${w}")`);
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
