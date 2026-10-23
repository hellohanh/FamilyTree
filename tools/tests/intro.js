const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1400,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const t0=Date.now();await p.goto('file://'+S+'/mock/family-tree.html');
for(const [t,n] of [[1000,'a'],[3500,'b'],[4600,'c']]){const w=t-(Date.now()-t0);if(w>0)await p.waitForTimeout(w);await p.screenshot({path:S+'/mock/intro-'+n+'.png'})}
console.log(errs, await p.evaluate(()=>!!document.getElementById('intro')));await b.close();})();
