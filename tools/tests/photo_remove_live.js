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
 const fs=require('fs'),F1=fs.readFileSync(process.argv[4],'utf8');
 await admin.query("insert into photos(person,tree,who,sender,img,status) values ('hp:N262','t','Hai','Tester',$1,'ok')",[F1]);
 const b=await chromium.launch();
 const mk=async()=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',answer);const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push('ERR '+e.message));return p};
 const ready=async p=>{await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(1500);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000)};
 // a family member: no remove button
 const f=await mk();await f.goto('http://localhost:8765/');await ready(f);await f.evaluate(()=>{localStorage.setItem('hft-family-code','FAM123');localStorage.setItem('hft-photo-sender','T');window.EDIT(CP['N262'])});await f.waitForTimeout(600);
 console.log('family member sees Remove picture:',await f.evaluate(()=>!document.getElementById('ePh').hidden));
 const a=await mk();await a.goto('http://localhost:8765/?admin');await ready(a);await a.fill('#codeIn','ADMIN1');await a.click('#codeOk');await a.waitForTimeout(1500);
 await a.evaluate(()=>{localStorage.setItem('hft-family-code','FAM123');localStorage.setItem('hft-photo-sender','Hanh')});
 await a.evaluate(()=>{FOCAL=CP['N262'];document.getElementById('pSimple').click()});await a.waitForTimeout(4500);
 console.log('picture on card before:',await a.evaluate(()=>[...document.querySelectorAll('#ssv image')].some(i=>(i.getAttribute('href')||'').startsWith('data:'))));
 await a.evaluate(()=>window.EDIT(CP['N262']));await a.waitForTimeout(600);console.log('admin sees Remove picture:',await a.evaluate(()=>!document.getElementById('ePh').hidden));
 await a.evaluate(()=>document.querySelector('#edOv .mdl').scrollTop=0);await a.screenshot({path:OUT+'/photo_remove_'+TAG+'.png',clip:{x:0,y:0,width:412,height:480}});
 console.log('update link:',await a.evaluate(()=>document.getElementById('ePhU').getAttribute('href')));await a.click('#ePhX');await a.waitForTimeout(2500);await a.click('#edCancel');await a.waitForTimeout(800);
 console.log('db:',(await admin.query("select status,decided_by from photos")).rows,'| picture on card after:',await a.evaluate(()=>[...document.querySelectorAll('#ssv image')].some(i=>(i.getAttribute('href')||'').startsWith('data:'))));
 console.log([...f.errs,...a.errs].length?[...f.errs,...a.errs]:'no page errors');await b.close();await db.end();await admin.end()})();
