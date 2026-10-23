const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForFunction(()=>window.__ready);
const cards=()=>p.evaluate(()=>[...document.querySelectorAll('g.card > text')].filter(t=>!t.classList.contains('note')&&t.querySelector('tspan')).map(t=>[...t.querySelectorAll('tspan')].map(s=>s.textContent).join('')).join(' | '));
await p.evaluate(()=>focusByLabel('Hậu & Thường'));await p.waitForTimeout(2300);
// click the eye on Hạnh
const eye=await p.evaluateHandle(()=>[...document.querySelectorAll('g.eye')].find(g=>g.querySelector('title').textContent==='View as Hạnh'));
await eye.asElement().click();await p.waitForTimeout(1200);
console.log('VIEW Hạnh @ Hậu&Thường:',await cards());await p.screenshot({path:S+'/mock/kin-hau.png'});
await p.evaluate(()=>focusByLabel('Thiện/Xinh & Hải'));await p.waitForTimeout(2300);
console.log('\n@ Ông Thiện:',await cards());await p.screenshot({path:S+'/mock/kin-thien.png'});
// view as Hương (spouse) -> should map to Hạnh
await p.evaluate(()=>focusByLabel('Hậu & Thường'));await p.waitForTimeout(2300);
const eye2=await p.evaluateHandle(()=>[...document.querySelectorAll('g.eye')].find(g=>g.querySelector('title').textContent==='View as Hương'));
await eye2.asElement().click();await p.waitForTimeout(1200);
console.log('\nView as Hương -> chip:',await p.evaluate(()=>document.getElementById('viewName').textContent));
console.log(errs);await b.close();})();
