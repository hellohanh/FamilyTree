// Entry 190: left menu order — Clear focal, Whole wheel, Side view, Top view, Simple … (main page and Minh's page,
// computer and phone); both items still work in their new places.
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 for(const [pg,url] of [['main','http://localhost:8765/'],['minh','http://localhost:8765/minh/']]){
  const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(url);await p.waitForTimeout(6000);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000);
  const ids=await p.evaluate(()=>[...document.querySelectorAll('#pane .item')].map(e=>e.id).filter(Boolean));
  const want=['pClear','pWhole','pSide','pTop','pSimple'];
  ok(JSON.stringify(ids.slice(0,5))===JSON.stringify(want),`${pg}/${tag}: menu starts ${ids.slice(0,5).join(' · ')}`);
  // Clear focal greyed with no focal, on with one; picking it clears; Whole wheel returns to the wheel from a view
  const off=await p.evaluate(()=>{const c=document.getElementById('pClear');return c.disabled||c.classList.contains('off')||getComputedStyle(c).opacity<1});
  ok(off,`${pg}/${tag}: Clear focal greyed with no focal`);
  const has=await p.evaluate(()=>typeof CP!=='undefined'&&Object.values(CP).some(x=>x.nm==='Hậu'));
  if(has){
   await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Hậu');paintFocal();paneSync()});
   await p.evaluate(()=>document.getElementById('pSide').click());await p.waitForTimeout(5000);
   ok(await p.evaluate(()=>document.body.classList.contains('side')),`${pg}/${tag}: Side view opened`);
   const on=await p.evaluate(()=>{const c=document.getElementById('pClear');return !(c.disabled||c.classList.contains('off'))&&/Hậu/.test(c.textContent)});
   ok(on,`${pg}/${tag}: Clear focal on, names Hậu`);
   if(tag==='phone')await p.evaluate(()=>document.body.classList.add('pane-open'));await p.waitForTimeout(400);
   await p.screenshot({path:`${OUT}/pane-${pg}-${tag}.png`});
   await p.evaluate(()=>document.getElementById('pClear').click());await p.waitForTimeout(2500);
   ok(await p.evaluate(()=>!FOCAL),`${pg}/${tag}: Clear focal clears the focal`);
   ok(await p.evaluate(()=>document.body.classList.contains('side')),`${pg}/${tag}: still in Side view after Clear focal`);
   await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(3000);
   ok(await p.evaluate(()=>!document.body.classList.contains('side')&&!document.body.classList.contains('top')&&!document.body.classList.contains('simple')),`${pg}/${tag}: Whole wheel leaves the side view`);
  }else{if(tag==='phone')await p.evaluate(()=>document.body.classList.add('pane-open'));await p.waitForTimeout(400);await p.screenshot({path:`${OUT}/pane-${pg}-${tag}.png`});console.log(`  (${pg}: no local tree data offline — order checked only)`)}
  ok(errs.length===0,`${pg}/${tag}: no page errors ${errs.join(' | ')}`);await ctx.close()}}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
