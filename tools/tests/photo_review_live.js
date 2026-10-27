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
 const fs=require('fs'),F1=fs.readFileSync(process.argv[4],'utf8'),F2=fs.readFileSync(process.argv[5],'utf8');
 await admin.query("insert into photos(person,tree,who,sender,img,status,at) values ('hp:E2','Hạnh''s Paternal Grandpa & Siblings','Ông Cố','Tester',$1,'ok',now()-interval '1 day'),('hp:E2','Hạnh''s Paternal Grandpa & Siblings','Ông Cố','Bảo',$2,'pending',now()),('hp:AF154','Hạnh''s Paternal Grandpa & Siblings','Châu · vợ của Khánh','Tester',$2,'pending',now())",[F2,F1]);
 const b=await chromium.launch();
 const mk=async()=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',answer);const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push('ERR '+e.message));return p};
 const p=await mk();await p.goto('http://localhost:8765/');await p.waitForTimeout(1500);
 console.log('no ?admin → admin section:',await p.evaluate(()=>!!document.getElementById('pReview')));
 await p.goto('http://localhost:8765/?admin');await p.waitForTimeout(1500);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});
 console.log('code box open:',await p.evaluate(()=>document.getElementById('codeDlg').classList.contains('on')));
 await p.fill('#codeIn','TEST99');await p.click('#codeOk');await p.waitForTimeout(1500);console.log('Minh code:',await p.textContent('#codeErr'));
 await p.fill('#codeIn','ADMIN1');await p.click('#codeOk');await p.waitForTimeout(2000);
 console.log('admin section:',await p.evaluate(()=>!!document.getElementById('pReview')),'badge:',await p.textContent('#revN'));
 await p.evaluate(()=>{document.body.classList.add('pane-open');document.getElementById('pReview').click()});await p.waitForTimeout(1500);
 await p.screenshot({path:OUT+'/review_pics_'+TAG+'.png'});
 console.log('picture cards:',await p.evaluate(()=>document.querySelectorAll('#revBody [data-pic][data-ok="1"]').length));
 // reject Ông Cố's new picture → the older confirmed one comes back; confirm Châu's
 await p.evaluate(()=>[...document.querySelectorAll('#revBody .save')].find(s=>/Ông Cố/.test(s.textContent)).querySelector('[data-ok="0"]').click());await p.waitForTimeout(1500);
 await p.evaluate(()=>document.querySelector('#revBody [data-ok="1"]').click());await p.waitForTimeout(1500);
 console.log('db:',(await admin.query("select person,sender,status,decided_by from photos order by id")).rows.map(r=>Object.values(r).join(' | ')));
 console.log('badge after:',await p.textContent('#revN'));
 await p.evaluate(()=>document.getElementById('revDone').click());await p.goto('http://localhost:8765/');await p.waitForTimeout(1200);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(4500);
 console.log('main page remembers admin:',await p.evaluate(()=>!!document.getElementById('pReview')),'| centre picture is the older one:',await p.evaluate(()=>{const i=[...document.querySelectorAll('svg image')].find(i=>(i.getAttribute('href')||'').startsWith('data:'));return !!i}),'| pending marks:',await p.evaluate(()=>[...document.querySelectorAll('svg text')].filter(t=>t.textContent==='Pending').length));
 const m=await mk();await m.goto('http://localhost:8765/minh/');await m.waitForTimeout(2500);await m.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});
 await m.evaluate(()=>localStorage.setItem('hft-minh-code','ADMIN1')||localStorage.setItem('hft-minh-admin','1'));await m.reload();await m.waitForTimeout(3000);
 await admin.query("insert into photos(person,tree,who,sender,img) values ('hp:N264','t','Bà Thương (Tường) · vợ của Hai','Minh',$1)",[F1]);
 await m.evaluate(()=>{document.body.classList.add('pane-open');document.getElementById('pReview').click()});await m.waitForTimeout(1500);
 console.log('minh review pictures:',await m.evaluate(()=>document.querySelectorAll('#revBody [data-pic][data-ok="1"]').length));
 console.log([...p.errs,...m.errs].length?[...p.errs,...m.errs]:'no page errors');await b.close();await db.end();await admin.end()})();
