const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForTimeout(300);
await p.evaluate(()=>{window._t0=performance.now();focusByLabel('Hậu & Thường')});
for(const t of [100,300,600,900,1150,1300,1600]){await p.waitForTimeout(t-(await p.evaluate(()=>performance.now()-window._t0)));
 console.log(t, await p.evaluate(()=>{const ps=[...document.querySelectorAll('path.node')].filter(e=>+getComputedStyle(e).opacity>0.9);return ps.map(e=>e.getAttribute('fill')).slice(0,3).join(' ')}));}
await b.close();})();
