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
 const shot=async n=>{await p.screenshot({path:`${OUT}/live-${TAG}-${n}.png`});console.log('shot',n)};
 const pen=async (who,root='#ssv')=>(await p.evaluateHandle(([w,r])=>[...document.querySelectorAll(r+' .pencil')].find(g=>g.querySelector('title').textContent==='Edit '+w),[who,root])).asElement();
 const openPane=async()=>{if(TAG==='phone'){await p.tap('#rHandle');await p.waitForTimeout(500)}};
 const enter=async u=>{await p.goto(u);await p.waitForFunction(()=>typeof window.EDIT==='function',null,{timeout:20000});await p.waitForTimeout(1500);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(900)};
 await enter('http://localhost:8765/minh/');
 const sv=await p.$('#sv'),bb=await sv.boundingBox();await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(4000);
 // 1. a pencil asks for the code first
 await (await pen('??')).click();await p.waitForTimeout(300);await shot('1-code');
 await p.fill('#codeIn','nope00');await p.click('#codeOk');await p.waitForTimeout(1500);
 console.log('wrong code →',await p.textContent('#codeErr'));await shot('2-code-wrong');
 await p.fill('#codeIn','test99');await p.click('#codeOk');await p.waitForTimeout(1500);
 console.log('editor open after right code:',await p.evaluate(()=>document.getElementById('edOv').classList.contains('on')));
 // 2. save goes to Supabase
 await p.fill('#eF','');await p.type('#eF','Test Cha',{delay:5});await p.click('#edRels [data-r="daughter"]');await p.type('#nF','Thương',{delay:5});
 await p.click('#edSave');await p.waitForLoadState('load');await p.waitForTimeout(5000);await shot('3-saved');
 console.log('db tree:',JSON.stringify((await admin.query("select version,doc from trees where link='thuong'")).rows[0]));
 console.log('db changes:',(await admin.query('select kind,person,after->>\'first\' a from changes order by id')).rows.map(r=>r.kind+':'+(r.a||'')).join(' · '));
 // 3. the code is remembered on this device: next pencil opens the editor straight away
 await (await pen('??')).click();await p.waitForTimeout(400);
 console.log('code asked again?',await p.evaluate(()=>document.getElementById('codeDlg').classList.contains('on')),'editor open?',await p.evaluate(()=>document.getElementById('edOv').classList.contains('on')));
 // 4. someone else saved in between → refused, reloads the latest
 await admin.query("update trees set version=version+1 where link='thuong'");
 await p.type('#eF','Test Mẹ',{delay:5});await p.click('#edSave');await p.waitForTimeout(800);
 console.log('stale save message:',await p.textContent('#edErr'));await shot('4-stale');await p.waitForTimeout(4500);
 // 5. TREES list + start a new tree
 await openPane();await shot('5-pane');
 await p.click('#pane button.mtree');await p.waitForTimeout(400);await p.fill('#newName','Cây Thử Nghiệm');await p.click('#newCentre [data-c="F"]');await shot('6-new');
 await p.click('#newOk');await p.waitForFunction(()=>typeof window.EDIT==='function'&&location.search.includes('tree='),null,{timeout:20000});await p.waitForTimeout(1500);
 console.log('after new tree url:',p.url(),'title:',await p.title());await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(900);await shot('7-new-tree');
 console.log('trees in db:',(await admin.query('select link,name,editor is not null as e from trees order by created_at')).rows.map(r=>r.link+'/'+r.name+'/'+r.e).join(' · '));
 // 6. offline: notice + last copy, editing off
 OFFLINE=true;await enter('http://localhost:8765/minh/?tree=thuong');
 console.log('offline notice:',await p.textContent('#mNotice'));await shot('8-offline');
 console.log(errs.length?errs:'no page errors');await b.close();await db.end();await admin.end()})();
