// Entry 239 (Hanh: "ensure that the numbered dots are all align correctly across the site … the number 1 dot for Binh
// is incorrectly rotated"): every birth-order badge is turned to the line through its own spot (it was turned like the
// middle of its segment, so on a wide segment it leaned). Every tree, whole wheel and snapped, computer + phone.
// Usage: node badge_angle.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(()=>{sessionStorage.setItem('hft-splash-seen','1')});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const check=()=>p.evaluate(()=>{let n=0,bad=[];document.querySelectorAll('g.sib').forEach(g=>{const t=g.getAttribute('transform');const m=t.match(/translate\(([-\d.e]+),([-\d.e]+)\).*rotate\(([-\d.e]+)\)/);if(!m)return;n++;
   const a=Math.atan2(+m[1],-+m[2])*180/Math.PI-90;let d=((+m[3]-a)%360+540)%360-180;if(Math.abs(d)>0.5)bad.push(g.textContent+':'+d.toFixed(1)+'°')});return {n,bad}});
 const trees=await (async()=>{await L.q('reset role');const r=(await L.q('select link from trees where published')).rows.map(x=>x.link);await L.q('set role anon');return ['',...r]})();
 for(const t of trees){await p.goto('http://localhost:8765/'+(t?'?tree='+t:''));await p.waitForTimeout(7000);
  let r=await check();ok(r.n>0&&!r.bad.length,`${TAG} ${t||'grandpa'} whole wheel: ${r.n} badges, leaning: ${r.bad.join(' ')||'none'}`);
  // snapped, every pair of rings
  const box=await p.evaluate(()=>{const s=document.querySelector('#sun')||document.querySelector('svg');const q=s.getBoundingClientRect();return {x:q.x+q.width/2,y:q.y+q.height/2,h:q.height}});
  await p.mouse.click(box.x+box.h*.12,box.y-box.h*.05);await p.waitForTimeout(1500);
  let all=0,bad=[];for(let i=0;i<6;i++){r=await check();all+=r.n;bad.push(...r.bad);if(await p.evaluate(()=>{const n=document.getElementById('next');return !n||n.disabled}))break;await p.evaluate(()=>document.getElementById('next').click());await p.waitForTimeout(1300)}
  ok(!bad.length,`${TAG} ${t||'grandpa'} snapped: ${all} badges, leaning: ${bad.join(' ')||'none'}`);
  if(!t)await p.screenshot({path:`${OUT}/badges-${TAG}.png`})}
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
