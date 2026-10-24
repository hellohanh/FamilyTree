const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:402,height:874},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
await p.tap('#snapB');await p.waitForTimeout(700);await p.tap('#genNext');await p.waitForTimeout(700);await p.tap('#genNext');await p.waitForTimeout(700);
const cdp=await ctx.newCDPSession(p);const T=(t,pts)=>cdp.send('Input.dispatchTouchEvent',{type:t,touchPoints:pts.map(([x,y],i)=>({x,y,id:i}))});
for(const x of [100,300]){
 const before=await p.evaluate(()=>[ROT.toFixed(3),d3.zoomTransform(svg.node()).toString()]);
 const hit=await p.evaluate(x=>document.elementsFromPoint(x,600).slice(0,5).map(e=>e.tagName+'.'+e.getAttribute('class')+(e.__data__&&e.__data__.data?'['+e.__data__.data.members[0].name+' d'+e.__data__.depth+']':'')).join(' > '),x);
 await T('touchStart',[[x,600]]);for(let i=1;i<=10;i++)await T('touchMove',[[x,600-i*25]]);await T('touchEnd',[]);await p.waitForTimeout(400);
 console.log(x,hit,before,await p.evaluate(()=>[ROT.toFixed(3),d3.zoomTransform(svg.node()).toString()]));}
console.log(errs);await b.close();})();
