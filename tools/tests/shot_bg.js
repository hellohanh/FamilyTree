const {chromium}=require('playwright-core');
(async()=>{
  const S=process.argv[2];
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const errs=[];
  for(const bg of ['g100']){
    const p=await b.newPage({viewport:{width:1600,height:1000}});
    p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+S+'/mock/family-tree.html?bg='+bg+'&sheet='+encodeURIComponent('H.HN.T Paternal Tree'));
    await p.waitForTimeout(400); await p.screenshot({path:`${S}/mock/icons30-${bg}-1-sunburst.png`});
    await p.evaluate(()=>focusByLabel('Hậu & Thường')); await p.waitForTimeout(2200);
    await p.screenshot({path:`${S}/mock/icons30-${bg}-2-focus.png`}); await p.close();
  }
  console.log('errors',errs); await b.close();
})();
