const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:2});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);await p.waitForTimeout(300);
await p.screenshot({path:S+'/mock/menu-1.png'});
await p.tap('#menuB');await p.waitForTimeout(200);await p.screenshot({path:S+'/mock/menu-2.png'});
// focus a couple then open menu to see focus-mode options
await p.tap('#menuB');await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);focus(nodes.find(d=>d.data.members[0].cell==='W236'))});await p.waitForTimeout(2500);
await p.screenshot({path:S+'/mock/menu-3.png'});
await p.tap('#menuB');await p.waitForTimeout(200);await p.screenshot({path:S+'/mock/menu-4.png'});
await p.tap('#centralT');await p.waitForTimeout(800);const open=await p.evaluate(()=>document.getElementById('hdr').classList.contains('open')), c=await p.evaluate(()=>CENTRAL);
const d=await b.newPage({viewport:{width:1400,height:800}});await d.goto('file://'+S+'/mock/family-tree.html?nointro');await d.waitForFunction(()=>window.__ready);await d.screenshot({path:S+'/mock/menu-desktop.png',clip:{x:0,y:0,width:1400,height:80}});
console.log('menu open after pick:',open,'CENTRAL',c,'errors',errs);await b.close();})();
