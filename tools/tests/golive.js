// Entry 139: v2 at the main link — every file loads from the root, /v2/ redirects, links between trees work
const {chromium}=require('playwright');const OUT=process.argv[2],TAG=process.argv[3]||'desktop',B='http://localhost:8765/';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const b=await chromium.launch(),ctx=await b.newContext(VP);
 await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
 const p=await ctx.newPage(),bad=[],errs=[];
 p.on('response',r=>{if(r.status()>=400)bad.push(r.status()+' '+r.url())});p.on('requestfailed',r=>{if(!r.url().includes('supabase'))bad.push('FAIL '+r.url())});p.on('pageerror',e=>errs.push(e.message));
 await p.goto(B);await p.waitForTimeout(1200);await p.screenshot({path:OUT+'/golive1_splash_'+TAG+'.png'});
 await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(4500);
 await p.screenshot({path:OUT+'/golive2_wheel_'+TAG+'.png'});
 const fonts=await p.evaluate(async()=>{await document.fonts.ready;return [...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)});
 await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(4500);
 const imgs=await p.evaluate(()=>[...document.querySelectorAll('image')].map(i=>i.getAttribute('href')).filter((v,i,a)=>a.indexOf(v)===i).length);
 await p.evaluate(()=>document.body.classList.add('pane-open'));await p.waitForTimeout(500);await p.screenshot({path:OUT+'/golive3_pane_'+TAG+'.png'});
 console.log(TAG,'| title:',await p.title(),'| fonts:',[...new Set(fonts)].join(','),'| distinct images in Simple:',imgs);
 await p.goto(B+'v2/?x=1#h');await p.waitForTimeout(1500);console.log('/v2/?x=1#h →',p.url());
 await p.goto(B+'minh/');await p.waitForTimeout(2500);
 const h=await p.evaluate(()=>[...document.querySelectorAll('#pane a.item')].map(a=>a.textContent.trim().slice(0,40)+' → '+a.href));console.log('minh TREES:',h);
 console.log('bad requests:',bad.length?bad:'none','| page errors:',errs.length?errs:'none');await b.close()})();
