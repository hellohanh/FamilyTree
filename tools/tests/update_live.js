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
   else if(path==='updates'){rows=(await db.query('select '+u.searchParams.get('select').split(',').map(c=>c.replace(/[^a-z_]/g,'')).join(',')+' from updates order by id')).rows}
   else if(path==='photos'){const sel=u.searchParams.get('select'),id=u.searchParams.get('id');rows=(await db.query('select '+sel.split(',').map(c=>c.replace(/[^a-z_]/g,'')).join(',')+' from photos'+(id?' where id = any(array['+(id.startsWith('in.')?id.slice(4,-1):id.slice(3)).split(',').map(Number).join(',')+']::bigint[])':'')+' order by at desc')).rows}
   else if(path.startsWith('rpc/')){const fn=path.slice(4),a=JSON.parse(req.postData()),ks=Object.keys(a);
    const r=await db.query(`select public.${fn}(${ks.map((k,i)=>`${k}=>$${i+1}`).join(',')}) as r`,ks.map(k=>Array.isArray(a[k])&&k!=='p_ops'?a[k]:typeof a[k]==='object'?JSON.stringify(a[k]):a[k]));rows=r.rows[0].r}
   else return route.fulfill({status:404,body:'{}'});
   route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows)})}
  catch(e){route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({message:e.message})})}}
 const b=await chromium.launch();
 const mk=async()=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',answer);const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push('ERR '+e.message));return p};
 const ready=async p=>{await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(1200);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3500)};
 const shot=(p,n)=>p.screenshot({path:OUT+'/upd_'+n+'_'+TAG+'.png'});
 const p=await mk();await p.goto('http://localhost:8765/');await ready(p);
 console.log('wheel people:',await p.evaluate(()=>P.length),'| titles Hạnh→Hai:',await p.evaluate(()=>{const h=Object.values(CP).find(x=>x.nm==='Hạnh');return h?titleOf(h.cell,'N262'):'?'}));
 await p.evaluate(()=>{document.body.classList.add('pane-open')});await p.waitForTimeout(500);await shot(p,'1pane');
 await p.evaluate(()=>document.getElementById('pSug').click());await p.waitForTimeout(400);await p.fill('#sugQ','hai');await p.waitForTimeout(300);await shot(p,'2search');
 await p.evaluate(()=>[...document.querySelectorAll('#sugRes button')].find(b=>b.querySelector('b').textContent==='Hai').click());await p.waitForTimeout(500);
 console.log('code box (family):',await p.evaluate(()=>document.getElementById('codeDlg').classList.contains('fam')&&document.getElementById('codeDlg').classList.contains('on')));
 await shot(p,'3code');
 await p.fill('#codeIn','FAM123');await p.click('#codeOk');await p.waitForTimeout(800);console.log('no name:',await p.textContent('#codeErr'));
 await p.fill('#codeNm','Bảo');await p.click('#codeOk');await p.waitForTimeout(1500);
 console.log('editor open:',await p.evaluate(()=>document.getElementById('edOv').classList.contains('on')),'| first name box:',await p.inputValue('#eF'));
 await p.evaluate(()=>[...document.querySelectorAll('#edRels .rel')].find(b=>b.dataset.r==='brother').click());await p.waitForTimeout(300);
 await p.fill('#nF','Testbrother');await p.waitForTimeout(200);
 for(let i=0;i<3;i++){await p.click('#edUp');await p.waitForTimeout(100)}
 await shot(p,'4brother');
 await p.click('#edSave');await p.waitForLoadState('load');await ready(p);
 const u=(await admin.query('select sender,summary,ops,status from updates')).rows;console.log('db:',JSON.stringify(u).slice(0,400));
 // the new brother shows at once, marked Pending — open Hai's family in Simple
 await p.evaluate(()=>{const h=Object.values(CP).find(x=>x.cell==='E2');FOCAL=null;});
 await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(4500);await shot(p,'5simple');
 console.log('pending tags:',await p.evaluate(()=>[...document.querySelectorAll('svg text')].filter(t=>t.textContent==='Pending').length),'| new person in tree:',await p.evaluate(()=>Object.values(CP).some(x=>x.nm==='Testbrother')));
 // a name change on someone else
 await p.evaluate(()=>{document.getElementById('pSug').click()});await p.fill('#sugQ','chau');await p.waitForTimeout(300);
 await p.evaluate(()=>[...document.querySelectorAll('#sugRes button')].find(b=>/Khánh/.test(b.textContent)).click());await p.waitForTimeout(600);
 await p.fill('#eA','Testnick');await p.click('#edSave');await p.waitForLoadState('load');await ready(p);
 console.log('updates now:',(await admin.query('select id,summary,status from updates order by id')).rows.map(r=>r.id+' '+r.status+' '+r.summary));
 // Hanh: ?admin → review → reject the brother, confirm the nickname
 const a=await mk();await a.goto('http://localhost:8765/?admin');await ready(a);
 console.log('admin box:',await a.evaluate(()=>document.getElementById('codeDlg').classList.contains('on')&&!document.getElementById('codeDlg').classList.contains('fam')));
 await a.fill('#codeIn','ADMIN1');await a.click('#codeOk');await a.waitForTimeout(2000);console.log('badge:',await a.textContent('#revN'));
 await a.evaluate(()=>{document.body.classList.add('pane-open');document.getElementById('pReview').click()});await a.waitForTimeout(1500);await shot(a,'6review');
 await a.evaluate(()=>[...document.querySelectorAll('#revBody .save')].find(s=>/Testbrother/.test(s.textContent)).querySelector('[data-ok="0"]').click());await a.waitForTimeout(1200);
 await a.evaluate(()=>[...document.querySelectorAll('#revBody .save')].find(s=>/Testnick/.test(s.textContent)).querySelector('[data-ok="1"]').click());await a.waitForTimeout(1200);
 await a.evaluate(()=>document.getElementById('revDone').click());await a.waitForLoadState('load');await ready(a);
 console.log('after review: brother in tree:',await a.evaluate(()=>Object.values(CP).some(x=>x.nm==='Testbrother')),'| Châu nickname:',await a.evaluate(()=>Object.values(CP).filter(x=>/Testnick/.test(x.nm)).map(x=>x.nm)),'| pending tags anywhere:',await a.evaluate(()=>MINH.PEND.size));
 console.log('db:',(await admin.query('select id,status,decided_by from updates order by id')).rows.map(r=>Object.values(r).join(' ')));
 const m=await mk();await m.goto('http://localhost:8765/minh/');await ready(m);console.log('minh ok:',await m.evaluate(()=>typeof window.ADMINUI));
 console.log([...p.errs,...a.errs,...m.errs].length?[...p.errs,...a.errs,...m.errs]:'no page errors');await b.close();await db.end();await admin.end()})();
