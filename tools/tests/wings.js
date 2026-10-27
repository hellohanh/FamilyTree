const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const ctx=await b.newContext(vp);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/v2/index.html');await p.waitForTimeout(5000);await p.mouse.click(200,300);await p.waitForTimeout(800);
 for(const v of ['simple','side','top']){
  await p.evaluate(()=>{FOCAL=CP['W236'];paintFocal()});
  await p.evaluate(id=>document.getElementById(id).click(),v==='simple'?'pSimple':v==='side'?'pSide':'pTop');await p.waitForTimeout(4500);
  await p.screenshot({path:`${OUT}/wings-${tag}-${v}.png`});
  console.log(tag,v,'wings',await p.$$eval('image[href*="wings"]',e=>e.length));
 }
 // Minh page: one person has passed
 await p.goto('http://localhost:8765/minh/index.html');await p.evaluate(()=>{localStorage.setItem('hft-minh-v1',JSON.stringify({v:1,people:{p1:{first:'Test Cha',g:'M',dead:true},p2:{first:'Test Mẹ',g:'F',dead:false},p3:{first:'Thương',g:'F',dead:true}},root:{k:['p1','p2'],c:[{k:['p3'],c:[]}]}}))});
 await p.reload();await p.waitForTimeout(5000);await p.mouse.click(200,300);await p.waitForTimeout(800);
 await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(4500);await p.screenshot({path:`${OUT}/wings-${tag}-minh-simple.png`});
 await p.evaluate(()=>document.getElementById('pSide').click());await p.waitForTimeout(4500);await p.screenshot({path:`${OUT}/wings-${tag}-minh-side.png`});
 console.log(tag,'minh wings',await p.$$eval('image[href*="wings"]',e=>e.length),errs);await ctx.close()}
await b.close()})();
