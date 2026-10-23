const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const cards=()=>p.evaluate(()=>[...document.querySelectorAll('g.card > text')].filter(t=>t.querySelector('tspan')).map(t=>[...t.querySelectorAll('tspan')].map(s=>s.textContent).join('')).join(' | '));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent("Huong's Paternal Tree"));await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>setView([...MEMBER_NODE.keys()].find(m=>firstName(m)==='Chương'),true));
await p.evaluate(()=>focusByLabel('Hoạc & Thọ'));await p.waitForTimeout(2300);
console.log('Chương @ Hoạc & Thọ:',await cards());await p.screenshot({path:S+'/mock/kin-chuong.png'});
// regressions: Hạnh on Paternal & Maternal
for(const [s,lab] of [['H.HN.T Paternal Tree','Thiện/Xinh & Hải'],['H.HN.T Maternal Tree','Vinh & Ngâu']]){
 await p.selectOption('#sheet',s);await p.waitForTimeout(300);
 await p.evaluate(()=>setView([...MEMBER_NODE.keys()].find(m=>firstName(m)==='Hạnh'&&MEMBER_NODE.get(m).i===0),true));
 await p.evaluate(l=>focusByLabel(l),lab);await p.waitForTimeout(2300);
 console.log('\nHạnh @',lab,':',(await cards()).split(' | ').filter(x=>/^(Bác|Chú|Cô|Thím|Cậu|Mợ|Dì|Dượng)/.test(x)).join(' | '));}
console.log(errs);await b.close();})();
