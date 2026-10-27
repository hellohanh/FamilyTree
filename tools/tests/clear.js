const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const ctx=await b.newContext(vp);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/v2/index.html');await p.waitForTimeout(5000);await p.mouse.click(200,300);await p.waitForTimeout(800);
 for(const v of ['simple','side','top']){const id=v==='simple'?'pSimple':v==='side'?'pSide':'pTop',sv=v==='simple'?'#ssv':'#fsv';
  await p.evaluate(()=>{document.getElementById('pWhole').click()});await p.waitForTimeout(900);
  await p.evaluate(()=>{FOCAL=CP['W236'];paintFocal();paneSync()});
  await p.evaluate(i=>document.getElementById(i).click(),id);await p.waitForTimeout(4500);
  const info=()=>p.evaluate(s=>({chips:document.querySelectorAll(s+' text[font-weight="700"][fill="#161616"]').length,names:[...document.querySelectorAll(s+' text')].map(t=>t.textContent).filter(x=>/Hậu|Cố/.test(x)).slice(0,4),crumb:document.getElementById('crumb').textContent}),sv);
  const before=await info();
  await p.evaluate(()=>document.getElementById('pClear').click());await p.waitForTimeout(2500);
  const after=await info();await p.screenshot({path:`${OUT}/clear-${tag}-${v}.png`});
  console.log(tag,v,'before',JSON.stringify(before),'after',JSON.stringify(after));}
 console.log(errs);await ctx.close()}
await b.close()})();
