// Entry 207: Admin → Edit toggle on the main page (against the local database copy; run publish_reset.sh first).
// Off: no pencils. On: a pencil on every card in Simple, Side and Top; Hanh's saves go straight in (no Review step),
// also into a database tree; stays on through the reload after a save. Public / family: no toggle. Editors' page:
// no toggle, pencils always on. Usage: node edit_toggle.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const SON='son-s-trung-van-paternal-grandparents';
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const who=async c=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(c=>{try{sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(e){}},c);return ctx};
 const open=async(ctx,url,wait=6500)=>{const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto('http://localhost:8765'+url);await p.waitForTimeout(wait);return p};
 const pens=p=>p.evaluate(()=>document.querySelectorAll('.pencil').length);
 const view=async(p,id)=>{await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hậu')||FOCAL;if(window.paintFocal)paintFocal()});await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(4500)};
 // ---------- public ----------
 let ctx=await who({}),p=await open(ctx,'/');
 ok(await p.evaluate(()=>!document.getElementById('pEditOn')),`${TAG} public: no Edit toggle`);
 await view(p,'pSide');ok(await pens(p)===0,`${TAG} public: no pencils in Side`);await ctx.close();
 // ---------- Hanh ----------
 ctx=await who(ADMIN);p=await open(ctx,'/');
 const order=await p.evaluate(()=>[...document.querySelectorAll('#pane .item')].map(e=>e.id).filter(x=>['pSug','pEditOn','pPic'].includes(x)).join(','));
 ok(order==='pSug,pEditOn,pPic',`${TAG} Hanh: Edit sits under Edit Tree (${order})`);
 const st=()=>p.evaluate(()=>{const e=document.getElementById('pEditOn');return e.getAttribute('aria-pressed')+' | '+e.querySelector('.sub').textContent});
 ok(/^false/.test(await st()),`${TAG} Hanh: Edit off at first (${await st()})`);
 await view(p,'pSide');ok(await pens(p)===0,`${TAG} Hanh: off → no pencils in Side`);
 const w0=await p.evaluate(()=>Math.max(...[...document.querySelectorAll('#family rect')].map(r=>+r.getAttribute('width')||0)));
 if(TAG==='phone')await p.evaluate(()=>document.body.classList.add('pane-open'));await p.waitForTimeout(400);
 await p.evaluate(()=>document.getElementById('pEditOn').click());await p.waitForTimeout(1500);
 if(TAG==='phone')await p.evaluate(()=>document.body.classList.add('pane-open'));await p.waitForTimeout(400);
 await p.screenshot({path:`${OUT}/edit-${TAG}-pane-on.png`});
 if(TAG==='phone'){await p.evaluate(()=>document.body.classList.remove('pane-open'));await p.waitForTimeout(500)}
 ok(/^true/.test(await st()),`${TAG} Hanh: Edit on (${await st()})`);
 const nCards=await p.evaluate(()=>document.querySelectorAll('#family .card, #family g.card').length);
 const nS=await pens(p);ok(nS>5,`${TAG} Hanh: on → pencils in Side (${nS})`);
 await p.screenshot({path:`${OUT}/edit-${TAG}-side.png`});
 await view(p,'pTop');ok(await pens(p)>5,`${TAG} Hanh: pencils in Top (${await pens(p)})`);await p.screenshot({path:`${OUT}/edit-${TAG}-top.png`});
 await view(p,'pSimple');ok(await pens(p)>1,`${TAG} Hanh: pencils in Simple (${await pens(p)})`);await p.screenshot({path:`${OUT}/edit-${TAG}-simple.png`});
 // tap a pencil → that person's edit pop-up
 const nm=await p.evaluate(()=>{const g=document.querySelector('.pencil');g.dispatchEvent(new MouseEvent('click',{bubbles:true}));return g.querySelector('title').textContent});await p.waitForTimeout(800);
 ok(await p.evaluate(()=>{const o=document.querySelector('.ov.on, #edOv.on, [id^=ed].on');return !!o}),`${TAG} Hanh: pencil (${nm}) opens the edit pop-up`);
 await p.screenshot({path:`${OUT}/edit-${TAG}-popup.png`});
 await p.keyboard.press('Escape');await p.waitForTimeout(400);
 // save straight in
 const before=(await L.q("select count(*)::int n from updates where status='ok'")).rows[0].n;
 await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Hậu');MINH.DB.people[q.cell].alt='EditTest'});
 const r=await p.evaluate(async()=>await MINH.save(null));
 const after=(await L.q("select count(*)::int n from updates where status='ok'")).rows[0].n,pend=(await L.q("select count(*)::int n from updates where status='pending'")).rows[0].n;
 ok(r.ok&&after===before+1&&pend===0,`${TAG} Hanh: save goes straight in (confirmed ${before}→${after}, pending ${pend})`);
 await p.reload();await p.waitForTimeout(6500);
 ok(/^true/.test(await st()),`${TAG} Hanh: Edit still on after the reload`);
 ok(await p.evaluate(()=>Object.values(CP).some(x=>/EditTest/.test(x.nm))&&MINH.PEND.size===0),`${TAG} Hanh: the change shows, not marked Pending`);
 ok(/Saved into the tree/.test(await p.evaluate(()=>document.getElementById('toast').textContent)),`${TAG} Hanh: "Saved into the tree"`);
 // database tree (Sơn's): written into the tree itself
 await p.goto('http://localhost:8765/?tree='+SON);await p.waitForTimeout(6500);   // same tab: Edit stays on
 ok(/^true/.test(await st()),`${TAG} Hanh: Edit still on in another tree`);
 await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Trung');MINH.DB.people[q.cell].alt='EditSon'});
 const r2=await p.evaluate(async()=>await MINH.save(null));
 const row=(await L.q("select data->>'alt' a from people where id='hp:W317'")).rows[0];
 ok(r2.ok&&row&&row.a==='EditSon',`${TAG} Hanh: on Sơn's tree it is written into the tree (${row&&row.a})`);
 // off again → saves go to Review as before
 await p.evaluate(()=>document.getElementById('pEditOn').click());await p.waitForTimeout(500);
 await p.evaluate(()=>{const q=Object.values(CP).find(x=>/Trung/.test(x.nm));MINH.DB.people[q.cell].alt='EditOff'});await p.evaluate(async()=>await MINH.save(null));
 ok((await L.q("select count(*)::int n from updates where status='pending'")).rows[0].n===1,`${TAG} Hanh: Edit off → the save waits in Review changes`);
 ok(!p.errs.length,`${TAG} Hanh: no page errors ${p.errs.join('|')}`);await ctx.close();
 // ---------- family code only ----------
 ctx=await who({'hft-family-code':'FAM123','hft-photo-sender':'Lan'});p=await open(ctx,'/');ok(await p.evaluate(()=>!document.getElementById('pEditOn')),`${TAG} family: no Edit toggle`);await ctx.close();
 // ---------- editors' page ----------
 ctx=await who(ADMIN);p=await open(ctx,'/editor/?tree=thuong',7000);
 ok(await p.evaluate(()=>!document.getElementById('pEditOn')),`${TAG} editors' page: no Edit toggle`);
 await view(p,'pSide');ok(await pens(p)>0,`${TAG} editors' page: pencils always on (${await pens(p)})`);
 ok(!p.errs.length,`${TAG} editors' page: no page errors ${p.errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
