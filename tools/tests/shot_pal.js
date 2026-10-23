const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const errs=[];
for(const pal of ['brown','marigold','gray','blue','branch']){const p=await b.newPage({viewport:{width:1200,height:1000}});
 p.on('pageerror',e=>errs.push(pal+e.message));
 await p.goto('file://'+S+'/mock/family-tree.html?pal='+pal+'&sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForTimeout(400);
 await p.screenshot({path:`${S}/mock/pal-${pal}.png`});await p.close();}
console.log(errs);await b.close();})();
