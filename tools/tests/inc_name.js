// Entry 209: ~INC~ in a dropdown on the First name box (person being edited and the new person). Choosing it shows
// ~INC~ in red in the box; saved as "??" → the card shows ~INC~ in red; reopening shows ~INC~ again. Main page (Hanh,
// Edit on) and the editors' page (Sơn's tree, admin). Local database copy (publish_reset.sh first).
// Usage: node inc_name.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const who=async c=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},c);return ctx};
 for(const [pg,url,par] of [['main','/','Hậu'],['editor','/editor/?tree=son-s-trung-van-paternal-grandparents','Trung']]){
  const ctx=await who(ADMIN),p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765'+url);await p.waitForTimeout(7000);
  await p.evaluate(nm=>window.EDIT(Object.values(CP).find(x=>x.nm===nm)),par);await p.waitForTimeout(800);
  ok(await p.evaluate(()=>document.querySelectorAll('#edOv .incb').length===2),`${pg}/${TAG}: a ▾ on both First name boxes`);
  // the new person: ▾ → ~INC~
  await p.evaluate(()=>document.getElementById('nF').scrollIntoView({block:'center'}));
  await p.evaluate(()=>document.querySelector('#nF').parentNode.querySelector('.incb').click());await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!document.querySelector('#nF').parentNode.querySelector('.incm').hidden),`${pg}/${TAG}: the dropdown opens`);
  await p.screenshot({path:`${OUT}/inc-${pg}-${TAG}-menu.png`});
  await p.evaluate(()=>document.querySelector('#nF').parentNode.querySelector('.inco').click());await p.waitForTimeout(300);
  const st=await p.evaluate(()=>{const i=document.getElementById('nF');return i.value+' | '+getComputedStyle(i).color});
  ok(/^~INC~ \| rgb\(255, 107, 91\)/.test(st),`${pg}/${TAG}: box shows ~INC~ in red (${st})`);
  ok(await p.evaluate(()=>/~INC~/.test(document.getElementById('edNR').textContent)),`${pg}/${TAG}: the new row reads ~INC~`);
  await p.screenshot({path:`${OUT}/inc-${pg}-${TAG}-chosen.png`});
  await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(7500);
  const card=await p.evaluate(()=>{const q=Object.values(CP).find(x=>window.isINC(x.nm)&&MINH.DB.people[x.cell]&&MINH.DB.people[x.cell].added);return q?{cell:q.cell,first:MINH.DB.people[q.cell].first}:null});
  ok(card&&card.first==='??',`${pg}/${TAG}: saved as "??" (${JSON.stringify(card)})`);
  ok(await p.evaluate(()=>!document.getElementById('linkDlg')||!document.getElementById('linkDlg').classList.contains('on')),`${pg}/${TAG}: no "Same person?" offer for ~INC~`);
  // on its card in Simple view: ~INC~ in red
  await p.evaluate(nm=>{FOCAL=Object.values(CP).find(x=>x.nm===nm);document.getElementById('pSimple').click()},par);await p.waitForTimeout(4000);
  const red=await p.evaluate(()=>[...document.querySelectorAll('#simple text, svg text')].filter(t=>/~INC~/.test(t.textContent)).map(t=>t.getAttribute('fill')));
  ok(red.length&&red.every(f=>/ff6b5b|d1452b/i.test(f)),`${pg}/${TAG}: card shows ~INC~ in red (${red.join(',')})`);
  await p.screenshot({path:`${OUT}/inc-${pg}-${TAG}-card.png`});
  // reopen that person: the box shows ~INC~ (red); a real name typed over it clears the red
  await p.evaluate(c=>window.EDIT(CP[c]),card.cell);await p.waitForTimeout(800);
  ok(await p.evaluate(()=>{const i=document.getElementById('eF');return i.value==='~INC~'&&i.classList.contains('isinc')}),`${pg}/${TAG}: reopened → ~INC~ in red`);
  await p.fill('#eF','Lan');ok(await p.evaluate(()=>!document.getElementById('eF').classList.contains('isinc')),`${pg}/${TAG}: typing a name clears the red`);
  ok(!errs.length,`${pg}/${TAG}: no page errors ${errs.join('|')}`);await ctx.close()}
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
