// Entry 200: Sơn's (Trung/Văn) Paternal Grandparents linked to Hạnh's Paternal tree (supabase/10_link_son_trung_van.sql),
// checked against a local copy of the database from Hanh's backup after the script ran (database hft29).
const {chromium}=require('playwright');const {Client}=require('pg');const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const db=new Client({host:'/var/tmp/hftpg',port:5499,user:'postgres',database:'hft29'});await db.connect();await db.query('set role anon');
 async function answer(route){const req=route.request(),u=new URL(req.url()),path=u.pathname.replace('/rest/v1/','');
  try{let rows;const sel=(u.searchParams.get('select')||'*').split(',').map(c=>c.replace(/[^a-z_*]/g,'')).join(',');
   if(path==='trees'&&u.searchParams.get('or')){const x=/link\.eq\.([^,]+),/.exec(u.searchParams.get('or'))[1];rows=(await db.query('select id,link,old_links,name,doc,version from trees where link=$1 or $1=any(old_links)',[decodeURIComponent(x)])).rows}
   else if(path==='trees')rows=(await db.query('select '+sel+' from trees order by created_at')).rows;
   else if(path==='people'){const v=u.searchParams.get('id');const ids=v?/^in\.\((.*)\)$/.exec(v)[1].split(',').map(decodeURIComponent):[];rows=(await db.query('select id,data from people where id=any($1)',[ids])).rows}
   else if(path==='tree_names')rows=(await db.query('select link,name from tree_names')).rows;
   else if(path==='updates'||path==='photos')rows=(await db.query('select '+sel+' from '+path+" where status<>'rejected' order by id")).rows;
   else if(path.startsWith('rpc/')){const fn=path.slice(4),a=JSON.parse(req.postData()||'{}'),ks=Object.keys(a);rows=(await db.query(`select public.${fn}(${ks.map((k,i)=>`${k}=>$${i+1}`).join(',')}) as r`,ks.map(k=>typeof a[k]==='object'&&!Array.isArray(a[k])?JSON.stringify(a[k]):a[k]))).rows[0].r}
   else return route.fulfill({status:200,contentType:'application/json',body:'[]'});
   route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows)})}catch(e){route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({message:e.message})})}}
 const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',answer);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/minh/?tree=son-s-trung-van-paternal-grandparents');await p.waitForTimeout(7000);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000);
 const info=await p.evaluate(()=>{const v=Object.values(CP);const f=n=>v.find(x=>x.nm===n);return {n:v.length,van:f('Văn')&&f('Văn').cell,trung:f('Trung')&&f('Trung').cell,kids:f('Trung')?(f('Trung').d.children||[]).map(c=>c.data.n[0]):[],title:document.title}});
 ok(info.n===70-11+11-11+11||info.n>40,`${TAG}: tree opens (${info.n} people · ${info.title})`);
 ok(info.van==='hp:W315'&&info.trung==='hp:W317',`${TAG}: Văn / Trung are the shared records (${info.van}, ${info.trung})`);
 ok(JSON.stringify(info.kids)===JSON.stringify(['Sơn','Thủy','Thảo Huyền','Hoàng']),`${TAG}: their children: ${info.kids.join(', ')}`);
 const last=await p.evaluate(()=>MINH.DB.people['hp:W317'].last);ok(last==='Trần',`${TAG}: Trung's last name ${last}`);
 await p.screenshot({path:`${OUT}/son-${TAG}-wheel.png`});
 await p.evaluate(()=>{FOCAL=Object.values(CP).find(x=>x.nm==='Trung');paintFocal();paneSync();document.getElementById('pSimple').click()});await p.waitForTimeout(5000);
 await p.screenshot({path:`${OUT}/son-${TAG}-simple.png`});
 ok(errs.length===0,`${TAG}: Minh's page no errors ${errs.join(' | ')}`);
 // The Multiverse: Hạnh's Paternal + Sơn's tree → links between them
 const q=await ctx.newPage();const e3=[];q.on('pageerror',e=>e3.push(e.message));
 await q.addInitScript(()=>{try{localStorage.setItem('hft-3d-pick',JSON.stringify(['hanh-paternal','son-s-trung-van-paternal-grandparents']));localStorage.removeItem('hft-3d-order')}catch(e){}});
 await q.goto('http://localhost:8765/3d/');await q.waitForTimeout(6000);
 ok(await q.evaluate(()=>TREES.some(t=>t.link==='son-s-trung-van-paternal-grandparents')),`${TAG}: The Multiverse lists Sơn's tree`);
 if(TAG==='phone'){await q.click('#pickBtn');await q.waitForTimeout(400)}await q.click('#go');await q.waitForTimeout(800);if(await q.evaluate(()=>document.getElementById('ordDlg').classList.contains('on')))await q.click('#ordOK');await q.waitForTimeout(3500);
 const th=await q.evaluate(()=>({discs:discs.length,threads:threads.length,who:[...new Set(threads.map(t=>t.userData.per&&t.userData.per[0].w.nm))].slice(0,12)}));
 ok(th.discs===2&&th.threads>=11,`${TAG}: The Multiverse links them: ${th.threads} links (${th.who.join(', ')})`);
 await q.screenshot({path:`${OUT}/son-${TAG}-3d.png`});ok(e3.length===0,`${TAG}: The Multiverse no errors ${e3.join(' | ')}`);
 await b.close();await db.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
