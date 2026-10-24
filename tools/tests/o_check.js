const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1100}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);focus(nodes.find(d=>d.data.members[0].cell==='N262'))});await p.waitForTimeout(2500);
const t=await p.evaluate(()=>[...document.querySelectorAll('g.card > text')].map(t=>[...t.querySelectorAll('tspan')].map(s=>s.textContent).join('')).filter(x=>/Hùng|Dương/.test(x)));
console.log([...new Set(t)].join(' | '));console.log('band:',await p.evaluate(()=>document.getElementById('band').innerText.replace(/\n/g,' · ')),errs);
await p.screenshot({path:S+'/mock/o-check.png'});await b.close();})();
