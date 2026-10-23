const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const cards=()=>p.evaluate(()=>[...document.querySelectorAll('g.card > text')].filter(t=>t.querySelector('tspan')).map(t=>[...t.querySelectorAll('tspan')].map(s=>s.textContent).join('')).join(' | '));
// A: set view on Paternal, then switch sheet to Maternal
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>focusByLabel('Hậu & Thường'));await p.waitForTimeout(2300);
await (await p.evaluateHandle(()=>[...document.querySelectorAll('g.eye')].find(g=>g.querySelector('title').textContent==='View as Hạnh'))).asElement().click();await p.waitForTimeout(1000);
await p.selectOption('#sheet','H.HN.T Maternal Tree');await p.waitForTimeout(500);
console.log('after sheet switch, VIEW =',await p.evaluate(()=>VIEW&&firstName(VIEW)));
// B: on Maternal, view as Hạnh and focus Vinh & Ngâu
await p.evaluate(()=>focusByLabel('Thường & Hậu'));await p.waitForTimeout(2300);
await (await p.evaluateHandle(()=>[...document.querySelectorAll('g.eye')].find(g=>g.querySelector('title').textContent==='View as Hạnh'))).asElement().click();await p.waitForTimeout(1000);
await p.evaluate(()=>focusByLabel('Vinh & Ngâu'));await p.waitForTimeout(2300);
console.log('Maternal @ Vinh & Ngâu:',await cards());await p.screenshot({path:S+'/mock/kin-maternal.png'});
console.log(errs);await b.close();})();
