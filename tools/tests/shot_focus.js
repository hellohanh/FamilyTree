const {chromium}=require('playwright-core');
(async()=>{
  const S=process.argv[2], [w,h,pre]=[+process.argv[3],+process.argv[4],process.argv[5]];
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:pre==='ph'?2:1,hasTouch:pre==='ph'});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));
  await p.waitForTimeout(400); await p.screenshot({path:`${S}/mock/${pre}1-sunburst.png`});
  console.log(await p.evaluate(()=>focusByLabel('Ông Thiện/Xinh & Bà Hải')));
  await p.waitForTimeout(380); await p.screenshot({path:`${S}/mock/${pre}2-morphing.png`});
  await p.waitForTimeout(1800); await p.screenshot({path:`${S}/mock/${pre}3-focus.png`});
  console.log(await p.evaluate(()=>focusByLabel('Hậu & Thường')));
  await p.waitForTimeout(2200); await p.screenshot({path:`${S}/mock/${pre}4-refocus.png`});
  await p.keyboard.press('Escape'); await p.waitForTimeout(600); await p.screenshot({path:`${S}/mock/${pre}5-back-mid.png`});
  await p.waitForTimeout(1500); await p.screenshot({path:`${S}/mock/${pre}6-back.png`});
  console.log('errors',errs); await b.close();
})();
