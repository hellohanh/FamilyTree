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
    const r=await db.query(`select public.${fn}(${ks.map((k,i)=>`${k}=>$${i+1}`).join(',')}) as r`,ks.map(k=>typeof a[k]==='object'?JSON.stringify(a[k]):a[k]));rows=r.rows[0].r}
   else return route.fulfill({status:404,body:'{}'});
   route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows)})}
  catch(e){route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({message:e.message})})}}
 const b=await chromium.launch();const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',answer);

 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('ERR '+e.message));
 const shot=async n=>{await p.screenshot({path:`${OUT}/link-${TAG}-${n}.png`});console.log('shot',n)};
 const pen=async (who,root='#ssv')=>(await p.evaluateHandle(([w,r])=>[...document.querySelectorAll(r+' .pencil')].find(g=>g.querySelector('title').textContent==='Edit '+w),[who,root])).asElement();
 const enter=async u=>{await p.goto(u);await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(1500);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(900)};
 const simple=async()=>{await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(4200)};
 await enter('http://localhost:8765/minh/');await simple();
 // name the parents, then add a daughter "thuong"
 await (await pen('??')).click();await p.waitForTimeout(300);await p.fill('#codeIn','TEST99');await p.click('#codeOk');await p.waitForTimeout(1500);
 await p.fill('#eF','Test Cha');await p.click('#edSave');await p.waitForLoadState('load');await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(4500);
 await (await pen('??')).click();await p.waitForTimeout(300);await p.fill('#eF','Test Mẹ');await p.click('#edRels [data-r="daughter"]');await p.fill('#nF','thuong');
 await p.click('#edSave');await p.waitForTimeout(600);
 console.log('offer shown:',await p.evaluate(()=>document.getElementById('linkDlg').classList.contains('on')),'| title:',await p.textContent('#lkTitle'),'| count:',await p.textContent('#lkCount'));
 await shot('1-offer');
 await p.click('#lkYes');await p.waitForLoadState('load');await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(4500);await shot('2-after-yes');
 const row=(await admin.query("select version,doc from trees where link='thuong'")).rows[0];
 const all=n=>[...n.k,...(n.c||[]).flatMap(all)];const ids=all(row.doc);
 console.log('version',row.version,'| people in tree',ids.length,'| shared hp:',ids.filter(i=>i.startsWith('hp:')).length,'| her box',JSON.stringify(row.doc.c[0].k));
 console.log('changes:',(await admin.query("select kind,count(*) n from changes group by kind order by kind")).rows.map(r=>r.kind+' '+r.n).join(', '));
 // her family in the Simple view
 await p.evaluate(()=>{FOCAL=CP['hp:N264'];paintFocal()});await simple();await shot('3-her-family');
 // the offer is not shown again for her (already linked)
 await (await pen('Thương (Tường)')).click();await p.waitForTimeout(300);await p.click('#edSave');await p.waitForTimeout(600);
 console.log('offer again after linking?',await p.evaluate(()=>document.getElementById('linkDlg').classList.contains('on')));
 await p.waitForLoadState('load');await p.waitForTimeout(3000);
 // No path on a fresh tree
 await admin.query("insert into trees(link,doc,editor) values ('no-test','{\"k\":[\"nt1\",\"nt2\"],\"c\":[]}',(select id from editors where name='Tester')) ; insert into people(id,data) values ('nt1','{\"first\":\"A\",\"g\":\"M\"}'),('nt2','{\"first\":\"B\",\"g\":\"F\"}')");
 await enter('http://localhost:8765/minh/?tree=no-test');await simple();
 await (await pen('A')).click();await p.waitForTimeout(300);await p.click('#edRels [data-r="daughter"]');await p.fill('#nF','Tường');await p.click('#edSave');await p.waitForTimeout(600);
 console.log('offer on Tường:',await p.evaluate(()=>document.getElementById('linkDlg').classList.contains('on')),'| no button:',await p.textContent('#lkNo'));
 await p.click('#lkNo');await p.waitForLoadState('load');await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(4500);
 const nt=(await admin.query("select doc from trees where link='no-test'")).rows[0].doc;const kid=nt.c[0].k[0];
 console.log('kept as typed:',JSON.stringify((await admin.query('select data from people where id=$1',[kid])).rows[0].data));
 await (await pen('Tường')).click();await p.waitForTimeout(300);await p.click('#edSave');await p.waitForTimeout(600);
 console.log('asked again after No?',await p.evaluate(()=>document.getElementById('linkDlg').classList.contains('on')));
 await p.waitForTimeout(3000);
 console.log(errs.length?errs:'no page errors');await b.close();await db.end();await admin.end()})();
