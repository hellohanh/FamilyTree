// Entry 245 (Hanh): someone related to the focal two ways (Bảo → Lâm & Phưởng).
// A made-up family with the same shape as the real one (no real data): Ông Sơ & Bà Sơ's two daughters (both "Bà Cố");
// the first's daughter Lài & Bình → Lâm (& Phưởng) → Nina; the second's son Cư → Thương (& Phúc) → Huy, Bảo, Vũ.
// Tree "tg-grandma" holds both lines (Bảo through his father); tree "tg-son" is Tám & Bảy's (Phúc listed before her younger
// sister Phưởng; Bảo through his mother). Expected for Bảo:
//   Closer   → Phưởng Dì +Bác · Lâm Dượng +Bác · Nina Em +Chị · Huy Anh (same both ways: no chip)
//   Father's → Phưởng Bác +Dì · Lâm Bác +Dượng · Nina Chị +Em        Mother's → as Closer
// …the same whichever of the two trees is open, and the switch is shown only when the focal has such a person.
// Usage: node both_ways.js OUT [desktop|phone]
const {chromium}=require('playwright');
const OUT=process.argv[2]||'.',TAG=process.argv[3]||'desktop',BASE='http://localhost:8765/';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const P=(first,g,dead)=>({first,g,dead:!!dead,last:'',middle:'',alt:''});
const people={'x-so-m':P('Ông Sơ','M',1),'x-so-f':P('Bà Sơ','F',1),'x-coA-f':P('Bà Cố','F',1),'x-coA-m':P('Ông Cố','M',1),'x-coB-f':P('Bà Cố','F',1),'x-coB-m':P('Ông Cố','M',1),
 'x-lai':P('Lài','F',1),'x-binh':P('Bình','M',1),'x-lam':P('Lâm','M'),'x-phuong':P('Phưởng','F'),'x-nina':P('Nina','F'),
 'x-cu':P('Cư','M'),'x-cuw':P('??','F'),'x-thuong':P('Thương','M'),'x-phuc':P('Phúc','F'),'x-huy':P('Huy','M'),'x-bao':P('Bảo','M'),'x-leanna':P('Leanna','F'),'x-vu':P('Vũ','M'),
 'x-tam':P('Tám','M',1),'x-bay':P('Bảy','F',1),'x-trung':P('Trung','M')};
const kids=[{k:['x-huy'],c:[]},{k:['x-bao','x-leanna'],c:[]},{k:['x-vu'],c:[]}];
const trees=[
 {link:'tg-grandma',name:'Test Grandma tree',published:true,old_links:[],version:1,created_at:'2026-11-01',
  doc:{k:['x-so-m','x-so-f'],c:[{k:['x-coA-f','x-coA-m'],c:[{k:['x-lai','x-binh'],c:[{k:['x-lam','x-phuong'],c:[{k:['x-nina'],c:[]}]}]}]},
                               {k:['x-coB-f','x-coB-m'],c:[{k:['x-cu','x-cuw'],c:[{k:['x-thuong','x-phuc'],c:kids}]}]}]}},
 {link:'tg-son',name:'Test Sơn tree',published:true,old_links:[],version:1,created_at:'2026-11-02',
  doc:{k:['x-tam','x-bay'],c:[{k:['x-trung'],c:[]},{k:['x-phuc','x-thuong'],c:kids},{k:['x-phuong','x-lam'],c:[{k:['x-nina'],c:[]}]}]}}];
async function answer(route){const u=new URL(route.request().url()),path=u.pathname.replace('/rest/v1/','');let rows=[];
 if(path==='trees'){const o=u.searchParams.get('or');rows=o?trees.filter(t=>o.includes('link.eq.'+t.link+',')):trees}
 else if(path==='people'){const v=u.searchParams.get('id')||'';const ids=(/^in\.\((.*)\)$/.exec(v)||[,''])[1].split(',').map(decodeURIComponent);rows=ids.filter(i=>people[i]).map(id=>({id,data:people[id]}))}
 route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows)})}
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+TAG+' '+m);if(!c)fail++};
 const open=async(q,mode)=>{const c=await b.newContext(VP);await c.addInitScript(m=>{try{sessionStorage.setItem('hft-splash-seen','1');if(m)localStorage.setItem('hft-both',m)}catch(e){}},mode||'');
  await c.route('https://*.supabase.co/**',answer);const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto(BASE+q);await p.waitForTimeout(3500);return {c,p}};
 const T=(p,id)=>p.evaluate(id=>typeof FOCAL!=='undefined'&&FOCAL?titleOf(FOCAL.cell,id):'(no focal)',id);
 const clean=s=>String(s).replace(/~[^|]*/g,'');
 const mode=async(p,m)=>{const sel=`#pBoth button[data-m="${m}"]`;if(TAG==='phone'&&!(await p.isVisible(sel))){await p.evaluate(()=>{const h=[...document.querySelectorAll('#lHandle,#rHandle')].find(e=>e.offsetParent);(h||document.getElementById('lHandle')).click()});await p.waitForTimeout(600)}
  await p.$eval(sel,b=>{b.scrollIntoView({block:'center'});b.click()});await p.waitForTimeout(500);if(TAG==='phone'){await p.$eval('#pClose',b=>b.click());await p.waitForTimeout(500)}};
 for(const tree of ['tg-son','tg-grandma']){
  const {c,p}=await open(`?tree=${tree}&focus=x-bao`);
  ok(await p.evaluate(()=>FOCAL&&FOCAL.nm==='Bảo'),`${tree}: Bảo is the focal`);
  const got={lam:clean(await T(p,'x-lam')),phuong:clean(await T(p,'x-phuong')),nina:clean(await T(p,'x-nina')),huy:clean(await T(p,'x-huy'))};
  ok(got.phuong==='Dì|+Bác'&&got.lam==='Dượng|+Bác'&&got.nina==='Em|+Chị'&&got.huy==='Anh',`${tree}, Closer: Phưởng ${got.phuong} · Lâm ${got.lam} · Nina ${got.nina} · Huy ${got.huy}`);
  ok(await p.evaluate(()=>{const r=document.getElementById('pBoth');return r&&!r.hidden&&/Bảo: 3 people/.test(r.textContent)}),`${tree}: Options shows "Related both ways — Bảo: 3 people"`);
  await mode(p,'father');
  const f={lam:clean(await T(p,'x-lam')),phuong:clean(await T(p,'x-phuong')),nina:clean(await T(p,'x-nina'))};
  ok(f.phuong==='Bác|+Dì'&&f.lam==='Bác|+Dượng'&&f.nina==='Chị|+Em',`${tree}, Father's: Phưởng ${f.phuong} · Lâm ${f.lam} · Nina ${f.nina}`);
  await mode(p,'mother');
  ok(clean(await T(p,'x-phuong'))==='Dì|+Bác','Mother\'s: Phưởng Dì +Bác');
  await mode(p,'closer');
  ok(await p.evaluate(()=>localStorage.getItem('hft-both'))==='closer','the choice is remembered on this device');
  ok(!p.errs.length,`${tree}: no page errors `+p.errs.join('|'));
  if(tree==='tg-son'){
   // the cards: up a generation to Tám & Bảy's family, where Phưởng & Lâm are
   if(!(await p.evaluate(()=>document.body.classList.contains('simple')))){await p.$eval('#pSimple',b=>b.click());await p.waitForTimeout(1500);if(TAG==='phone'){await p.$eval('#pClose',b=>b.click());await p.waitForTimeout(500)}}
   for(let i=0;i<2;i++){await p.click('#sgUp');await p.waitForTimeout(1800)}
   await p.screenshot({path:`${OUT}/both-cards-${TAG}.png`});
   const chip=await p.$('#simple text.bchip');ok(!!chip,'a dashed "+…" chip is drawn on the cards');
   if(chip){await chip.click();await p.waitForTimeout(400);const t=await p.evaluate(()=>{const x=document.getElementById('bothPop');return x?x.innerText:''});
    ok(/two ways/.test(t)&&/through Ba\s*Thương/.test(t)&&/through Má\s*Phúc/.test(t),'tapping it explains both paths: '+t.replace(/\s+/g,' ').slice(0,140));
    ok(await p.evaluate(()=>FOCAL&&FOCAL.nm==='Bảo'),'tapping the chip does not change the focal');
    await p.screenshot({path:`${OUT}/both-popup-${TAG}.png`});
   }
   if(TAG==='phone'){const pp=await p.$('#bothPop');if(pp)await p.$eval('#bothPop button',b=>b.click());await p.evaluate(()=>{const h=[...document.querySelectorAll('#lHandle,#rHandle')].find(e=>e.offsetParent);(h||document.getElementById('lHandle')).click()});await p.waitForTimeout(600)}await p.evaluate(()=>{const b=document.getElementById('pBoth');if(b)b.scrollIntoView({block:'center'})});await p.waitForTimeout(300);await p.screenshot({path:`${OUT}/both-options-${TAG}.png`});
  }
  await c.close()}
 // someone with no double ties: the switch stays hidden
 {const {c,p}=await open('?tree=tg-son&focus=x-trung');ok(await p.evaluate(()=>{const r=document.getElementById('pBoth');return !r||r.hidden}),'Trung as the focal: no "Related both ways" in Options');await c.close()}
 // the saved choice applies straight away
 {const {c,p}=await open('?tree=tg-grandma&focus=x-bao','father');ok(clean(await T(p,'x-lam'))==='Bác|+Dượng','saved "Father\'s" applies on the next visit');await c.close()}
 await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
