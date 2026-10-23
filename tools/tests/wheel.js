const {chromium}=require('playwright-core');
(async()=>{const S=process.argv[2];const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1600,height:1000}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+S+'/mock/family-tree.html?sheet='+encodeURIComponent('H.HN.T Paternal Tree'));await p.waitForTimeout(300);
await p.evaluate(()=>focusByLabel('Ông Thiện/Xinh & Bà Hải'));await p.waitForTimeout(2300);
const t0=await p.evaluate(()=>document.querySelector('svg>g').getAttribute('transform'));
await p.screenshot({path:S+'/mock/side-wide-top.png'});
await p.mouse.move(800,500); for(let i=0;i<40;i++){await p.mouse.wheel(0,250);await p.waitForTimeout(60);}
await p.waitForTimeout(300);
const t1=await p.evaluate(()=>document.querySelector('svg>g').getAttribute('transform'));
await p.screenshot({path:S+'/mock/side-wide-scrolled.png'});
console.log('before',t0,'\nafter ',t1,'\n',errs);await b.close();})();
