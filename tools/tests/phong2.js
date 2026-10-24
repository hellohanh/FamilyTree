const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [w,h,mob] of [[402,874,1],[874,402,1],[1440,900,0]]){
const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:!!mob,isMobile:!!mob});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://127.0.0.1:8766/');await p.waitForFunction(()=>window.__ready,null,{timeout:20000});await p.waitForTimeout(4200);
await p.click('#snapB');await p.waitForTimeout(900);
const out=[];
for(let i=0;i<3;i++){ out.push(await p.evaluate(()=>{const g=document.getElementById('genLbl').innerText.split('\n')[0];const lab=[...document.querySelectorAll('g.plabel')].filter(g=>/Phong|Trinh$/.test(g.textContent.trim()));return g+': '+lab.length}));
  await p.click('#genNext').catch(()=>{});await p.waitForTimeout(900)}
if(w===874) await p.screenshot({path:'/tmp/claude-0/-home-claude/731041ab-81cf-5e01-970b-635136d4b283/scratchpad/mock/landscape.png'});
console.log(w+'x'+h+(mob?' touch':' mouse'),out.join(' | '),errs);await ctx.close()}
await b.close();})();
