// Shared test helper (Entry 201): answers the pages' Supabase calls from a local Postgres copy, AS THE PUBLIC (role
// anon), so the database's own privacy rules (row level security) are what the pages see.
const {Client}=require('pg');
module.exports=async function(dbname){
 const db=new Client({host:'/var/tmp/hftpg',port:5499,user:'postgres',database:dbname});await db.connect();await db.query('set role anon');
 let busy=Promise.resolve();const q=(s,a)=>(busy=busy.then(()=>db.query(s,a),()=>db.query(s,a)));   // one query at a time
 const cols=u=>(u.searchParams.get('select')||'*').split(',').map(c=>c.replace(/[^a-z_*]/g,'')).filter(Boolean).join(',');
 async function answer(route){const req=route.request(),u=new URL(req.url()),path=u.pathname.replace('/rest/v1/','');
  try{let rows;
   if(path==='trees'&&u.searchParams.get('or')){const x=decodeURIComponent(/link\.eq\.([^,]+),/.exec(u.searchParams.get('or'))[1]);rows=(await q('select '+cols(u)+' from trees where link=$1 or $1=any(old_links)',[x])).rows}
   else if(path==='trees')rows=(await q('select '+cols(u)+' from trees order by created_at')).rows;
   else if(path==='people'){const v=u.searchParams.get('id');const ids=v?/^in\.\((.*)\)$/.exec(v)[1].split(',').map(decodeURIComponent):[];rows=(await q('select id,data from people where id=any($1)',[ids])).rows}
   else if(path==='tree_names')rows=(await q('select link,name from tree_names')).rows;
   else if(path==='updates'||path==='photos')rows=(await q('select '+cols(u)+' from '+path+" where status<>'rejected' order by id")).rows;
   else if(path.startsWith('rpc/')){const fn=path.slice(4),a=JSON.parse(req.postData()||'{}'),ks=Object.keys(a);
    rows=(await q(`select public.${fn}(${ks.map((k,i)=>`${k}=>$${i+1}`).join(',')}) as r`,ks.map(k=>a[k]!==null&&typeof a[k]==='object'&&!(Array.isArray(a[k])&&k!=='p_ops')?JSON.stringify(a[k]):a[k]))).rows[0].r}
   else return route.fulfill({status:200,contentType:'application/json',body:'[]'});
   route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows)})}
  catch(e){route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({message:e.message})})}}
 return {answer,db,q,end:()=>db.end()};
};
