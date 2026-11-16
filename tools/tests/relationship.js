// Entry 247 (Hanh, S019): Options → Relationship — two people, how they are related.
// A made-up family with the real shape (no real data from the database); Bà Lịch, Ông Hai, Hậu, Hạnh, Văn, Trung and
// Hùng are the real built-in people (hp:…), linked from the made-up Grandma tree the way the real one links them.
//   Ông Sơ & Bà Sơ → Bà Cố A (→ Lài & Bình → Lâm & Phưởng) · Bà Cố B & Ông Cố → Cư (listed first) → Thương & Phúc → Huy &
//   Anh Đào → Khoa (Kygo); Bảo · and Bà Lịch & Ông Hai → Hậu & Thường → Hạnh & Hương.   Tám & Bảy → Trung & Văn, Phúc &
//   Thương, Phưởng & Lâm.   A lone tree with one person (no link).
// Usage: node relationship.js OUT [desktop|phone]
const {chromium}=require('playwright');
const OUT=process.argv[2]||'.',TAG=process.argv[3]||'desktop',BASE='http://localhost:8765/';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const P=(first,g,alt)=>({first,g,dead:false,last:'',middle:'',alt:alt||''});
const people={'x-so-m':P('Ông Sơ','M'),'x-so-f':P('Bà Sơ','F'),'x-coA-f':P('Bà Cố','F'),'x-coA-m':P('Ông Cố','M'),'x-coB-f':P('Bà Cố','F'),'x-coB-m':P('Ông Cố','M'),
 'x-lai':P('Lài','F'),'x-binh':P('Bình','M'),'x-lam':P('Lâm','M'),'x-phuong':P('Phưởng','F'),'x-cu':P('Cư','M'),'x-cuw':P('??','F'),'x-thuong':P('Thương','M'),'x-phuc':P('Phúc','F'),
 'x-huy':P('Huy','M'),'x-anhdao':P('Anh Đào','F'),'x-khoa':P('Khoa','M','Kygo'),'x-bao':P('Bảo','M'),'x-tam':P('Tám','M'),'x-bay':P('Bảy','F'),'x-lone':P('Lẻ','F')};
const trees=[
 {link:'tg-grandma',name:'Test Grandma tree',published:true,old_links:[],version:1,created_at:'2026-11-01',
  doc:{k:['x-so-m','x-so-f'],c:[{k:['x-coA-f','x-coA-m'],c:[{k:['x-lai','x-binh'],c:[{k:['x-lam','x-phuong'],c:[]}]}]},
   {k:['x-coB-f','x-coB-m'],c:[{k:['x-cu','x-cuw'],c:[{k:['x-thuong','x-phuc'],c:[{k:['x-huy','x-anhdao'],c:[{k:['x-khoa'],c:[]}]},{k:['x-bao'],c:[]}]}]},
    {k:['hp:N260','hp:N262'],c:[{k:['hp:W236','hp:W238'],c:[{k:['hp:AF241','hp:AF243'],c:[]}]}]}]}]}},
 {link:'tg-son',name:'Test Sơn tree',published:true,old_links:[],version:1,created_at:'2026-11-02',
  doc:{k:['x-tam','x-bay'],c:[{k:['hp:W317','hp:W315'],c:[]},{k:['x-phuc','x-thuong'],c:[{k:['x-huy','x-anhdao'],c:[{k:['x-khoa'],c:[]}]},{k:['x-bao'],c:[]}]},{k:['x-phuong','x-lam'],c:[]}]}},
 {link:'tg-lone',name:'Test lone tree',published:true,old_links:[],version:1,created_at:'2026-11-03',doc:{k:['x-lone'],c:[]}}];
async function answer(route){const u=new URL(route.request().url()),path=u.pathname.replace('/rest/v1/','');let rows=[];
 if(path==='trees'){const o=u.searchParams.get('or');rows=o?trees.filter(t=>o.includes('link.eq.'+t.link+',')):trees}
 else if(path==='people'){const v=u.searchParams.get('id')||'';const ids=(/^in\.\((.*)\)$/.exec(v)||[,''])[1].split(',').map(decodeURIComponent);rows=ids.filter(i=>people[i]).map(id=>({id,data:people[id]}))}
 route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows)})}
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+TAG+' '+m);if(!c)fail++};
 const c=await b.newContext(VP);await c.addInitScript(()=>{try{sessionStorage.setItem('hft-splash-seen','1')}catch(e){}});await c.route('https://*.supabase.co/**',answer);
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(BASE+'?tree=hanh-paternal');await p.waitForTimeout(3000);
 ok(await p.evaluate(()=>{const r=document.getElementById('pRel'),c=document.getElementById('pClear');return !!r&&c&&r.nextElementSibling===c&&/Relationship/.test(r.textContent)}),'side panel: "Relationship" right above Clear focal');
 await p.evaluate(()=>document.getElementById('pRel').click());await p.waitForSelector('#relCard.on');await p.waitForTimeout(1500);
 ok(await p.evaluate(()=>document.getElementById('relA').value===''&&document.getElementById('relB').value===''),'both fields start empty');
 const pickName=async(f,typed,re)=>{await p.fill('#rel'+f,'');await p.type('#rel'+f,typed,{delay:20});await p.waitForTimeout(300);
  const items=await p.$$eval('#rel'+f+'L li',l=>l.map(x=>x.innerText.replace(/\s+/g,' ').trim()));const i=items.findIndex(x=>re.test(x));
  if(i>=0)await p.click(`#rel${f}L li >> nth=${i}`);return {items,i}};
 let r=await pickName('A','Hanh',/^Hạnh, son of Hậu and Thường, husband of Hương$/);ok(r.i>=0,'"Hanh" lists: Hạnh, son of Hậu and Thường, husband of Hương — '+JSON.stringify(r.items.slice(0,4)));
 r=await pickName('B','Kygo',/^Khoa \(Kygo\), son of Huy and Anh Đào$/);ok(r.i>=0,'"Kygo" lists: Khoa (Kygo), son of Huy and Anh Đào — '+JSON.stringify(r.items.slice(0,3)));
 await p.waitForTimeout(300);let out=await p.$eval('#relOut',e=>e.innerText.replace(/\s+/g,' '));
 ok(/Khoa \(Kygo\) is your Cháu — he is related to you by being your second cousin's son, via your Bà Nội Lịch and her brother Cư\./.test(out),'Hạnh → Kygo: '+out.slice(0,170));
 ok(/Hạnh \(Kygo\)|Hạnh \(you\)/.test(out)&&/Hậu/.test(out)&&/Lịch/.test(out)&&/Cư/.test(out)&&/Thương/.test(out)&&/Huy/.test(out),'Hạnh → Kygo: the path, person by person: '+out.slice(170,420));
 await p.screenshot({path:`${OUT}/rel-hanh-kygo-${TAG}.png`});
 await p.click('#relSwap');await p.waitForTimeout(300);out=await p.$eval('#relOut',e=>e.innerText.replace(/\s+/g,' '));
 ok(await p.inputValue('#relA')==='Khoa (Kygo)'&&await p.inputValue('#relB')==='Hạnh','swap: the two names change places');
 ok(/Hạnh is your Chú — he is related to you by being your father's second cousin, via your Ông Cố Nội Cư and his sister Lịch\./.test(out),'Kygo → Hạnh: '+out.slice(0,170));
 await p.screenshot({path:`${OUT}/rel-kygo-hanh-${TAG}.png`});
 const ans=(a,x)=>p.evaluate(([a,x])=>window.RELANSWER(a,x).then(h=>{const d=document.createElement('div');d.innerHTML=h;return d.innerText.replace(/\s+/g,' ')}),[a,x]);
 out=await ans('x-bao','x-phuong');ok(/Phưởng is your Dì/.test(out)&&/also Bác/.test(out)&&/Related two ways/.test(out),'Bảo → Phưởng: Dì first, also Bác — '+out.slice(0,200));
 out=await ans('x-bao','x-lam');ok(/Lâm is your Dượng — he is related to you by marriage: he is the husband of your Dì Phưởng/.test(out)&&/also Bác/.test(out),'Bảo → Lâm: Dượng (husband of Dì Phưởng), also Bác — '+out.slice(0,160));
 out=await ans('x-bao','hp:W360');ok(/Hùng is not a blood relative — he is related to you by marriage: he is your Mợ Văn's brother\./.test(out)&&/No set title/.test(out)&&/═/.test(out),'Bảo → Hùng: '+out.slice(0,200));
 out=await ans('hp:AF241','x-lone');ok(/No family link found between Hạnh and Lẻ in the trees yet\./.test(out),'no link: said plainly');
 out=await ans('hp:AF241','hp:AF241');ok(/same person/.test(out),'the same person twice');
 ok(!errs.length,'no page errors '+errs.join('|'));
 await p.keyboard.press('Escape');await p.waitForTimeout(300);ok(await p.evaluate(()=>!document.getElementById('relCard').classList.contains('on')),'Esc closes the card');
 await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
