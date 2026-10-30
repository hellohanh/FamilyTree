// Entry 212: titles from EVERY tree the focal is in. Hanh's case (2026-10-30 backup loaded locally): Hạnh picked as the
// focal in his Grandma's tree (Hạnh's (Hậu/Thường) Paternal Grandma & Siblings) → Sơn's tree shows Bác Thương, Bác Phúc,
// Anh Huy (from the Grandma tree) AND O Văn, Dượng Trung, Em Sơn (from his Grandpa tree). Also picked in the Grandpa
// tree (Hạnh = AF241; there is a second Hạnh, Cháu (Bằng)'s daughter). Usage: node focal_merge.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 for(const [from,pick] of [['hanh-maternal-grandpa','hp:AF241'],['hanh-paternal','AF241']]){
  const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(()=>{sessionStorage.setItem('hft-splash-seen','1')});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8765/?tree='+from);await p.waitForTimeout(7000);
  await p.evaluate(c=>{FOCAL=CP[c];paintFocal()},pick);
  await p.goto('http://localhost:8765/?tree=son-s-trung-van-paternal-grandparents');await p.waitForTimeout(9000);
  const pill=await p.evaluate(()=>{const e=document.getElementById('xtPill');return e?e.innerText.replace(/\s+/g,' '):''});
  ok(/Titles for Hạnh · through O Văn/.test(pill),`${TAG} picked in ${from}: pill "${pill}"`);
  const T=await p.evaluate(()=>{const g=n=>Object.values(CP).filter(x=>x.nm===n).map(q=>titleOf(null,q.cell));
   const thp=Object.values(CP).find(x=>x.nm==='Thương');const ph=thp?CP[thp.d.data.k[0]]:null;
   return {Trung:g('Trung')[0],Văn:g('Văn')[0],Sơn:g('Sơn')[0],Tám:g('Tám')[0],Thương:thp?titleOf(null,thp.cell):'?',Phúc:ph?titleOf(null,ph.cell):'?',Huy:g('Huy')[0]}});
  const want={Trung:'Dượng',Văn:'O',Sơn:'Em',Tám:'Ông',Thương:'Bác',Phúc:'Bác',Huy:'Anh'};
  ok(Object.entries(want).every(([k,v])=>T[k]===v),`${TAG} picked in ${from}: ${Object.entries(T).map(([k,v])=>v+' '+k).join(', ')}`);
  if(from==='hanh-maternal-grandpa'){await p.screenshot({path:`${OUT}/merge-${TAG}-wheel.png`});
   await p.evaluate(()=>{ANCHOR=Object.values(CP).find(x=>x.nm==='Tám');document.getElementById('pSimple').click()});await p.waitForTimeout(3500);await p.screenshot({path:`${OUT}/merge-${TAG}-simple.png`})}
  ok(!errs.length,`${TAG} picked in ${from}: no page errors ${errs.join('|')}`);await ctx.close()}
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
