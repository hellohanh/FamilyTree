// Entry 204: a man with two wives (Ông Hai) — each wife's children's line starts between her and the husband, in Simple,
// Side and Top (and in the direct line above Hậu); lines stay straight. Screenshots for Hanh.
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());await ctx.addInitScript(()=>{try{sessionStorage.setItem('hft-splash-seen','1')}catch(e){}});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/');await p.waitForTimeout(6000);
 for(const [v,id,who] of [['simple','pSimple','Hai'],['side','pSide','Hai'],['top','pTop','Hai'],['side','pSide','Hậu']]){
  await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1200);
  await p.evaluate(w=>{FOCAL=Object.values(CP).find(x=>x.nm===w&&(w!=='Hai'||x.i===0)&&(w!=='Hai'||x.d.data.n.length===3));paintFocal();paneSync()},who);
  await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(6500);
  if(v!=='simple'||tag==='desktop'){
   // where each wife's line starts, compared with her card and the husband's card
   const r=await p.evaluate(([v])=>{const sv=document.getElementById(v==='simple'?'ssv':'fsv');const box=n=>{const g=[...sv.querySelectorAll('g.fc,g.card')].find(G=>[...G.querySelectorAll('text')].some(t=>t.textContent===n));return g&&g.querySelector('rect').getBoundingClientRect()};
    return {hai:box('Hai'),lich:box('Lịch'),thuong:box('Thương (Tường)')}},[v]);
   const pr=x=>x?`${Math.round(x.left)},${Math.round(x.top)} ${Math.round(x.width)}×${Math.round(x.height)}`:'—';
   console.log(`  ${tag} ${v} (${who}): Lịch ${pr(r.lich)} · Hai ${pr(r.hai)} · Thương ${pr(r.thuong)}`);
  }
  await p.screenshot({path:`${OUT}/wives-${tag}-${v}-${who==='Hai'?'hai':'hau'}.png`})}
 ok(errs.length===0,`${tag}: no errors ${errs.join('|')}`);await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
