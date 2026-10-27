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
 const b=await chromium.launch();
 const mk=async()=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',answer);const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push('ERR '+e.message));return p};
 const ready=async p=>{await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(1500);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000)};
 const p=await mk();await p.goto('http://localhost:8765/');await ready(p);
 console.log('paternal mom:',await p.evaluate(()=>CP['W238'].nm),'| maternal mom nick merged (built):',await p.evaluate(()=>CP['W238'].nm.includes('Nancy')));
 await p.evaluate(()=>{localStorage.setItem('hft-family-code','FAM123');localStorage.setItem('hft-photo-sender','Tester')});
 await p.evaluate(()=>window.EDIT(CP['W238']));await p.waitForTimeout(500);
 console.log('Also in:',await p.evaluate(()=>[...document.querySelectorAll('#eAlso a')].map(a=>a.textContent+' '+a.getAttribute('href'))));
 await p.screenshot({path:OUT+'/link_also_'+TAG+'.png'});
 // edit Hạnh's nickname on paternal; add a child under Thảo on paternal
 await p.click('#edCancel');await p.evaluate(()=>window.EDIT(CP['AF241']));await p.waitForTimeout(400);await p.fill('#eA','Testlink');await p.click('#edSave');await p.waitForLoadState('load');await ready(p);
 await admin.query("insert into photos(person,tree,who,sender,img,status) values ('hp:AF241','t','Hạnh','Tester',$1,'ok')",[F1]);
 const m=await mk();await m.goto('http://localhost:8765/?tree=hanh-maternal');await ready(m);
 console.log('maternal sees Hạnh nickname:',await m.evaluate(()=>CP['hm:W170'].nm),'| pending there:',await m.evaluate(()=>MINH.PEND.has('hm:W170')),'| picture id:',await m.evaluate(()=>window.PID('hm:W170')));
 await m.evaluate(()=>{localStorage.setItem('hft-family-code','FAM123');localStorage.setItem('hft-photo-sender','Tester');window.EDIT(CP['hm:N165'])});await m.waitForTimeout(400);const href=await m.evaluate(()=>document.querySelector('#eAlso a').getAttribute('href'));console.log('maternal Also in:',href);
 await m.goto('http://localhost:8765/'+href.replace('./',''));await m.waitForFunction(()=>typeof window.EDIT==='function');await m.waitForTimeout(4500);
 console.log('jumped: tree',await m.evaluate(()=>MINH.LINK),'focal',await m.evaluate(()=>FOCAL&&FOCAL.cell),'simple',await m.evaluate(()=>document.body.classList.contains('simple')));
 await m.screenshot({path:OUT+'/link_jump_'+TAG+'.png'});
 console.log([...p.errs,...m.errs].length?[...p.errs,...m.errs]:'no page errors');await b.close();await db.end();await admin.end()})();
