const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const cards=()=>p.evaluate(()=>[...document.querySelectorAll('g.card > text')].filter(t=>t.querySelector('tspan')).map(t=>[...t.querySelectorAll('tspan')].map(s=>s.textContent).join('')).join(' | '));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent("Huong's Paternal Tree"));await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>setView([...MEMBER_NODE.keys()].find(m=>firstName(m)==='Uyên'),true));
await p.evaluate(()=>focusByLabel('Hoạc & Thọ'));await p.waitForTimeout(2300);
console.log('Uyên @ Hoạc & Thọ:',await cards());await p.screenshot({path:S+'/mock/kin-uyen.png'});
console.log(errs);await b.close();})();
