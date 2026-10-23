const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1200,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);await p.waitForTimeout(300);
await p.screenshot({path:S+'/mock/rot-0.png'});
const c=await p.evaluate(()=>{const r=document.querySelector('path.node').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]});
// drag from right of centre, a quarter turn clockwise down
const R=200, steps=20; await p.mouse.move(c[0]+R,c[1]); await p.mouse.down();
for(let i=1;i<=steps;i++){const a=i/steps*Math.PI/2;await p.mouse.move(c[0]+R*Math.cos(a),c[1]+R*Math.sin(a))}
await p.mouse.up(); await p.waitForTimeout(200); await p.screenshot({path:S+'/mock/rot-90.png'});
const st=await p.evaluate(()=>({ROT,mode}));
// a plain click still focuses
await p.mouse.click(c[0]+150,c[1]+40); await p.waitForTimeout(2600); const m2=await p.evaluate(()=>mode);
await p.keyboard.press('Escape'); await p.waitForTimeout(2600); await p.screenshot({path:S+'/mock/rot-back.png'});
console.log(JSON.stringify(st),'after click:',m2,'errors',errs);await b.close();})();
