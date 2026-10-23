const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const errs=[];
for(const g of [100,150]){const p=await b.newPage({viewport:{width:1600,height:1000}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto(`file://${S}/mock/family-tree.html?gen=${g}&sheet=`+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForTimeout(300);
 await p.evaluate(()=>focusByLabel('Hậu & Thường'));await p.waitForTimeout(2300);await p.screenshot({path:`${S}/mock/gen-${g}.png`});
 if(g===150){ // drive the rail to 200 to prove it re-lays out
   await p.$eval('#rGen',el=>{el.value=200;el.dispatchEvent(new Event('input'))});await p.waitForTimeout(900);await p.screenshot({path:`${S}/mock/gen-200-rail.png`});}
 await p.close();}
console.log(errs);await b.close();})();
