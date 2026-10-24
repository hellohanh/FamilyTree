const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const p=await b.newPage({viewport:{width:1440,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>{setView([...MEMBER_NODE.keys()].find(m=>m.name==='Hạnh'),true);focusByLabel('Hiền & Cháu')});await p.waitForTimeout(2500);
const cards=await p.evaluate(()=>[...document.querySelectorAll('g.card > text')].map(t=>[...t.querySelectorAll('tspan')].map(s=>s.textContent).join('')).filter(x=>/\(/.test(x)).join(' | '));
await p.screenshot({path:S+'/mock/alt.png'});
// editor fields for Nhàn
const ed=await p.evaluate(()=>{const n=nodes.find(d=>d.data.members[0].name==='Nhàn');openEditor(n,0);return [document.getElementById('eF').value,document.getElementById('eA').value,document.getElementById('mTitle').textContent]});
console.log(cards,'\neditor:',ed,errs);await b.close();})();
