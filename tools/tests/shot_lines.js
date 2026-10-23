const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForTimeout(300);
await p.evaluate(()=>focusByLabel('Hậu & Thường'));await p.waitForTimeout(2200);await p.screenshot({path:S+'/mock/lines-hau.png'});
await p.evaluate(()=>focusByLabel('Lành & Bảy'));await p.waitForTimeout(2200);await p.screenshot({path:S+'/mock/lines-lanh.png'});
// verify: all horizontal segments per level share one y
console.log(await p.evaluate(()=>{const ys=[...document.querySelectorAll('path.link')].map(e=>e.getAttribute('d').match(/V([-\d.]+)H/)[1]);return [...new Set(ys)].join(', ')}));
console.log(errs);await b.close();})();
