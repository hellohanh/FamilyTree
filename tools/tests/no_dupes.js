// Entry 214: nobody appears twice in a tree. Hanh's case (2026-10-30 backup loaded locally): linking Bà Lịch's family into
// the Grandma tree (updates 87–89) re-added Hậu's children to the Grandpa tree — two "Hạnh con của Hậu". Every tree on
// the main page: no person shown twice (same id, or a shared id hp:<cell> beside its own cell).
const {chromium}=require('playwright');const live=require('./livedb.js');const OUT=process.argv[2];
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 for(const t of ['hanh-paternal','hanh-maternal','huong-paternal','huong-maternal','hanh-maternal-grandpa','son-s-trung-van-paternal-grandparents']){
  const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(()=>{sessionStorage.setItem('hft-splash-seen','1')});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:8765/?tree='+t);await p.waitForTimeout(7000);
  const r=await p.evaluate(()=>{const seen={},d=[];Object.values(CP).forEach(c=>{const k=String(c.cell).startsWith('hp:')?c.cell:(window.PID?window.PID(c.cell):c.cell);if(seen[k])d.push(c.nm+' ('+c.cell+' / '+seen[k]+')');seen[k]=c.cell});
   const kids=n=>{const q=Object.values(CP).find(x=>x.nm===n&&x.i===0);if(!q)return '';const f=MINH.find(q.cell);return (f.node.c||[]).map(c=>MINH.disp(MINH.DB.people[c.k[0]])).join(', ')};
   return {n:Object.keys(CP).length,d,hau:kids('Hậu')}});
  ok(!r.d.length&&!errs.length,`${t}: ${r.n} people, ${r.d.length} shown twice${r.d.length?': '+r.d.slice(0,6).join(' · '):''}${r.hau?' | Hậu\'s children: '+r.hau:''}`);await ctx.close()}
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
