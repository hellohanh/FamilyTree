// End-to-end test of Minh's page against a local copy of the Supabase database (same SQL, anon role).
// The page's calls to https://quqgwvwijvwshdpwvkrk.supabase.co are answered from local Postgres.
const {chromium}=require('playwright');const {Client}=require('pg');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{
 const db=new Client({host:'/var/tmp/hftpg',port:5499,user:'postgres',database:'hft'});await db.connect();
 const admin=new Client({host:'/var/tmp/hftpg',port:5499,user:'postgres',database:'hft'});await admin.connect();
 await db.query('set role anon');
 let OFFLINE=false;
 async function answer(route){const req=route.request(),u=new URL(req.url()),path=u.pathname.replace('/rest/v1/','');
  if(OFFLINE)return route.abort();
  if(req.headers()['apikey']!=='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV')return route.fulfill({status:401,body:'{"message":"bad key"}'});
  try{let rows;
   if(path==='trees'&&u.searchParams.get('or')){const x=/link\.eq\.([^,]+),/.exec(u.searchParams.get('or'))[1];rows=(await db.query('select id,link,old_links,name,doc,version from trees where link=$1 or $1=any(old_links)',[decodeURIComponent(x)])).rows}
   else if(path==='trees')rows=(await db.query('select link,name,created_at from trees order by created_at')).rows;
   else if(path==='people'){const ids=/^in\.\((.*)\)$/.exec(u.searchParams.get('id'))[1].split(',').map(decodeURIComponent);rows=(await db.query('select id,data from people where id=any($1)',[ids])).rows}
   else if(path.startsWith('rpc/')){const fn=path.slice(4),a=JSON.parse(req.postData()),ks=Object.keys(a);
    const r=await db.query(`select public.${fn}(${ks.map((k,i)=>`${k}=>$${i+1}`).join(',')}) as r`,ks.map(k=>Array.isArray(a[k])?a[k]:typeof a[k]==='object'?JSON.stringify(a[k]):a[k]));rows=r.rows[0].r}
   else return route.fulfill({status:404,body:'{}'});
   route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows)})}
  catch(e){route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({message:e.message})})}}

 const b=await chromium.launch();
 const mk=async()=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',answer);const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push('ERR '+e.message));return p};
 const enter=async(p,u)=>{await p.goto(u);await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(1500);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(900)};
 const simple=async p=>{await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(4200)};
 const pen=async (p,who)=>(await p.evaluateHandle(w=>[...document.querySelectorAll('#ssv .pencil')].find(g=>g.querySelector('title').textContent==='Edit '+w),who)).asElement();
 const reloaded=async p=>{await p.waitForLoadState('load');await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(4500)};
 const code=async(p,c)=>{await simple(p);await (await pen(p,'??')).click();await p.waitForTimeout(300);await p.fill('#codeIn',c);await p.click('#codeOk');await p.waitForTimeout(1500);await p.click('#edCancel');await p.waitForTimeout(300)};
 const pane=async p=>{await p.evaluate(()=>document.body.classList.add('pane-open'));await p.waitForTimeout(500)};
 const item=(p,t)=>p.evaluate(t=>[...document.querySelectorAll('#pane .item')].find(e=>e.textContent.includes(t)).click(),t);
 // 1. Minh renames his tree
 const p=await mk();await enter(p,'http://localhost:8765/minh/');await code(p,'TEST99');await pane(p);
 await p.screenshot({path:OUT+'/ren1_pane_'+TAG+'.png'});
 await item(p,'Rename this tree');await p.waitForTimeout(400);await p.fill('#renName','Bà Thương\'s Family');
 await p.screenshot({path:OUT+'/ren2_dialog_'+TAG+'.png'});
 await p.click('#renOk');await p.waitForTimeout(1500);
 console.log('header:',await p.evaluate(()=>document.querySelector('#hdr h1 small').textContent),'| tab:',await p.title(),'| dialog closed:',await p.evaluate(()=>!document.getElementById('renDlg').classList.contains('on')));
 await pane(p);await p.screenshot({path:OUT+'/ren3_after_'+TAG+'.png'});
 console.log('db:',(await admin.query("select name from trees where link='thuong'")).rows[0].name);
 // empty name refused in the page
 await item(p,'Rename this tree');await p.waitForTimeout(300);await p.fill('#renName','  ');await p.click('#renOk');await p.waitForTimeout(300);
 console.log('empty name:',await p.evaluate(()=>document.getElementById('renErr').textContent));await p.click('#renCancel');
 // 2. someone else's code can't rename Minh's tree
 const q=await mk();await enter(q,'http://localhost:8765/minh/');await code(q,'OTHER1');await pane(q);await item(q,'Rename this tree');await q.waitForTimeout(300);
 await q.fill('#renName','Hijack');await q.click('#renOk');await q.waitForTimeout(1200);
 console.log('other editor:',await q.evaluate(()=>document.getElementById('renErr').textContent),'| db still:',(await admin.query("select name from trees where link='thuong'")).rows[0].name);
 // 3. Hanh's review list shows the rename
 const a=await mk();await enter(a,'http://localhost:8765/minh/');await code(a,'ADMIN1');await a.reload();await reloaded(a);await pane(a);await item(a,'Review changes');await a.waitForTimeout(1500);
 await a.screenshot({path:OUT+'/ren4_review_'+TAG+'.png'});
 console.log('review:',await a.evaluate(()=>[...document.querySelectorAll('#revBody .ln')].map(e=>e.textContent.replace(/\s+/g,' ').trim())));
 console.log([...p.errs,...q.errs,...a.errs].length?[...p.errs,...q.errs,...a.errs]:'no page errors');await b.close();await db.end();await admin.end()})();
