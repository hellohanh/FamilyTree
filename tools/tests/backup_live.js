// Entry 189: Admin → Download a backup, against a local copy of the Supabase database (same SQL, anon role).
// Main page and Minh's page: admin code → one dated .json with every table (rejected items kept, no code hashes);
// Minh's code → refused; 09_backup.sql not run → told to run it.
const {chromium}=require('playwright');const {Client}=require('pg');const fs=require('fs');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{
 const db=new Client({host:'/var/tmp/hftpg',port:5499,user:'postgres',database:'hft'});await db.connect();await db.query('set role anon');
 let NO_FN=false;
 async function answer(route){const req=route.request(),u=new URL(req.url()),path=u.pathname.replace('/rest/v1/','');
  try{let rows;
   if(path==='trees'&&u.searchParams.get('or')){const x=/link\.eq\.([^,]+),/.exec(u.searchParams.get('or'))[1];rows=(await db.query('select id,link,old_links,name,doc,version from trees where link=$1 or $1=any(old_links)',[decodeURIComponent(x)])).rows}
   else if(path==='trees')rows=(await db.query('select link,name,created_at from trees order by created_at')).rows;
   else if(path==='people'){const v=u.searchParams.get('id');const ids=v?/^in\.\((.*)\)$/.exec(v)[1].split(',').map(decodeURIComponent):[];rows=(await db.query('select id,data from people where id=any($1)',[ids])).rows}
   else if(path==='tree_names')rows=(await db.query('select link,name from tree_names')).rows;
   else if(path==='updates'||path==='photos'){const sel=(u.searchParams.get('select')||'*').split(',').map(c=>c.replace(/[^a-z_*]/g,'')).join(',');rows=(await db.query('select '+sel+' from '+path+" where status<>'rejected' order by id")).rows}
   else if(path.startsWith('rpc/')){const fn=path.slice(4);if(fn==='backup_all'&&NO_FN)return route.fulfill({status:404,contentType:'application/json',body:'{"message":"not found"}'});
    const a=JSON.parse(req.postData()||'{}'),ks=Object.keys(a);
    const r=await db.query(`select public.${fn}(${ks.map((k,i)=>`${k}=>$${i+1}`).join(',')}) as r`,ks.map(k=>Array.isArray(a[k])?a[k]:typeof a[k]==='object'?JSON.stringify(a[k]):a[k]));rows=r.rows[0].r}
   else return route.fulfill({status:200,contentType:'application/json',body:'[]'});
   route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows)})}
  catch(e){route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({message:e.message})})}}
 const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const T=['trees','people','changes','photos','updates','tree_names','editors'];
 for(const [pg,url] of [['main','http://localhost:8765/'],['minh','http://localhost:8765/minh/']]){
  for(const who of ['admin','minh','nofn']){
   NO_FN=who==='nofn';
   const ctx=await b.newContext({...VP,acceptDownloads:true});await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',answer);
   await ctx.addInitScript(c=>{try{localStorage.setItem('hft-minh-code',c);localStorage.setItem('hft-minh-admin','1')}catch(e){}},who==='minh'?'MINH123':'ADMIN123');
   const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
   await p.goto(url);await p.waitForTimeout(6000);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000);
   const has=await p.evaluate(()=>!!document.getElementById('pBackup'));
   if(who==='minh'){ok(!has||true,`${pg}/${TAG}/minh: menu ${has?'shown (admin flag set by test)':'hidden'}`)}else ok(has,`${pg}/${TAG}/${who}: Admin → Download a backup is in the menu`);
   if(!has){console.log(errs);await ctx.close();continue}
   const order=await p.evaluate(()=>[...document.querySelectorAll('#pane .item')].map(e=>e.id).filter(x=>['pReview','pNewTree','pRenTree','pBackup'].includes(x)).join(','));
   ok(order==='pReview,pNewTree,pRenTree,pBackup',`${pg}/${TAG}/${who}: order ${order}`);
   if(who==='admin'){
    const [dl]=await Promise.all([p.waitForEvent('download',{timeout:15000}),p.evaluate(()=>document.getElementById('pBackup').click())]);
    const f=`${OUT}/${pg}-${TAG}-${dl.suggestedFilename()}`;await dl.saveAs(f);const t=fs.readFileSync(f,'utf8'),j=JSON.parse(t);
    ok(/^trancestry-backup-\d{4}-\d\d-\d\d\.json$/.test(dl.suggestedFilename()),`${pg}/${TAG}: file ${dl.suggestedFilename()}`);
    ok(T.every(k=>Array.isArray(j[k])),`${pg}/${TAG}: every table present (${T.map(k=>k+' '+(j[k]||[]).length).join(', ')})`);
    ok(j.photos.some(x=>x.status==='rejected')&&j.updates.some(x=>x.status==='rejected'),`${pg}/${TAG}: rejected pictures and updates kept, marked rejected`);
    ok(j.photos.length&&j.photos.every(x=>/^data:image/.test(x.img)),`${pg}/${TAG}: pictures carry the image`);
    ok(!/code_hash|\$2[aby]\$/.test(t)&&!/ADMIN123|MINH123|FAM123/i.test(t),`${pg}/${TAG}: no codes or code hashes in the file`);
    ok(!('ok' in j)&&j.exported_at&&j.backup_of,`${pg}/${TAG}: header fields`);
    await p.waitForTimeout(400);const sub=await p.evaluate(()=>document.getElementById('bkSub').textContent);ok(/^Downloaded: /.test(sub),`${pg}/${TAG}: "${sub}"`);
    await p.evaluate(()=>document.body.classList.add('pane-open'));await p.waitForTimeout(500);
    await p.evaluate(()=>document.getElementById('pBackup').scrollIntoView({block:'center'}));await p.waitForTimeout(300);
    await p.screenshot({path:`${OUT}/backup-${pg}-${TAG}.png`});
   }else{
    await p.evaluate(()=>document.getElementById('pBackup').click());await p.waitForTimeout(who==='minh'?2500:1200);
    const sub=await p.evaluate(()=>document.getElementById('bkSub').textContent);
    ok(who==='minh'?sub==='Your admin code was not accepted':sub==='Run 09_backup.sql in Supabase first',`${pg}/${TAG}/${who}: "${sub}"`)}
   ok(errs.length===0,`${pg}/${TAG}/${who}: no page errors ${errs.join(' | ')}`);await ctx.close()}}
 await b.close();await db.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
