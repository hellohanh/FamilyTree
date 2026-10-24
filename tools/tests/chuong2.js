const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage();
await p.goto('file://'+S+'/mock/family-tree.html?nointro&sheet='+encodeURIComponent("Huong's Paternal Tree"));await p.waitForFunction(()=>window.__ready);
console.log(await p.evaluate(()=>{const ms=[...MEMBER_NODE.keys()];const c=ms.find(m=>m.name==='Chương');setView(c,true);const v=MEMBER_NODE.get(c).n;
 const par=v.ancestors().slice(1,4).map(a=>a.data.members.map(x=>firstName(x)+(x.gender||'')).join('&')).join(' < ');
 return 'Chương path: '+par+'\n'+ms.filter(m=>/^(Hương|Hạnh|Hải|Bomp|Adam|Noah|Trinh|Mikey)/.test(m.name||'')).map(m=>(relTitle(m)||'—')+' '+m.name).join(' | ')}));await b.close();})();
