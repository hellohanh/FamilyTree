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
 const shot=(p,n)=>p.screenshot({path:OUT+'/photo_'+n+'_'+TAG+'.png'});
 const p=await mk();await p.goto('http://localhost:8765/photo/');await p.waitForTimeout(1200);await shot(p,'1code');
 await p.fill('#codeIn','nope');await p.click('#codeOk');await p.waitForTimeout(1500);console.log('wrong code:',await p.textContent('#codeErr'));
 await p.fill('#codeIn','fam123');await p.click('#codeOk');await p.waitForTimeout(1200);
 await p.fill('#q','chau');await p.waitForTimeout(500);await shot(p,'2search');
 console.log('results:',await p.evaluate(()=>[...document.querySelectorAll('#res button')].map(b=>b.textContent)));
 await p.evaluate(()=>[...document.querySelectorAll('#res button')].find(b=>/Khánh/.test(b.textContent)).click());await p.waitForTimeout(400);await shot(p,'3person');
 await p.setInputFiles('#file',process.argv[4]);await p.waitForTimeout(1200);
 const box=await p.locator('#crop').boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.mouse.move(box.x+box.width/2,box.y+box.height/2-20,{steps:5});await p.mouse.up();
 await p.evaluate(()=>{Z.s=600/900;Z.x=-150*Z.s;Z.y=-420*Z.s;paint()});await p.waitForTimeout(300);await shot(p,'4fit');
 await p.click('#send');await p.waitForTimeout(300);console.log('no name:',await p.textContent('#sendErr'));
 await p.fill('#sender','Tester');await p.click('#send');await p.waitForTimeout(2000);await shot(p,'5done');
 const r=(await admin.query("select person,tree,sender,status,length(img) n,left(img,22) k from photos")).rows;console.log('db:',r);
 // a second visit: code remembered, the person's result shows the new picture
 await p.goto('http://localhost:8765/photo/');await p.waitForTimeout(1500);console.log('second visit step:',await p.evaluate(()=>document.querySelector('.step.on').id));
 await p.fill('#q','chau');await p.waitForTimeout(1500);console.log('photo in results:',await p.evaluate(()=>[...document.querySelectorAll('#res img')].filter(i=>i.src.startsWith('data:')).length));
 console.log(p.errs.length?p.errs:'no page errors');await b.close();await db.end();await admin.end()})();
