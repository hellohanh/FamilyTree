// Entry 144: the main page's store. Hạnh's tree comes with the page (from data/tree.json, built in); family members'
// updates (Supabase table "updates") are applied on top: confirmed ones as part of the tree, pending ones marked
// Pending. "Suggest an update" saves a list of changes (ops) — the tree itself is never overwritten.
// Same calls as Minh's store (MINH.*) so the locked editor and the review list work unchanged.
const MINH=(function(){
  const SB='https://quqgwvwijvwshdpwvkrk.supabase.co',KEY='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV';   // public by design (Entry 75)
  const H={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
  const RK='hft-main-restore',FK='hft-family-code',NK='hft-photo-sender',AK='hft-minh-admin',ACK='hft-minh-code';   // family code + name shared with /photo/; admin code shared with /minh/
  const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
  // Entry 150: every sheet of the spreadsheet opens here — ?tree=<link> (default: Hạnh's Paternal Grandpa & Siblings)
  const BASES=__BASE__,DEF='hanh-paternal',want=(new URLSearchParams(location.search).get('tree')||DEF).toLowerCase();
  // Entry 151 (Hanh): Minh's trees use the same links — /FamilyTree/?tree=<link> opens them on Minh's page
  if(!BASES[want]&&new URLSearchParams(location.search).get('tree')){location.replace('minh/'+location.search+location.hash);throw new Error('moved to minh/')}
  const LINK=BASES[want]?want:DEF,BASE=BASES[LINK];
  // picture / godparent ids: the paternal sheet uses "hp:<cell>" (Entry 135); the others' ids already carry their prefix
  window.PID=BASE.pre?(c=>c):(c=>'hp:'+String(c).replace(/[^A-Za-z0-9._-]/g,x=>'_'+x.charCodeAt(0).toString(16)));
  window.TREENAMES=Object.fromEntries(Object.entries(BASES).map(([k,v])=>[k,v.name]));
  let restore=null;try{restore=JSON.parse(sessionStorage.getItem(RK));sessionStorage.removeItem(RK)}catch(e){}
  const M={LINK,NAME:BASE.name,DB:null,restore,offline:false,error:'',PEND:new Set(),NEW:new Set(),GONE:new Set(),EDITBASE:'minh/'};
  const get=async p=>{const r=await fetch(SB+'/rest/v1/'+p,{headers:H});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()};
  const rpc=async(fn,a)=>{const r=await fetch(SB+'/rest/v1/rpc/'+fn,{method:'POST',headers:H,body:JSON.stringify(a)});
    if(!r.ok){let m='HTTP '+r.status;try{m=(await r.json()).message||m}catch(e){}throw new Error(m)}return r.json()};
  const ids=n=>[...n.k,...(n.c||[]).flatMap(ids)];
  const clone=o=>JSON.parse(JSON.stringify(o));
  function boxOf(root,first){if(root.k[0]===first)return root;for(const c of root.c||[]){const r=boxOf(c,first);if(r)return r}return null}
  // apply one update's changes to a tree (skips anything whose place no longer exists)
  function apply(db,ops,pending){ops.forEach(o=>{
    if(o.op==='edit'){const p=db.people[o.id];if(!p)return;Object.assign(p,o.set||{});if(pending)M.PEND.add(o.id)}
    else if(o.op==='remove'){const f=M.find(o.id,db.root);if(!f||(!f.parent&&f.i===0))return;   // Entry 152
      if(pending){M.PEND.add(o.id);M.GONE.add(o.id);return}   // still shown until Hanh confirms, tagged "Removing"
      if(f.i>0){const two=f.node.k.length===2;f.node.k.splice(f.i,1);if(two)(f.node.c||[]).forEach(c=>{if(!c.m)c.m=o.id})}   /* children keep the removed spouse as their other parent */else if(!(f.node.c||[]).length)f.parent.c.splice(f.parent.c.indexOf(f.node),1)}
    else if(o.op==='spouse'||o.op==='child'){if(db.people[o.id])return;const b=boxOf(db.root,o.to);if(!b)return;db.people[o.id]=Object.assign({},o.person);
      if(o.op==='spouse')b.k.splice(Math.max(1,Math.min(o.at,b.k.length)),0,o.id);
      else{const c={k:[o.id],c:[]};if(o.m&&b.k.includes(o.m))c.m=o.m;b.c=b.c||[];b.c.splice(Math.max(0,Math.min(o.at,b.c.length)),0,c)}
      if(pending){M.PEND.add(o.id);M.NEW.add(o.id)}}})}
  M.load=async function(){M.DB=clone(BASE);
    try{M.more=(await get('trees?select=link,name&order=created_at'))}catch(e){M.more=[]}
    try{(await get('updates?select=id,status,ops&order=id')).forEach(u=>apply(M.DB,(u.ops||[]).filter(o=>(o.t||DEF)===LINK),u.status==='pending'))}
    catch(e){M.DB=clone(BASE);M.PEND.clear();M.NEW.clear();M.offline=true}
    M.DB0=clone(M.DB)};
  const disp=p=>(p.title?p.title+' ':'')+(p.first||'??')+(p.alt?' ('+p.alt+')':'');
  const toT=n=>({n:n.k.map(id=>disp(M.DB.people[id])),g:n.k.map(id=>M.DB.people[id].g||'?').join(''),k:n.k.slice(),x:n.k.map(id=>M.DB.people[id].dead?'1':'0').join(''),a:n.k.map(id=>M.DB.people[id].adopted?'1':'0').join(''),c:(n.c||[]).map(toT),...(n.m?{m:n.m}:{}),...(n.s?{s:1}:{})});
  M.tree=()=>toT(M.DB.root);M.disp=disp;
  // Entry 149: is `cell` one of `viewer`'s godparents (picked from the search, so it carries an id)?
  window.GODOF=(viewer,cell)=>{const p=M.DB&&M.DB.people[viewer];if(!p||!p.god)return false;const ids=[cell,window.PID?window.PID(cell):cell];return Object.values(p.god).some(g=>g&&g.id&&ids.includes(g.id))};
  M.find=function find(id,n=M.DB.root,parent=null){const i=n.k.indexOf(id);if(i>=0)return {node:n,parent,i};for(const c of n.c||[]){const r=find(id,c,n);if(r)return r}return null};
  M.newId=()=>'u-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  // the family code (asked once per phone, shared with the picture page) and the sender's name
  M.code=()=>M.sender()?ls.get(FK):null;   // both are needed to send an update
  M.sender=()=>ls.get(NK)||'';
  M.checkCode=async(c,name)=>{const r=await rpc('check_family_code',{p_code:c});if(r.ok){ls.set(FK,c.trim().toUpperCase());if(name)ls.set(NK,name.trim())}return r};
  M.forget=()=>ls.del(FK);
  M.keep=state=>{try{sessionStorage.setItem(RK,JSON.stringify(state))}catch(e){}};
  // save = the differences from the tree as it was loaded, sent as one update
  const FIELDS=['first','middle','last','alt','g','dead','adopted','god'];const J=v=>v&&typeof v==='object'?JSON.stringify(v):(v??'');
  M.ops=function(){const A=M.DB0,B=M.DB,ops=[];
    Object.keys(A.people).forEach(id=>{const a=A.people[id],b=B.people[id];if(!b)return;const set={},was={};
      FIELDS.forEach(f=>{if(J(a[f])!==J(b[f])&&!((f==='dead'||f==='adopted')&&!a[f]&&!b[f])){set[f]=b[f];was[f]=a[f]??''}});if(Object.keys(set).length)ops.push({op:'edit',id,set,was})});
    ids(B.root).filter(id=>!A.people[id]).forEach(id=>{const f=M.find(id),p=Object.assign({},B.people[id]);delete p.added;
      if(f.i>0)ops.push({op:'spouse',id,to:f.node.k[0],at:f.i,person:p});
      else{const par=f.parent;ops.push({op:'child',id,to:par.k[0],at:par.c.indexOf(f.node),m:f.node.m||null,person:p})}});
    const live=new Set(ids(B.root));Object.entries(M.removed||{}).forEach(([id,why])=>{if(!live.has(id))ops.push({op:'remove',id,why,was:Object.assign({},A.people[id])})});   // Entry 152
    ops.forEach(o=>o.t=LINK);return ops};
  M.summary=ops=>ops.map(o=>{const nm=p=>disp(p);if(o.op==='edit')return 'Changed '+disp(M.DB.people[o.id]);if(o.op==='remove')return 'Removed '+disp(o.was||{})+' ('+(o.why==='divorced'?'divorced':'added by mistake')+')';
    const to=disp(M.DB.people[o.to]);return 'Added '+nm(o.person)+(o.op==='spouse'?' (spouse of '+to+')':' (child of '+to+')')}).join(' · ');
  M.save=async function(state){if(M.offline)return {ok:false,why:'offline'};const ops=M.ops();if(!ops.length)return {ok:false,why:'nothing changed'};
    const r=await rpc('send_update',{p_code:M.code()||'',p_sender:M.sender(),p_summary:BASE.name+': '+M.summary(ops),p_ops:ops});
    if(r.ok){try{if(state)sessionStorage.setItem(RK,JSON.stringify(state));sessionStorage.setItem('hft-main-sent','1')}catch(e){}}if(r.why==='code')M.forget();return r};
  // Hanh's admin code (shared with Minh's page): the review list
  M.isAdmin=()=>!!ls.get(AK)&&!!ls.get(ACK);
  M.adminCheck=async c=>{const r=await rpc('check_code',{p_code:c});if(r.ok&&r.admin){ls.set(ACK,c.trim().toUpperCase());ls.set(AK,'1')}return r};
  const ac=()=>ls.get(ACK)||'';
  M.reviewList=()=>rpc('review_list',{p_code:ac()});
  M.confirm=ids=>rpc('confirm_changes',{p_code:ac(),p_ids:ids});
  M.photoReview=()=>rpc('photo_review',{p_code:ac()});
  M.photoDecide=(ids,ok)=>rpc('photo_decide',{p_code:ac(),p_ids:ids,p_ok:ok});
  M.updateReview=()=>rpc('update_review',{p_code:ac()});
  M.updateDecide=(ids,ok)=>rpc('update_decide',{p_code:ac(),p_ids:ids,p_ok:ok});
  return M;
})();
MINH.load().then(()=>{const s=document.createElement('script');s.textContent=document.getElementById('engine').textContent;document.body.appendChild(s)});
