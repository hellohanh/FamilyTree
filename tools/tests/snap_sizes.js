const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
for(const [w,h] of [[375,667],[430,932]]){const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:true,isMobile:true});const p=await ctx.newPage();
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);await p.tap('#snapB');await p.waitForTimeout(900);await p.tap('#genNext');await p.waitForTimeout(900);
console.log(w+'x'+h, await p.evaluate(()=>'R0='+SG2.R0.toFixed(0)+' B0='+SG2.B0.toFixed(0)+' B1='+SG2.B1.toFixed(0)+' labels '+document.querySelectorAll('g.plabel').length));await ctx.close()}
await b.close();})();
