const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForFunction(()=>window.__ready);
const band=()=>p.evaluate(()=>[...document.querySelectorAll('#band span')].map(s=>s.textContent).join(' · '));
await p.evaluate(()=>{setView(MEMBER_NODE&&[...MEMBER_NODE.keys()].find(m=>firstName(m)==='Hạnh'&&MEMBER_NODE.get(m).i===0),true)});
for(const [lab,f] of [['Hậu & Thường','bandv-hau'],['Thiện/Xinh & Hải','bandv-thien'],['Lành & Bảy','bandv-lanh']]){
 await p.evaluate(l=>focusByLabel(l),lab);await p.waitForTimeout(2300);console.log(lab,'→',await band());await p.screenshot({path:`${S}/mock/${f}.png`});}
console.log(errs);await b.close();})();
