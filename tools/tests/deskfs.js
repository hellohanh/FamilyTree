const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
const px=()=>p.evaluate(()=>{const t=document.querySelector('g.plabel text');if(!t)return null;const k=d3.zoomTransform(svg.node()).k;return {op:getComputedStyle(gLabels.node()).opacity,k:+k.toFixed(3),attr:+(+t.getAttribute('font-size')).toFixed(2),screen:+(t.getAttribute('font-size')*k).toFixed(1)}});
await p.waitForTimeout(500);console.log('wheel',await px());
await p.click('#snapB');for(const t of [100,400,700,1500]){await p.waitForTimeout(t===100?100:300);console.log('snap +'+t,await px())}
await p.click('#genNext');await p.waitForTimeout(1500);console.log('next',await p.evaluate(()=>{const ts=[...document.querySelectorAll('g.plabel text')];const k=d3.zoomTransform(svg.node()).k;return ts.slice(0,5).map(t=>(t.getAttribute('font-size')*k).toFixed(1)).join(',')}));
await b.close();})();
