// Entry 219: the focal lasts one visit only. Same tab: picked in the Grandpa tree → follows to Sơn's tree (titles) and
// back. A new session (new browser / closed tab — a fresh context, or a new tab) → no focal, no titles, no pill. An old
// saved copy (Entry 211 kept it in localStorage) is cleared. Usage: node focal_session.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const SON='son-s-trung-van-paternal-grandparents';
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const mk=async(old)=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(o=>{try{sessionStorage.setItem('hft-splash-seen','1');if(o&&!sessionStorage.getItem('t-old')){sessionStorage.setItem('t-old','1');localStorage.setItem('hft-focal-x',o)}}catch(e){}},old||null);return ctx};
 const st=p=>p.evaluate(()=>({f:FOCAL?FOCAL.cell:null,pill:!!document.getElementById('xtPill'),xt:!!window.XT,ss:!!sessionStorage.getItem('hft-focal-x'),ls:!!localStorage.getItem('hft-focal-x')}));
 let ctx=await mk(),p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(7000);
 await p.evaluate(()=>{FOCAL=CP['AF241'];paintFocal()});let s=await st(p);
 ok(s.f==='AF241'&&s.ss&&!s.ls,`${TAG}: picked → kept for this visit only (tab ${s.ss}, saved ${s.ls})`);
 await p.goto('http://localhost:8765/?tree='+SON);await p.waitForTimeout(8000);s=await st(p);
 ok(s.pill&&s.xt,`${TAG}: same tab → Sơn's tree: titles for Hạnh`);
 await p.goto('http://localhost:8765/');await p.waitForTimeout(7000);s=await st(p);
 ok(s.f==='AF241',`${TAG}: same tab → back to the Grandpa tree: Hạnh is still the focal`);
 // a new tab in the same browser
 const p2=await ctx.newPage();await p2.goto('http://localhost:8765/?tree='+SON);await p2.waitForTimeout(8000);s=await st(p2);
 ok(!s.f&&!s.pill&&!s.xt,`${TAG}: a new tab → no focal, no titles`);
 await ctx.close();
 // a new session (browser closed and opened again)
 ctx=await mk();p=await ctx.newPage();await p.goto('http://localhost:8765/');await p.waitForTimeout(7000);s=await st(p);
 ok(!s.f&&!s.ss,`${TAG}: a new session → no focal`);await ctx.close();
 // someone with the old saved focal (from before this change)
 ctx=await mk(JSON.stringify({id:'hp:AF241',cell:'AF241',nm:'Hạnh',from:'hanh-paternal',titles:{'hp:W317':'Dượng'},gen:{},bl:{}}));p=await ctx.newPage();
 await p.goto('http://localhost:8765/?tree='+SON);await p.waitForTimeout(8000);s=await st(p);
 ok(!s.f&&!s.pill&&!s.ls,`${TAG}: an old saved focal is cleared, not used`);await ctx.close();
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
