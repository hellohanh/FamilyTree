const {chromium}=require('playwright-core');
(async()=>{
  const S=process.argv[2];
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const errs=[];
  for (const [l,sheet,w,h,file] of JSON.parse(process.argv[3])){
    const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
    p.on('pageerror',e=>errs.push(l+': '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(l+': '+m.text())});
    await p.goto('file://'+S+'/mock/layouts.html?layout='+l+'&sheet='+encodeURIComponent(sheet));
    await p.waitForTimeout(500);
    await p.screenshot({path:S+'/mock/'+file});
    await p.close();
  }
  console.log('errors:',errs);
  await b.close();
})();
