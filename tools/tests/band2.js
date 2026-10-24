const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const out=[];
for(const [w,h,n] of [[1400,800,'wide'],[402,874,'phone']]){
const p=await b.newPage({viewport:{width:w,height:h}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?nointro');await p.waitForFunction(()=>window.__ready);
for(const [lbl,k] of [['Hai & Lịch & Thương / Tường','hai'],['Hậu & Thường','hau']]){
 await p.evaluate(l=>focusByLabel(l),lbl);await p.waitForTimeout(2500);
 out.push(n+' '+k+': two='+await p.evaluate(()=>!!document.querySelector('#band span.me.two'))+' '+errs.join(';'));
 await p.screenshot({path:S+`/mock/band2-${n}-${k}.png`,clip:{x:0,y:0,width:w,height:Math.min(h,170)}});
 await p.evaluate(()=>unfocus());await p.waitForTimeout(2300);}
await p.close();}
console.log(out.join('\n'));await b.close();})();
