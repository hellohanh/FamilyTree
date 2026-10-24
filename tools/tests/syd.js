const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
const out=[];
for(const sh of ['H.HN.T Paternal Tree','H.HN.T Maternal Tree']){
 await p.goto('file://'+S+'/mock/family-tree.html?nointro&sheet='+encodeURIComponent(sh));await p.waitForFunction(()=>window.__ready);
 const r=await p.evaluate(()=>{const ms=[...MEMBER_NODE.keys()];setView(ms.find(m=>m.name==='Sydney'),true);
   const want=ms.filter(m=>/^(Sơn|Thủy|Sương|Jim|Văn|Trung|Hứa|Hướng|Đường|Nho)/.test(m.name||''));
   return want.map(m=>{const n=MEMBER_NODE.get(m).n;return (relTitle(m)||'—')+' '+m.name+'  ['+n.ancestors().slice(1,3).map(a=>a.data.members.map(x=>firstName(x)).join('&')).join(' < ')+']'})});
 out.push('== '+sh+'\n  '+r.join('\n  '));}
console.log(out.join('\n'),errs);await b.close();})();
