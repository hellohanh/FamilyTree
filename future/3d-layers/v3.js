const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p=await b.newPage({viewport:{width:1400,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
await p.click('#b3d');await p.waitForTimeout(400);await p.screenshot({path:S+'/mock/v3-0.png'});
await p.waitForTimeout(2500);await p.screenshot({path:S+'/mock/v3-1.png'});
// drag to look more from side
await p.mouse.move(700,500);await p.mouse.down();await p.mouse.move(700,580,{steps:8});await p.mouse.up();await p.waitForTimeout(300);
await p.screenshot({path:S+'/mock/v3-2.png'});
console.log(errs.slice(0,5));await b.close();})();
