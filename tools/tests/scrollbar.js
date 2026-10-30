// Entry 202: slim scrollbars — 3 px, no background, small arrows; the pane's bar measured and photographed
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 for(const [pg,url,el] of [['main','/','pane'],['editor','/editor/?tree=x','pane'],['3d','/3d/','pane']]){
  const ctx=await b.newContext({viewport:{width:1440,height:700},deviceScaleFactor:2});await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
  await ctx.addInitScript(()=>{try{sessionStorage.setItem('hft-splash-seen','1')}catch(e){}});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765'+url);await p.waitForTimeout(5000);
  await p.evaluate(()=>{const c=document.getElementById('codeDlg');if(c)c.classList.remove('on')});
  const w=await p.evaluate(id=>{const e=document.getElementById(id);return {bar:e.offsetWidth-e.clientWidth-(parseFloat(getComputedStyle(e).borderLeftWidth)+parseFloat(getComputedStyle(e).borderRightWidth)),scroll:e.scrollHeight>e.clientHeight}},el);
  ok(w.scroll&&w.bar===3,`${pg}: the pane scrolls and its scrollbar is ${w.bar}px wide`);
  const r=await p.evaluate(id=>{const x=document.getElementById(id).getBoundingClientRect();return {x:x.right-30,y:x.top,h:x.height}},el);
  await p.screenshot({path:`${OUT}/sb-${pg}-top.png`,clip:{x:r.x,y:r.y,width:30,height:70}});
  await p.evaluate(id=>{const e=document.getElementById(id);e.scrollTop=e.scrollHeight/2},el);await p.waitForTimeout(200);
  await p.screenshot({path:`${OUT}/sb-${pg}-mid.png`,clip:{x:r.x-200,y:r.y,width:230,height:r.h}});
  if(pg==='main')await p.screenshot({path:`${OUT}/sb-${pg}-full.png`});
  ok(!errs.length,`${pg}: no errors ${errs.join('|')}`);await ctx.close()}
 await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
