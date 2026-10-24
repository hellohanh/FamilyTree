const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const out=[];
for(const snap of [false,true]){
 const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
 if(snap){await p.click('#snapB');await p.waitForTimeout(800);await p.click('#genNext');await p.waitForTimeout(800)}
 else {await p.evaluate(()=>{svg.call(zoom.scaleBy,2.5,[900,500])});await p.waitForTimeout(500)}
 const pt=name=>p.evaluate(n=>{const g=[...document.querySelectorAll('g.plabel')].find(g=>g.textContent.includes(n));if(!g)return null;const r=g.querySelector('rect.hit').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]},name);
 const name=snap?'Hiền':'Lành';
 let xy=await pt(name); if(!xy){out.push((snap?'snap':'wheel')+': label not found');continue}
 await p.mouse.dblclick(xy[0],xy[1]);await p.waitForTimeout(600);
 const dbl=await p.evaluate(()=>({mode,view:VIEW&&firstName(VIEW)}));
 xy=await pt(name); await p.mouse.click(xy[0],xy[1]);await p.waitForTimeout(2700);
 const one=await p.evaluate(()=>({mode,focus:focusNode&&label(focusNode.data)}));
 out.push((snap?'snap':'wheel')+` ${name}: double-click → ${JSON.stringify(dbl)} | click → ${JSON.stringify(one)} ${errs.join(';')}`);
 // also mouse drag on a label still rotates (no focus)
 await p.waitForTimeout(800);await p.keyboard.press('Escape');await p.waitForTimeout(2600);
 xy=await pt(name); const r0=await p.evaluate(()=>ROT);
 if(xy){await p.mouse.move(xy[0],xy[1]);await p.mouse.down();for(let i=1;i<=10;i++)await p.mouse.move(xy[0],xy[1]-i*15);await p.mouse.up();await p.waitForTimeout(600);
 out.push('   drag on label: ROT '+r0.toFixed(2)+' → '+(await p.evaluate(()=>ROT)).toFixed(2)+', mode '+await p.evaluate(()=>mode))}
 await p.close();}
console.log(out.join('\n'));await b.close();})();
