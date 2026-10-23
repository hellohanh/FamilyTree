const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));
 await p.waitForTimeout(300); await p.evaluate(()=>focusByLabel('Hậu & Thường')); await p.waitForTimeout(2200);
 console.log(await p.evaluate(()=>{
   const out=[]; document.querySelectorAll('g.card').forEach(g=>{
     const t=g.querySelectorAll('text'); const sym=t[0], nmT=t[1];
     out.push([nmT.textContent, sym.getBoundingClientRect().height.toFixed(1), nmT.getBoundingClientRect().height.toFixed(1)]);});
   return JSON.stringify({cam:document.querySelector('svg>g').getAttribute('transform'), cards:out});}));
 await b.close();})();
