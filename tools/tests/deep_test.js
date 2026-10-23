const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const errs=[];
for(const [sheet,lab,file] of [["Huong's Paternal Tree",null,'deep-huong'],['H.HN.T Paternal Tree','Hậu & Thường','font-hau']]){
 const p=await b.newPage({viewport:{width:1600,height:1000}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent(sheet));await p.waitForFunction(()=>window.__ready);await p.waitForTimeout(200);
 await p.evaluate(l=>{const n=l?nodes.find(d=>label(d.data)===l):nodes[0];focus(n)},lab);await p.waitForTimeout(2300);
 console.log(sheet, await p.evaluate(()=>({font:document.fonts.check('15px "HFT Segoe"'),levels:[...document.querySelectorAll('text.lvl')].map(t=>t.textContent),
   used:getComputedStyle(document.querySelector('h1')).fontFamily.slice(0,30)})));
 await p.screenshot({path:`${S}/mock/${file}.png`});await p.close();}
console.log(errs);await b.close();})();
