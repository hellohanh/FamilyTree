const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1400,height:800}});
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForFunction(()=>window.__ready);
await p.evaluate(()=>focusByLabel('Tú & Michael'));await p.waitForTimeout(2400);
await p.screenshot({path:S+'/mock/preggo.png'});await b.close();})();
