const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});const errs=[];
const presets=[['S',2000,0,65]];
for(const [k,dur,cs,ce] of presets){const p=await b.newPage({viewport:{width:1200,height:800}});p.on('pageerror',e=>errs.push(e.message));
 await p.goto(`file://${S}/mock/family-tree.html?dur=${dur}&cs=${cs}&ce=${ce}&sheet=`+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForTimeout(300);
 await p.evaluate(()=>{window._t0=performance.now();focusByLabel('Ông Thiện/Xinh & Bà Hải')});
 const out=[];let i=0;
 for(const f of [0,.2,.4,.6,.8,1.0]){const t=f*dur;const now=await p.evaluate(()=>performance.now()-window._t0);if(t>now)await p.waitForTimeout(t-now);
  out.push(await p.evaluate(()=>{const e=[...document.querySelectorAll('path.node')].find(e=>d3.select(e).datum()===focusNode);return e?e.getAttribute('fill'):'?'}));
  await p.screenshot({path:`${S}/mock/s2-${k}-${i++}.png`,clip:{x:0,y:60,width:1200,height:740}});}
 console.log(k,dur,cs,ce,out.join(' | '));await p.close();}
console.log(errs);await b.close();})();
