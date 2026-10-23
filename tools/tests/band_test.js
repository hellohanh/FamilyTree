const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const errs=[];
const cases=[['H.HN.T Paternal Tree','Hậu & Thường','band-hau'],["Huong's Paternal Tree",null,'band-deep'],['H.HN.T Maternal Tree','Thường & Hậu','band-maternal']];
for(const [sheet,lab,file] of cases){const p=await b.newPage({viewport:{width:1600,height:1000}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent(sheet));await p.waitForFunction(()=>window.__ready);await p.waitForTimeout(200);
 await p.evaluate(l=>{const n=l?nodes.find(d=>label(d.data)===l):nodes[0];focus(n)},lab);await p.waitForTimeout(2300);
 console.log(sheet,await p.evaluate(()=>[...document.querySelectorAll('#band span')].map(s=>s.textContent+'@'+Math.round(parseFloat(s.style.left)))));
 await p.screenshot({path:`${S}/mock/${file}.png`});
 if(file==='band-deep'){await p.mouse.move(800,500);for(let i=0;i<5;i++){await p.mouse.wheel(300,400);await p.waitForTimeout(60)}await p.waitForTimeout(300);await p.screenshot({path:`${S}/mock/band-deep-scrolled.png`});}
 await p.close();}
console.log(errs);await b.close();})();
