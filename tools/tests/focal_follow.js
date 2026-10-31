// Entry 211: the focal follows you to another tree; titles through shared people; birth month / year.
// Hạnh (focal) in Hạnh's Paternal Grandpa tree → Sơn's (Trung/Văn) tree: pill "Titles for Hạnh · through O Văn";
// Dượng Trung, O Văn, Em Sơn … from the Grandpa tree; Tám & Bảy → Ông / Bà; Trung's siblings by age (born before Hạnh →
// Anh / Chị, after → Em, no year → none). Local database copy (publish_reset.sh first). Usage: node focal_follow.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
const SON='son-s-trung-van-paternal-grandparents';
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},ADMIN);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const go=async u=>{await p.goto('http://localhost:8765'+u);await p.waitForTimeout(7000)};
 // birth month / year in the edit pop-up: Hạnh May 1980
 await go('/');
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Hạnh')));await p.waitForTimeout(800);
 ok(await p.evaluate(()=>!!document.getElementById('eBm')&&!!document.getElementById('eBy')&&!!document.getElementById('nBy')),`${TAG}: Born month / year on the person and the new person`);
 await p.fill('#eBy','19x0');await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(400);
 ok(/4 digits/.test(await p.evaluate(()=>document.getElementById('edErr').textContent)),`${TAG}: a bad year is refused`);
 await p.selectOption('#eBm','5');await p.fill('#eBy','1980');
 await p.evaluate(()=>document.getElementById('eBy').scrollIntoView({block:'center'}));await p.screenshot({path:`${OUT}/born-${TAG}.png`});
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(8000);
 ok(await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Hạnh');const r=MINH.DB.people[q.cell];return r.bm===5&&r.by===1980}),`${TAG}: saved — Hạnh born 5/1980`);
 // Trung's siblings: Thành 1975 (older), Hưởng 1990 (younger), Phúc none — set in Sơn's tree
 await go('/?tree='+SON);
 await p.evaluate(()=>{const s=(n,y)=>{const q=Object.values(CP).find(x=>x.nm===n);Object.assign(MINH.DB.people[q.cell],{by:y,bm:1})};s('Thành',1975);s('Hưởng',1990)});
 ok((await p.evaluate(async()=>await MINH.save(null))).ok,`${TAG}: birth years sent for Thành and Hưởng`);
 // pick Hạnh as the focal in the Grandpa tree
 await go('/');await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hạnh');paintFocal()});await p.waitForTimeout(500);
 const s=await p.evaluate(()=>JSON.parse(sessionStorage.getItem('hft-focal-x')));
 ok(s&&s.id==='hp:AF241'&&s.titles['hp:W317']==='Dượng'&&s.by===1980,`${TAG}: focal remembered (${s&&s.id}, ${s&&Object.keys(s.titles).length} titles)`);
 // Sơn's tree
 await go('/?tree='+SON);
 const pill=await p.evaluate(()=>{const e=document.getElementById('xtPill');return e?e.innerText.replace(/\s+/g,' '):''});
 ok(/Titles for Hạnh · through O Văn/.test(pill),`${TAG}: pill "${pill}"`);
 const T=await p.evaluate(()=>Object.fromEntries(['Tám','Bảy','Trung','Văn','Sơn','Sương','Thủy','Thành','Hưởng','Phúc'].map(n=>{const q=Object.values(CP).find(x=>x.nm===n);return [n,q?titleOf(null,q.cell):'?']})));
 const want={Tám:'Ông',Bảy:'Bà',Trung:'Dượng',Văn:'O',Sơn:'Em',Sương:'Em Dâu',Thủy:'Em',Thành:'Anh',Hưởng:'Em',Phúc:''};
 for(const [n,w] of Object.entries(want))ok(T[n]===w,`${TAG}: ${n} → "${T[n]}" (want "${w}")`);
 await p.evaluate(()=>{ANCHOR=Object.values(CP).find(x=>x.nm==='Tám');document.getElementById('pSimple').click()});await p.waitForTimeout(3500);
 const chips=await p.evaluate(()=>[...document.querySelectorAll('#simple text')].map(t=>t.textContent).filter(t=>/^(Ông|Bà|Dượng|O|Cô|Anh|Chị|Em|Em Dâu|Em Rể|Cháu)$/.test(t)));
 ok(chips.includes('Ông')&&chips.includes('Dượng')&&chips.includes('Anh'),`${TAG}: chips drawn in Simple (${chips.join(', ')})`);
 await p.screenshot({path:`${OUT}/follow-${TAG}-simple.png`});
 await p.evaluate(()=>document.getElementById('pSide').click());await p.waitForTimeout(6500);await p.screenshot({path:`${OUT}/follow-${TAG}-side.png`});
 ok(await p.evaluate(()=>[...document.querySelectorAll('#family text')].some(t=>t.textContent==='Ông')),`${TAG}: Side view — Tám's card (the one in the middle) has Ông`);
 // ✕ forgets it
 await p.evaluate(()=>document.querySelector('#xtPill button').click());await p.waitForTimeout(800);
 ok(await p.evaluate(()=>!document.getElementById('xtPill')&&!sessionStorage.getItem('hft-focal-x')&&!window.XT),`${TAG}: ✕ → pill gone, titles off, forgotten`);
 // the same person in another tree → focal again (Hạnh's Maternal has a link group for Hạnh? use Grandpa tree reload)
 await go('/');await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hạnh');paintFocal()});
 await go('/?tree=hanh-maternal');
 const f2=await p.evaluate(()=>FOCAL?FOCAL.nm:null);
 ok(f2&&/Hạnh/.test(f2),`${TAG}: Hạnh's Maternal tree → Hạnh is the focal there too (${f2})`);
 // Clear focal forgets
 await p.evaluate(()=>document.getElementById('pClear').click());await p.waitForTimeout(600);
 ok(await p.evaluate(()=>!sessionStorage.getItem('hft-focal-x')),`${TAG}: Clear focal forgets it`);
 await go('/?tree='+SON);ok(await p.evaluate(()=>!document.getElementById('xtPill')&&!FOCAL),`${TAG}: then Sơn's tree opens with no titles`);
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
