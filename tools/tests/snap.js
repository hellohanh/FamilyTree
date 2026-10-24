const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},hasTouch:true,isMobile:true,deviceScaleFactor:3});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);await p.waitForTimeout(300);
const shot=async n=>{await p.waitForTimeout(700);await p.screenshot({path:S+'/mock/snap-'+n+'.png'})};
await shot(1);
await p.tap('#snapB');await shot(2);
await p.tap('#genNext');await shot(3);
await p.tap('#genNext');await shot(4);
// one-finger swipe up on the band = turn the wheel
const cdp=await ctx.newCDPSession(p);const T=(t,pts)=>cdp.send('Input.dispatchTouchEvent',{type:t,touchPoints:pts.map(([x,y],i)=>({x,y,id:i}))});
await T('touchStart',[[300,600]]);for(let i=1;i<=12;i++)await T('touchMove',[[300,600-i*25]]);await T('touchEnd',[]);await shot(5);
console.log('errors',errs, await p.evaluate(()=>({SNAP,SNAPG,ROT:+ROT.toFixed(2)})));await b.close();})();
