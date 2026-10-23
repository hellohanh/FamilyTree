const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForFunction(()=>window.__ready);
console.log('shared groups:',await p.evaluate(()=>{const c={};Object.values(DATA).forEach(v=>{(function w(b){b.members.forEach(m=>{c[m.pid]=(c[m.pid]||[]);c[m.pid].push(m.name)});(b.children||[]).forEach(w)})({members:[],children:v.roots})});return Object.values(c).filter(x=>x.length>1).map(x=>x[0]+'×'+x.length).join(', ')}));
await p.evaluate(()=>setView([...MEMBER_NODE.keys()].find(m=>firstName(m)==='Hạnh'&&MEMBER_NODE.get(m).i===0),true));
for(const s of ['H.HN.T Maternal Tree',"Huong's Paternal Tree",'H.HN.T Paternal Tree']){await p.selectOption('#sheet',s);await p.waitForTimeout(400);
 console.log(s,'→ Seen from',await p.evaluate(()=>VIEW&&firstName(VIEW)), '| chip visible:',await p.evaluate(()=>getComputedStyle(document.getElementById('viewChip')).display!=='none'));}
// edit sync: change Hậu's last name on Paternal, check Maternal copy
await p.evaluate(()=>{const m=[...MEMBER_NODE.keys()].find(x=>firstName(x)==='Hậu');allCopies(m).forEach(x=>Object.assign(x,{first:'Hậu',last:'Trần'}))});
console.log('Hậu copies:',await p.evaluate(()=>{const m=[...MEMBER_NODE.keys()].find(x=>firstName(x)==='Hậu');return allCopies(m).map(x=>x.uid+':'+x.last).join(', ')}));
console.log(errs);await b.close();})();
