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
 // Minh's device: three saves (name the father; mother + daughter Thương → link Yes)
 const m=await mk();await enter(m,'http://localhost:8765/minh/');await simple(m);
 await (await pen(m,'??')).click();await m.waitForTimeout(300);await m.fill('#codeIn','TEST99');await m.click('#codeOk');await m.waitForTimeout(1500);
 await m.fill('#eF','Test Cha');await m.click('#edSave');await reloaded(m);
 await (await pen(m,'??')).click();await m.waitForTimeout(300);await m.fill('#eF','Test Mẹ');await m.click('#edRels [data-r="daughter"]');await m.fill('#nF','thuong');await m.click('#edSave');await m.waitForTimeout(600);await m.click('#lkYes');await reloaded(m);
 console.log('Minh sees admin items?',await m.evaluate(()=>!!document.getElementById('pReview')));
 // Hanh's device: admin code at a pencil → admin items appear
 const h=await mk();await enter(h,'http://localhost:8765/minh/');await simple(h);
 await (await pen(h,'Test Cha')).click();await h.waitForTimeout(300);await h.fill('#codeIn','admin1');await h.click('#codeOk');await h.waitForTimeout(2000);
 await h.click('#edCancel');await h.waitForTimeout(800);
 console.log('Hanh admin items:',await h.evaluate(()=>!!document.getElementById('pReview')),'badge:',await h.textContent('#revN'));
 if(TAG==='phone'){await h.tap('#rHandle');await h.waitForTimeout(600)}
 await h.screenshot({path:`${OUT}/review-${TAG}-1-pane.png`});
 await h.evaluate(()=>document.getElementById('pReview').click());await h.waitForTimeout(1500);
 await h.screenshot({path:`${OUT}/review-${TAG}-2-list.png`});
 console.log('saves listed:',await h.$$eval('#revBody .save',e=>e.length),'| lines:',await h.$$eval('#revBody .ln',e=>e.length));
 await h.evaluate(()=>{document.querySelector('#revBody .box, #revDlg .box').scrollTop=0});
 // Edit from the list opens the editor on that person
 await h.evaluate(()=>[...document.querySelectorAll('#revBody .lnb')].find(b=>b.dataset.p==='minh-p1').click());await h.waitForTimeout(600);
 console.log('editor opened for:',await h.evaluate(()=>document.getElementById('edOv').classList.contains('on')&&document.getElementById('eF').value));
 await h.click('#edCancel');await h.waitForTimeout(300);
 // confirm the newest save
 await h.evaluate(()=>document.getElementById('pReview').click());await h.waitForTimeout(1500);
 await h.evaluate(()=>document.querySelector('#revBody [data-ids]').click());await h.waitForTimeout(1200);
 console.log('after confirming one save → badge:',await h.textContent('#revN'),'| db unconfirmed:',(await admin.query('select count(*) from changes where confirmed_at is null')).rows[0].count);
 await h.screenshot({path:`${OUT}/review-${TAG}-3-after-confirm.png`});
 console.log(m.errs.concat(h.errs).length?m.errs.concat(h.errs):'no page errors');await b.close();await db.end();await admin.end()})();
