// Entry 228 (Hanh): the edit pop-up's name boxes go Last / Middle / First / Nickname (the person and the new person), and
// Tab moves box to box — never onto the suggestions, the "already in another tree" results, the ~INC~ ▾ or godparent results.
// Usage: node name_order.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},ADMIN);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const lab=pre=>p.evaluate(pre=>[...document.getElementById(pre+'F').closest('.grid').querySelectorAll(':scope > div > label')].map(l=>l.textContent).join(' / '),pre);
 const act=()=>p.evaluate(()=>{const a=document.activeElement;return a.id||a.className||a.tagName});
 for(const [page,who] of [['/','Hạnh'],['/editor/?tree=thuong','Thương']]){
  await p.goto('http://localhost:8765'+page);await p.waitForTimeout(7000);
  await p.evaluate(n=>window.EDIT(Object.values(CP).find(x=>x.nm===n||x.nm.startsWith(n))),who);await p.waitForTimeout(900);
  const W=page==='/'?'main':'editor';
  ok(await lab('e')==='Last name / Middle name / First name / Nickname',`${TAG} ${W}: person — ${await lab('e')}`);
  ok(await lab('n')==='Last name / Middle name / First name / Nickname',`${TAG} ${W}: new person — ${await lab('n')}`);
  const r2=await p.evaluate(()=>['eG','nG'].map(id=>{const e=document.getElementById(id);return e.parentElement.firstElementChild===e&&e.nextElementSibling.textContent.trim()==='Has passed'}));
  ok(r2[0]&&r2[1],`${TAG} ${W}: Male / Female comes before Has passed / Adopted (person ${r2[0]}, new person ${r2[1]})`);
  await p.evaluate(()=>document.querySelector('#edOv .mdl').scrollTop=0);await p.screenshot({path:`${OUT}/top-${TAG}-${W}.png`});
  await p.evaluate(()=>document.getElementById('nRow').scrollIntoView({block:'center'}));await p.screenshot({path:`${OUT}/new-${TAG}-${W}.png`});
  if(TAG==='phone')continue;
  // person: type in each box so its suggestions show, then Tab
  const seq=[];await p.focus('#eL');await p.keyboard.type('Tr');await p.waitForTimeout(300);
  const sg=await p.evaluate(()=>document.querySelectorAll('#eLs .sg').length);
  for(let i=0;i<3;i++){await p.keyboard.press('Tab');await p.waitForTimeout(150);seq.push(await act());if(i<2){await p.keyboard.type('H');await p.waitForTimeout(250)}}
  ok(seq.join()==='eM,eF,eA',`${TAG} ${W}: person, Tab goes eL → ${seq.join(' → ')} (${sg} suggestions were showing under Last name)`);
  // new person: Last → Middle → First (with "already in another tree" results) → Nickname
  await p.fill('#nL','');const s2=[];await p.focus('#nL');await p.keyboard.type('Ng');await p.waitForTimeout(300);
  for(let i=0;i<3;i++){await p.keyboard.press('Tab');await p.waitForTimeout(150);s2.push(await act());if(i===1){await p.keyboard.type('Hạ');await p.waitForTimeout(900)}}
  const xo=await p.evaluate(()=>document.querySelectorAll('#edOv .xo').length);
  ok(s2.join()==='nM,nF,nA',`${TAG} ${W}: new person, Tab goes nL → ${s2.join(' → ')} (${xo} other-tree results were showing)`);
  await p.screenshot({path:`${OUT}/names-${TAG}-${W}.png`})}
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
