const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);await p.waitForTimeout(300);
const cdp=await ctx.newCDPSession(p);
const T=(type,pts)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:pts.map(([x,y],i)=>({x,y,id:i}))});
const k=()=>p.evaluate(()=>d3.zoomTransform(svg.node()).k.toFixed(3));
const c=await p.evaluate(()=>{const r=document.querySelector('path.node').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
const k0=await k(); await p.screenshot({path:S+'/mock/pinch-0.png'});
// pinch OUT with both fingers on the wheel
await T('touchStart',[[c[0]-40,c[1]+60]]); await T('touchStart',[[c[0]-40,c[1]+60],[c[0]+40,c[1]+60]]);
for(let i=1;i<=10;i++){const d=40+i*8; await T('touchMove',[[c[0]-d,c[1]+60],[c[0]+d,c[1]+60]])}
await T('touchEnd',[]); await p.waitForTimeout(200); const k1=await k(); const r1=await p.evaluate(()=>ROT);
await p.screenshot({path:S+'/mock/pinch-1.png'});
// one finger: rotate
const R=90; await T('touchStart',[[c[0]+R,c[1]]]); for(let i=1;i<=10;i++){const a=i/10*Math.PI/3;await T('touchMove',[[c[0]+R*Math.cos(a),c[1]+R*Math.sin(a)]])} await T('touchEnd',[]);
await p.waitForTimeout(700); const r2=await p.evaluate(()=>ROT), m2=await p.evaluate(()=>mode);
// tap still focuses
await p.tap('body',{position:{x:c[0]+70,y:c[1]+20}}).catch(()=>{}); await T('touchStart',[[c[0]+70,c[1]+20]]); await T('touchEnd',[]); await p.waitForTimeout(2500); const m3=await p.evaluate(()=>mode);
console.log('zoom',k0,'→',k1,'| rot after pinch',r1,'| rot after 1-finger',r2.toFixed(3),m2,'| after tap',m3,'| errors',errs);await b.close();})();
