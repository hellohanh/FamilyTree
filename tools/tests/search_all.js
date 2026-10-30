// Entry 215: the Options search also finds people in every other published tree ("In other trees"); a tap opens that
// tree with them as the focal. Local copy of Hanh's 2026-10-30 backup. Usage: node search_all.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(()=>{sessionStorage.setItem('hft-splash-seen','1')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(7000);
 if(TAG==='phone')await p.evaluate(()=>document.body.classList.add('pane-open'));
 await p.click('#q');await p.type('#q','Phúc',{delay:60});await p.waitForTimeout(3000);
 const R=await p.evaluate(()=>({here:[...document.querySelectorAll('#res > button')].map(b=>b.innerText.replace(/\n/g,' | ')),other:[...document.querySelectorAll('#res .xres button')].map(b=>b.innerText.replace(/\n/g,' | ')),hd:(document.querySelector('#res .xhd')||{}).textContent}));
 console.log('   this tree:',R.here.join(' // '));console.log('   other trees:',R.other.join(' // '));
 ok(R.hd==='In other trees'&&R.other.some(t=>/Phúc/.test(t)&&/Sơn's/.test(t))&&R.other.some(t=>/Grandma/.test(t)),`${TAG}: "Phúc" → In other trees: ${R.other.length} (Sơn's tree and the Grandma tree)`);
 ok(!R.other.some(t=>/Unnamed tree/.test(t)),`${TAG}: unpublished trees not searched`);
 await p.screenshot({path:`${OUT}/search-${TAG}.png`});
 // nobody shown under "other trees" who is already in this tree: Hạnh (shared with the Grandma tree)
 await p.fill('#q','');await p.type('#q','Hậu',{delay:60});await p.waitForTimeout(2500);
 const h2=await p.evaluate(()=>[...document.querySelectorAll('#res .xres button')].map(b=>b.innerText.replace(/\n/g,' | ')));
 ok(!h2.some(t=>/^Hậu \|.*Grandma/.test(t)),`${TAG}: Hậu (also in the Grandma tree) only listed once (${h2.length} other-tree hits)`);
 // tap → opens Sơn's tree with Phúc (Thương's wife) as the focal
 await p.fill('#q','');await p.type('#q','Phúc',{delay:60});await p.waitForTimeout(2500);
 await p.evaluate(()=>{const b=[...document.querySelectorAll('#res .xres button')].find(b=>/Sơn's/.test(b.innerText)&&/con của Tám/.test(b.innerText));b.click()});
 await p.waitForTimeout(8000);
 const f=await p.evaluate(()=>({u:location.search,f:FOCAL?FOCAL.nm:null,simple:document.body.classList.contains('simple')}));
 ok(/son-s-trung-van/.test(f.u)&&f.f==='Phúc'&&f.simple,`${TAG}: tap → ${decodeURIComponent(f.u)} — focal ${f.f}, Simple view`);
 await p.screenshot({path:`${OUT}/search-${TAG}-opened.png`});
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 // editors' page search finds the published trees too
 const e=await ctx.newPage();await e.goto('http://localhost:8765/editor/?tree=son-s-trung-van-paternal-grandparents');await e.waitForTimeout(7000);
 if(TAG==='phone')await e.evaluate(()=>document.body.classList.add('pane-open'));
 await e.click('#q');await e.type('#q','Hiền',{delay:60});await e.waitForTimeout(3000);
 const eo=await e.evaluate(()=>[...document.querySelectorAll('#res .xres button')].map(b=>b.innerText.replace(/\n/g,' | ')));
 ok(eo.some(t=>/Hiền/.test(t)&&/Paternal Grandpa/.test(t)),`${TAG} editors' page: "Hiền" → ${eo.slice(0,3).join(' // ')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
