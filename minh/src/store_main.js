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
  // Entry 201 (Hanh): a tree kept in the database opens HERE too (Entry 151 sent it to Minh's page) — when it's published,
  // or for Hanh (admin) always; its own editor is sent to the editors' page (/editor/) to work on it
  const DBT=!BASES[want]&&!!new URLSearchParams(location.search).get('tree');
  const LINK=DBT?want:(BASES[want]?want:DEF);let BASE=DBT?{root:{k:[],c:[]},people:{},name:'',pre:'db'}:BASES[LINK];
  // Entry 159: the same person in two trees (data/links.json) — OTHER[id] = [{t,id}] copies in the other trees; a
  // change to any copy shows on every copy; pictures use one id (the paternal copy's)
  const GROUPS=__LINKS__,OTHER={},CANON={},HERE={};GROUPS.forEach(g=>{const all=Object.entries(g).map(([t,id])=>({t,id}));
   all.forEach(x=>{if(x.t===LINK)HERE[JSON.stringify(g)]=x.id});const mine=all.find(x=>x.t===LINK);
   all.forEach(x=>{OTHER[x.t+'|'+x.id]=all.filter(y=>y!==x)});if(mine){const c=all[0];CANON[mine.id]=c.t==='hanh-paternal'?'hp:'+c.id:c.id}});
  const here=(t,id)=>{if(t===LINK)return id;const o=(OTHER[t+'|'+id]||[]).find(y=>y.t===LINK);return o?o.id:null};
  // picture / godparent ids: the paternal sheet uses "hp:<cell>" (Entry 135); the others' ids already carry their prefix
  const HP=c=>'hp:'+String(c).replace(/[^A-Za-z0-9._-]/g,x=>'_'+x.charCodeAt(0).toString(16));
  const UNHP=id=>String(id).slice(3).replace(/_([0-9a-f]{2})/g,(m,h)=>String.fromCharCode(parseInt(h,16)));
  const PID0=BASE.pre?(c=>c):HP;window.XGROUPS=GROUPS;window.XHP=HP;   /* Entry 212: for focal.js */
  // Entry 210: the built-in trees with shared ids, for "Already in another tree" (xlink.js)
  window.XBUILT=Object.entries(BASES).map(([l,b])=>{const cv=l==='hanh-paternal'?HP:(i=>i),tr=n=>({k:n.k.map(cv),c:(n.c||[]).map(tr),...(n.m?{m:cv(n.m)}:{})});
   return {link:l,name:b.name,root:tr(b.root),people:Object.fromEntries(Object.entries(b.people).map(([i,p])=>[cv(i),p]))}});
  window.PID=c=>CANON[c]||PID0(c);
  window.TREENAMES=Object.fromEntries(Object.entries(BASES).map(([k,v])=>[k,v.name]));
  let restore=null;try{restore=JSON.parse(sessionStorage.getItem(RK));sessionStorage.removeItem(RK)}catch(e){}
  const M={hereOf:(t,id)=>here(t,id),LINK,NAME:BASE.name,DB:null,restore,offline:false,error:'',PEND:new Set(),NEW:new Set(),GONE:new Set(),EDITBASE:'editor/',DBT,BUILTIN:Object.keys(BASES)};
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
      if(pending){M.PEND.add(o.id);M.NEW.add(o.id)}}
    else if(o.op==='order'){const b=boxOf(db.root,o.id);if(!b||!b.c)return;const P=new Map((o.kids||[]).map((k,i)=>[k,i])),old=b.c.slice(),at=c=>P.has(c.k[0])?P.get(c.k[0]):1e4+old.indexOf(c);b.c.sort((x,y)=>at(x)-at(y));if(pending)M.PEND.add(o.id)}})}   // Entry 207b
  const stay=()=>new Promise(()=>{});   // leaving the page: the engine never starts
  // Entry 201: fetch a database tree — published: anyone; unpublished: Hanh's admin code (get_tree); its own editor → /editor/
  async function dbTree(){const c=ls.get(ACK)||'',adm=!!ls.get(AK)&&!!c;
    if(c&&!adm){try{const r=await rpc('check_code',{p_code:c});if(r.ok&&!r.admin&&(r.trees||[]).includes(LINK)){location.replace('editor/'+location.search+location.hash);return stay()}}catch(e){}}
    let t=null,people={};
    try{const rows=await get('trees?select=link,name,doc,version,published&or=(link.eq.'+encodeURIComponent(LINK)+',old_links.cs.%7B'+encodeURIComponent(LINK)+'%7D)');t=rows[0]||null;
      if(t){const need=[...new Set(ids(t.doc))];for(let i=0;i<need.length;i+=80)(await get('people?select=id,data&id=in.('+need.slice(i,i+80).map(encodeURIComponent).join(',')+')')).forEach(p=>people[p.id]=p.data)}
      else if(adm){const g=await rpc('get_tree',{p_code:c,p_link:LINK});if(g.ok){t=g.tree;people=g.people}}}
    catch(e){M.offline=true}
    if(!t){location.replace(location.pathname+'?'+(M.offline?'offline=':'unpublished=')+encodeURIComponent(LINK));return stay()}
    ids(t.doc).forEach(id=>{if(!people[id])people[id]={first:'',middle:'',last:'',alt:'',g:'?',dead:false}});
    BASE={root:t.doc,people,name:t.name||'Unnamed tree',pre:'db',published:!!t.published,version:t.version};
    M.NAME=BASE.name;M.PUBLISHED=BASE.published;window.TREENAMES[LINK]=BASE.name}
  M.load=async function(){if(DBT)await dbTree();M.DB=clone(BASE);
    // TREES: the published database trees for everyone; every tree for Hanh (admin), the unpublished ones marked
    try{const c=ls.get(ACK)||'';M.more=(ls.get(AK)&&c?((await rpc('tree_list',{p_code:c})).trees||[]):(await get('trees?select=link,name,published&order=created_at')))}catch(e){M.more=[]}
    // Entry 159: this tree's updates, plus other trees' updates on linked people (ids translated to this tree)
    const tr=o=>{const t=o.t||DEF;if(t===LINK)return o;const x=Object.assign({},o);
      // Entry 201: Hạnh's Paternal tree ↔ a database tree sharing people with it (ids hp:<cell>)
      // Entry 206: any built-in tree (Hạnh's Paternal ids ↔ hp:<cell>; the others keep their own ids, e.g. hm:…)
      const viaHp=(BASES[t]&&DBT)?(i=>{const j=t==='hanh-paternal'&&!M.DB.people[i]?HP(i):i;return i&&M.DB.people[j]?j:null}):(!DBT&&!BASES[t])?(i=>{if(!i)return null;const j=LINK==='hanh-paternal'&&String(i).startsWith('hp:')?UNHP(i):i;return j&&M.DB.people[j]?j:null}):(BASES[t]&&!DBT)?(i=>i&&!BASES[t].people[i]&&M.DB.people[i]?i:null):null;   // Entry 210: + linked database people (m-/u- ids) between trees
      // Entry 214: someone added in another tree who is ALREADY in this one (a shared or linked person) is not added again
      // (Hanh: two "Hạnh con của Hậu" in the Grandpa tree after linking Bà Lịch's family into the Grandma tree)
      if((o.op==='child'||o.op==='spouse')&&((viaHp&&viaHp(o.id))||here(t,o.id)))return null;
      if(viaHp){if(o.op==='edit'||o.op==='remove'){x.id=viaHp(o.id);if(!x.id&&BASES[t]&&!DBT)x.id=here(t,o.id);return x.id?x:null}x.to=viaHp(o.to)||(BASES[t]&&!DBT?here(t,o.to):null);if(!x.to)return null;if(o.m)x.m=viaHp(o.m)||o.m;return x}
      if(o.op==='edit'||o.op==='remove'){x.id=here(t,o.id);return x.id?x:null}
      x.to=here(t,o.to);if(!x.to)return null;if(o.m)x.m=here(t,o.m)||o.m;return x};
    try{const U=await get('updates?select=id,status,ops&order=id');U.forEach(u=>apply(M.DB,(u.ops||[]).map(tr).filter(Boolean),u.status==='pending'));
      // Entry 210: people linked in from a database tree carry that tree's latest record
      if(!DBT){const ext=ids(M.DB.root).filter(i=>!BASE.people[i]&&/^(m|u)-/.test(i));if(ext.length){try{const rows=await get('people?select=id,data&id=in.('+ext.map(encodeURIComponent).join(',')+')');
        rows.forEach(r=>{if(r.data&&M.DB.people[r.id])Object.assign(M.DB.people[r.id],r.data)});
        U.filter(u=>u.status==='pending').forEach(u=>(u.ops||[]).map(tr).filter(o=>o&&o.op==='edit'&&ext.includes(o.id)).forEach(o=>Object.assign(M.DB.people[o.id],o.set||{})))}catch(e){}}}}
    catch(e){M.DB=clone(BASE);M.PEND.clear();M.NEW.clear();M.offline=true}
    M.DB0=clone(M.DB)};
  const disp=p=>(p.title?p.title+' ':'')+(p.first||'??')+(p.alt?' ('+p.alt+')':'');
  const toT=n=>({n:n.k.map(id=>disp(M.DB.people[id])),g:n.k.map(id=>M.DB.people[id].g||'?').join(''),k:n.k.slice(),x:n.k.map(id=>M.DB.people[id].dead?'1':'0').join(''),a:n.k.map(id=>M.DB.people[id].adopted?'1':'0').join(''),c:(n.c||[]).map(toT),...(n.m?{m:n.m}:{}),...(n.s?{s:1}:{})});
  M.tree=()=>toT(M.DB.root);M.disp=disp;
  // Entry 159: the other trees this person is also in → [{t,name,id}] for the edit panel's "Also in" buttons
  M.alsoIn=id=>{const l=(OTHER[LINK+'|'+id]||[]).filter(y=>BASES[y.t]).map(y=>({t:y.t,id:y.id,name:BASES[y.t].name}));
    if(DBT&&String(id).startsWith('hp:')&&BASES['hanh-paternal'])l.push({t:'hanh-paternal',id:UNHP(id),name:BASES['hanh-paternal'].name});
    if(DBT)Object.entries(BASES).forEach(([t,b])=>{if(b.pre&&String(id).startsWith(b.pre)&&b.people&&b.people[id])l.push({t,id,name:b.name})});return l};   // Entry 201 / 206
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
  const FIELDS=['first','middle','last','alt','g','dead','adopted','god','bm','by'];   /* Entry 211: + birth month / year */const J=v=>v&&typeof v==='object'?JSON.stringify(v):(v??'');
  M.ops=function(){const A=M.DB0,B=M.DB,ops=[];
    Object.keys(A.people).forEach(id=>{const a=A.people[id],b=B.people[id];if(!b)return;const set={},was={};
      FIELDS.forEach(f=>{if(J(a[f])!==J(b[f])&&!((f==='dead'||f==='adopted'||f==='bm'||f==='by')&&!a[f]&&!b[f])){set[f]=b[f];was[f]=a[f]??''}});if(Object.keys(set).length)ops.push({op:'edit',id,set,was})});
    ids(B.root).filter(id=>!A.people[id]).forEach(id=>{const f=M.find(id),p=Object.assign({},B.people[id]);delete p.added;
      if(f.i>0)ops.push({op:'spouse',id,to:f.node.k[0],at:f.i,person:p});
      else{const par=f.parent;ops.push({op:'child',id,to:par.k[0],at:par.c.indexOf(f.node),m:f.node.m||null,person:p})}});
    const live=new Set(ids(B.root));Object.entries(M.removed||{}).forEach(([id,why])=>{if(!live.has(id))ops.push({op:'remove',id,why,was:Object.assign({},A.people[id])})});   // Entry 152
    // Entry 207b: children put in a new order → one "order" op per family (the full new order; applied last)
    const was=new Map();(function w(n){was.set(n.k[0],(n.c||[]).map(c=>c.k[0]));(n.c||[]).forEach(w)})(A.root);
    (function w(n){const a=was.get(n.k[0]),now=(n.c||[]).map(c=>c.k[0]);if(a){const x=now.filter(i=>a.includes(i)).join(),y=a.filter(i=>now.includes(i)).join();if(x!==y)ops.push({op:'order',id:n.k[0],kids:now})}(n.c||[]).forEach(w)})(B.root);
    ops.forEach(o=>o.t=LINK);return ops};
  M.summary=ops=>ops.map(o=>{const nm=p=>disp(p);if(o.op==='order')return 'New birth order for '+disp(M.DB.people[o.id])+"'s children";if(o.op==='edit')return 'Changed '+disp(M.DB.people[o.id]);if(o.op==='remove')return 'Removed '+disp(o.was||{})+' ('+(o.why==='divorced'?'divorced':'added by mistake')+')';
    const to=disp(M.DB.people[o.to]);return 'Added '+nm(o.person)+(o.op==='spouse'?' (spouse of '+to+')':' (child of '+to+')')}).join(' · ');
  M.save=async function(state){if(M.offline)return {ok:false,why:'offline'};const all=M.ops();if(!all.length)return {ok:false,why:'nothing changed'};
    // Entry 210: a linked family can be many changes — sent in parts of 20 (the database's limit for one update), in order
    let r,inn=false;for(let s=0;s<all.length;s+=20){const ops=all.slice(s,s+20);
    r=await rpc('send_update',{p_code:M.code()||'',p_sender:M.sender(),p_summary:BASE.name+': '+M.summary(ops),p_ops:ops});if(!r.ok)break;
    // Entry 207: Hanh with Edit on — confirmed as it is sent (and written into a database tree), no Review step
    if(r.ok&&r.id&&window.EDITON&&M.isAdmin()){try{const d=await M.updateDecide([r.id],true);if(d.ok){inn=true;if(M.isDb(LINK)){const w=await M.writeBack(LINK,ops);if(!w.ok&&window.toast)toast('Confirmed, but not written into that tree ('+w.why+')')}}}catch(e){}}}
    if(r.ok){try{if(state)sessionStorage.setItem(RK,JSON.stringify(state));sessionStorage.setItem('hft-main-sent',inn?'in':'1')}catch(e){}}if(r.why==='code')M.forget();return r};
  // Hanh's admin code (shared with Minh's page): the review list
  M.isAdmin=()=>!!ls.get(AK)&&!!ls.get(ACK);
  M.adminCheck=async c=>{const r=await rpc('check_code',{p_code:c});if(r.ok&&r.admin){ls.set(ACK,c.trim().toUpperCase());ls.set(AK,'1')}return r};
  const ac=()=>ls.get(ACK)||'';
  M.reviewList=()=>rpc('review_list',{p_code:ac()});
  M.confirm=ids=>rpc('confirm_changes',{p_code:ac(),p_ids:ids});
  M.photoReview=()=>rpc('photo_review',{p_code:ac()});
  M.photoDecide=(ids,ok)=>rpc('photo_decide',{p_code:ac(),p_ids:ids,p_ok:ok});
  M.photoRemove=person=>rpc('photo_remove',{p_code:ac(),p_person:person});   // Entry 155
  M.updateReview=()=>rpc('update_review',{p_code:ac()});
  M.updateDecide=(ids,ok)=>rpc('update_decide',{p_code:ac(),p_ids:ids,p_ok:ok});
  // Entry 201: Hanh publishes / unpublishes the open database tree
  M.setPublished=on=>rpc('set_published',{p_code:ac(),p_link:LINK,p_on:!!on});
  // Entry 201: a confirmed update to a database tree is written into that tree too, so its editor sees it on /editor/
  M.isDb=t=>!!t&&!BASES[t];
  M.writeBack=async(link,ops)=>{const g=await rpc('get_tree',{p_code:ac(),p_link:link});if(!g.ok)return g;
    const db={root:g.tree.doc,people:g.people};apply(db,ops,false);
    return rpc('save_tree',{p_code:ac(),p_link:g.tree.link,p_version:g.tree.version,p_doc:db.root,p_people:db.people})};
  return M;
})();
MINH.load().then(()=>{const s=document.createElement('script');s.textContent=document.getElementById('engine').textContent;document.body.appendChild(s)});
