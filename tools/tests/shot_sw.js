const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:520},deviceScaleFactor:1.5});await p.goto('file://'+S+'/sw/swatches.html');await p.waitForTimeout(200);
await p.screenshot({path:S+'/sw/swatches.png',fullPage:true});await b.close();})();
