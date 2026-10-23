const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForTimeout(300);
await p.evaluate(()=>focusByLabel('Lành & Bảy'));await p.waitForTimeout(2300);await p.screenshot({path:S+'/mock/fit-lanh.png'});
// any trimmed names left?
console.log('trimmed:',await p.evaluate(()=>[...document.querySelectorAll('g.card text')].filter(t=>t.textContent.endsWith('…')).map(t=>t.textContent)));
await p.evaluate(()=>focusByLabel('Hậu & Thường'));await p.waitForTimeout(2300);
const pen=await p.evaluateHandle(()=>[...document.querySelectorAll('g.pencil')].find(g=>g.querySelector('title').textContent==='Edit Hậu'));
await pen.asElement().click();await p.waitForTimeout(300);await p.fill('#eM','Văn');await p.fill('#eL','Nguyễn');await p.click('#mSave');await p.waitForTimeout(1200);
await p.screenshot({path:S+'/mock/fit-first.png'});
await p.click('#fullT');await p.waitForTimeout(1200);await p.screenshot({path:S+'/mock/fit-full.png'});
console.log(errs);await b.close();})();
