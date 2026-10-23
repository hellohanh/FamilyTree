const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
 const p=await b.newPage({viewport:{width:1600,height:1000}});
 await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));
 await p.waitForTimeout(300); await p.evaluate(()=>focusByLabel('Hậu & Thường')); await p.waitForTimeout(2200);
 console.log(await p.evaluate(()=>{const g=document.querySelector('g.card'); const t=[...g.querySelectorAll('text')];
   // gap in card units: name.x - (sym.x + sym width)
   return t.map(x=>x.textContent+':x='+x.getAttribute('x')+' w='+x.getBBox().width.toFixed(1)+' fs='+x.getAttribute('font-size')).join(' | ')}));
 await b.close();})();
