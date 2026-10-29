// Entries 192–193: The Multiverse — navigation pane always there (same items as the main page, each landing on the main
// page), "Pick up to 5 trees" and "How to use" as collapsible secondary panels (remembered), turning resumes 1 s after
// any interaction; phones: handle on the left, Trees / How to buttons. Main page: ?open= / ?q= / Miền Trung remembered.
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
const L=(p,id)=>p.evaluate(i=>{const r=document.getElementById(i).getBoundingClientRect();return [Math.round(r.left),Math.round(r.width)]},id);
const show3d=async p=>{if(await p.evaluate(()=>innerWidth<=820)){await p.click('#pickBtn');await p.waitForTimeout(400)}await p.click('#go');await p.waitForTimeout(800);if(await p.evaluate(()=>document.getElementById('ordDlg').classList.contains('on')))await p.click('#ordOK');await p.waitForTimeout(3500)};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]].filter(([t])=>!process.argv[3]||t===process.argv[3])){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
 await ctx.addInitScript(()=>{try{localStorage.setItem('hft-minh-admin','1');sessionStorage.setItem('hft-splash','1')}catch(e){}});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/3d/?from=hanh-maternal');await p.waitForTimeout(4000);await show3d(p);
 const ids=await p.evaluate(()=>[...document.querySelectorAll('#pane .item')].map(e=>e.id||e.textContent.trim().split('\n')[0].slice(0,24)));
 ok(['pClear','pWhole','pSide','pTop','pSimple','pCentral'].every((x,i)=>ids[i]===x),`${tag}: pane starts ${ids.slice(0,6).join(' · ')}`);
 ok(['pSug','pPic','p3d','pReview','pNewTree','pRenTree','pBackup','pCode'].every(x=>ids.includes(x)),`${tag}: Edit Tree, Add a picture, The Multiverse, Admin items present`);
 ok(await p.evaluate(()=>document.getElementById('p3d').classList.contains('here')),`${tag}: The Multiverse marked Open now`);
 ok(await p.evaluate(()=>document.getElementById('pClear').disabled),`${tag}: Clear focal greyed`);
 ok(/Hạnh's Maternal/.test(await p.evaluate(()=>document.getElementById('pSideSub').textContent)),`${tag}: views name the tree you came from: "${await p.evaluate(()=>document.getElementById('pSideSub').textContent)}"`);
 const trees=await p.evaluate(()=>[...document.querySelectorAll('#pane a.item.tree')].map(a=>a.querySelector('.grow').firstChild.textContent.trim()));
 ok(trees.length>=4&&trees.every((t,i)=>!i||trees[i-1].localeCompare(t,'vi',{sensitivity:'base'})<=0),`${tag}: TREES ${trees.length}, alphabetical`);
 if(tag==='desktop'){
  ok(JSON.stringify(await L(p,'pane'))==='[0,240]',`desktop: pane docked ${JSON.stringify(await L(p,'pane'))}`);
  ok(JSON.stringify(await L(p,'pick'))==='[240,280]'&&JSON.stringify(await L(p,'how'))==='[520,250]'&&(await L(p,'stage'))[0]===770,`desktop: Pick ${await L(p,'pick')} · How ${await L(p,'how')} · 3D from ${(await L(p,'stage'))[0]}`);
  await p.screenshot({path:`${OUT}/mv-desktop-both-open.png`});
  await p.click('#pickT');await p.waitForTimeout(600);
  ok((await L(p,'pick'))[1]===44&&(await L(p,'how'))[0]===284&&(await L(p,'stage'))[0]===534,`desktop: Pick collapsed → How at ${(await L(p,'how'))[0]}, 3D from ${(await L(p,'stage'))[0]}`);
  await p.screenshot({path:`${OUT}/mv-desktop-pick-shut.png`});
  await p.click('#howT');await p.waitForTimeout(600);
  ok((await L(p,'stage'))[0]===328&&await p.evaluate(()=>document.getElementById('pickT').textContent+document.getElementById('howT').textContent)==='››',`desktop: both collapsed → 3D from ${(await L(p,'stage'))[0]}, toggles ››`);
  await p.screenshot({path:`${OUT}/mv-desktop-both-shut.png`});
  await p.reload();await p.waitForTimeout(3000);ok(await p.evaluate(()=>document.body.classList.contains('pickShut')&&document.body.classList.contains('howShut')),'desktop: both remembered after reload');
  await p.click('#pickS');await p.click('#howT');await p.waitForTimeout(600);ok((await L(p,'stage'))[0]===770,'desktop: expanded again (strip and toggle)');
  await show3d(p);
  // turning picks up again 1 s after letting go
  const th=()=>p.evaluate(()=>th);
  await p.mouse.move(1100,500);await p.mouse.down();await p.mouse.move(1150,500,{steps:5});await p.mouse.up();
  await p.waitForTimeout(500);const a=await th();await p.waitForTimeout(300);ok(Math.abs(await th()-a)<1e-6,'0.5–0.8 s after letting go: paused');
  await p.waitForTimeout(700);const c=await th();await p.waitForTimeout(300);ok(await th()>c,'about 1.2 s after: turning again');
  // pane links
  const href=id=>p.evaluate(i=>document.getElementById(i).href||'',id);
  ok(/\/\?tree=hanh-maternal&open=edit$/.test(await href('pSug')),'Edit Tree → main page, open=edit');
  ok(/\/\?tree=hanh-maternal&admin&open=review$/.test(await href('pReview')),'Review changes → main page');
  await p.fill('#q','thuong');await p.waitForTimeout(300);const r=await p.evaluate(()=>[...document.querySelectorAll('#res button')].slice(0,3).map(b=>b.textContent));
  ok(r.length>0,`search across trees: ${r.join(' | ')}`);await p.screenshot({path:`${OUT}/mv-desktop-search.png`});
  await Promise.all([p.waitForNavigation(),p.click('#res button')]);await p.waitForTimeout(5000);
  ok(/[?&]tree=/.test(p.url())&&await p.evaluate(()=>document.getElementById('q').value.length>0&&document.querySelectorAll('#res button').length>0),`search result → main page with the name searched (${await p.evaluate(()=>document.getElementById('q').value)})`);
  await p.goto('http://localhost:8765/3d/?from=hanh-maternal');await p.waitForTimeout(3000);
  await Promise.all([p.waitForNavigation(),p.click('#pSide')]);await p.waitForTimeout(7000);
  ok(await p.evaluate(()=>document.body.classList.contains('side')&&/maternal/i.test(location.search+document.title)),`Side view → main page Side view on the Maternal tree (${await p.evaluate(()=>document.title)})`);
  ok(!/open=/.test(p.url()),'…and the link is cleaned up afterwards');
  // Miền Trung shared
  await p.evaluate(()=>document.getElementById('pCentral').click());const m=await p.evaluate(()=>localStorage.getItem('hft-central'));
  await p.goto('http://localhost:8765/3d/');await p.waitForTimeout(2500);ok(m==='0'&&await p.evaluate(()=>document.getElementById('pCentral').getAttribute('aria-pressed'))==='false','Miền Trung off on the main page → off on The Multiverse');
  await p.evaluate(()=>document.getElementById('pCentral').click());
 }else{
  ok(await p.evaluate(()=>getComputedStyle(document.getElementById('rHandle')).display!=='none'),'phone: handle on the left');
  await p.screenshot({path:`${OUT}/mv-phone.png`,timeout:15000}).catch(e=>console.log("SHOT FAIL mv-phone.png",e.message.split("\n")[0]));
  await p.evaluate(()=>document.getElementById('rHandle').click());await p.waitForTimeout(500);ok((await L(p,'pane'))[0]>=0,'phone: pane slides in');
  await p.screenshot({path:`${OUT}/mv-phone-pane.png`,timeout:15000}).catch(e=>console.log("SHOT FAIL mv-phone-pane.png",e.message.split("\n")[0]));
  await p.mouse.click(380,500);await p.waitForTimeout(500);ok(!await p.evaluate(()=>document.body.classList.contains('pane-open')),'phone: tap outside closes it');
  await p.click('#pickBtn');await p.waitForTimeout(500);await p.screenshot({path:`${OUT}/mv-phone-trees.png`,timeout:15000}).catch(e=>console.log("SHOT FAIL mv-phone-trees.png",e.message.split("\n")[0]));ok(await p.evaluate(()=>document.body.classList.contains('picking')),'phone: Trees opens the list');
  await p.click('#howBtn');await p.waitForTimeout(500);ok(await p.evaluate(()=>document.body.classList.contains('howOpen')&&!document.body.classList.contains('picking')),'phone: How to swaps with Trees');
 }
 ok(errs.length===0,`${tag}: no errors ${errs.join(' | ')}`);await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
