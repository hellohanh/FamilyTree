const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);focus(nodes.find(d=>d.data.members[0].cell==='N262'))});await p.waitForTimeout(2500);
const get=()=>p.evaluate(()=>[...document.querySelectorAll('g.card > text')].map(t=>[...t.querySelectorAll('tspan')].map(s=>s.textContent).join('')).filter(x=>/Tường|Kỳ|Văn/.test(x)).join(', ')+' | band: '+document.getElementById('band').innerText.replace(/\n/g,' · '));
console.log('ON :',await get());await p.screenshot({path:S+'/mock/central-on.png',clip:{x:0,y:0,width:1600,height:110}});
await p.click('#centralT');await p.waitForTimeout(1200);console.log('OFF:',await get());await p.screenshot({path:S+'/mock/central-off.png',clip:{x:0,y:0,width:1600,height:110}});
console.log(errs);await b.close();})();
