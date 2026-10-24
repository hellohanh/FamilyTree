const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:900,height:800}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('data:text/html,<h1>previous site</h1>');
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
const st=()=>p.evaluate(()=>mode+(focusNode?' @ '+label(focusNode.data):'')+' | toast: '+(document.getElementById('toast').classList.contains('on')?document.getElementById('toast').textContent:'-')).catch(()=>'LEFT → '+p.url().slice(0,40));
const clickNode=async lbl=>{await p.evaluate(l=>{const n=nodes.find(d=>label(d.data)===l);let pt;if(mode==='sun'){const c=ARC.centroid(n),t=d3.zoomTransform(svg.node()),r=svg.node().getBoundingClientRect();pt=[r.x+t.applyX(c[0]),r.y+t.applyY(c[1])]}else{const el=d3.selectAll('path.node').filter(d=>d===n).node().getBoundingClientRect();pt=[el.x+el.width/2,el.y+12]}window.__pt=pt},lbl);const [x,y]=await p.evaluate(()=>window.__pt);await p.mouse.click(x,y);await p.waitForTimeout(2400)};
const out=[];
await clickNode('Hai & Lịch & Thương / Tường'); out.push('click Hai: '+await st());
await clickNode('Hậu & Thường'); out.push('click Hậu: '+await st());
for(let i=1;i<=5;i++){ const was=await p.evaluate(()=>mode).catch(()=>'x'); await p.goBack({waitUntil:'commit'}).catch(()=>{}); await p.waitForTimeout(was==='focus'?2400:300); out.push('back'+i+': '+await st()) }
console.log(out.join('\n'),errs);await b.close();})();
