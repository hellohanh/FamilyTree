// Entry 225: the splash still plays in full (leaves fall, tree rebuilt, title) and a tap opens the wheel — main page and
// editors' page; a page coming back after a save skips it; a second page in the same tab skips it (Entry 151).
const {chromium}=require('playwright');const live=require('./livedb.js');const OUT=process.argv[2];
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
  for(const url of ['/','/editor/?tree=son-s-trung-van-paternal-grandparents']){
   const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',async r=>{await new Promise(z=>setTimeout(z,800));return L.answer(r)});
   const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765'+url);
   await p.waitForTimeout(8000);
   const s=await p.evaluate(()=>({sp:!!document.getElementById('splash'),title:getComputedStyle(document.querySelector('#title .an')).opacity}));
   ok(s.sp&&+s.title>0.9,`${tag} ${url}: full splash played — tree rebuilt, title shown (${s.title})`);
   if(url==='/')await p.screenshot({path:`${OUT}/splash-done-${tag}.png`});
   await p.evaluate(()=>document.getElementById('splash').click());await p.waitForTimeout(1500);
   ok(await p.evaluate(()=>!document.getElementById('splash')&&typeof CP!=='undefined'&&Object.keys(CP).length>10),`${tag} ${url}: tap → the wheel, people loaded`);
   await p.goto('http://localhost:8765'+url);await p.waitForTimeout(400);
   ok(await p.evaluate(()=>!document.getElementById('splash')),`${tag} ${url}: same tab again → no splash`);
   ok(!errs.length,`${tag} ${url}: no page errors ${errs.join('|')}`);await ctx.close()}
  // back after a save (new tab, restore waiting): no splash
  const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(()=>{try{if(!sessionStorage.getItem('t1')){sessionStorage.setItem('t1','1');sessionStorage.setItem('hft-main-restore',JSON.stringify({hft:'v',v:'whole',f:null}))}}catch(e){}});
  const p=await ctx.newPage();await p.goto('http://localhost:8765/');await p.waitForTimeout(500);
  ok(await p.evaluate(()=>!document.getElementById('splash')),`${tag}: back after a save → no splash`);await ctx.close()}
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
