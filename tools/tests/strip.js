const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1200,height:800}});
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForTimeout(300);
await p.evaluate(()=>{window._t0=performance.now();focusByLabel('Hậu & Thường')});
let i=0;for(const t of [0,240,480,720,960,1300]){const now=await p.evaluate(()=>performance.now()-window._t0);if(t>now)await p.waitForTimeout(t-now);
 await p.screenshot({path:`${S}/mock/strip-${i++}.png`,clip:{x:0,y:60,width:1200,height:740}});}
await b.close();})();
