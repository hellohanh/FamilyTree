// Minh's trees, live in Supabase (Entries 126, 131, 132). The page reads with the public key; every write goes through
// the code-checked functions in supabase/02_minh.sql. ?tree=<link name> picks the tree (default: thuong).
// Shape (same as the database): tree.doc = {k:[ids], c:[nodes], m?:id}; people = {id:{first,middle,last,alt,g,dead}}.
// A node is a family box: k[0] is the blood relative, k[1..] their spouses; c = children (oldest first);
// m = the child's other parent when the box above has 2+ spouses (v2's "mother" field, Entry 92).
const MINH=(function(){
  const SB='https://quqgwvwijvwshdpwvkrk.supabase.co',KEY='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV';   // public by design (Entry 75)
  const RK='hft-minh-restore',CK='hft-minh-code',AK='hft-minh-admin',CACHE='hft-minh-cache:';
  const H={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
  const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
  const link=(new URLSearchParams(location.search).get('tree')||'thuong').toLowerCase();
  let restore=null;try{restore=JSON.parse(sessionStorage.getItem(RK));sessionStorage.removeItem(RK)}catch(e){}
  const M={DB:null,tree0:null,trees:[],link,restore,offline:false,error:''};
  const get=async path=>{const r=await fetch(SB+'/rest/v1/'+path,{headers:H});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()};
  const rpc=async(fn,args)=>{const r=await fetch(SB+'/rest/v1/rpc/'+fn,{method:'POST',headers:H,body:JSON.stringify(args)});
    if(!r.ok){let m='HTTP '+r.status;try{m=(await r.json()).message||m}catch(e){}throw new Error(m)}return r.json()};
  const ids=n=>[...n.k,...(n.c||[]).flatMap(ids)];
  // load the tree (and the list of trees for the pane); a saved copy on this device is the fallback when offline
  M.load=async function(){
    try{
      const [rows,all]=await Promise.all([get('trees?select=id,link,old_links,name,doc,version&or=(link.eq.'+encodeURIComponent(link)+',old_links.cs.%7B'+encodeURIComponent(link)+'%7D)'),get('trees?select=link,name,created_at&order=created_at')]);
      M.trees=all;
      if(!rows.length){M.error='There is no tree called “'+link+'”.';return M.blank()}
      const t=rows[0],need=[...new Set(ids(t.doc))],people={};
      for(let i=0;i<need.length;i+=80){(await get('people?select=id,data&id=in.('+need.slice(i,i+80).map(encodeURIComponent).join(',')+')')).forEach(p=>people[p.id]=p.data)}
      need.forEach(id=>{if(!people[id])people[id]={first:'',g:'?'}});
      M.DB={link:t.link,name:t.name,version:t.version,root:t.doc,people};ls.set(CACHE+t.link,JSON.stringify(M.DB))
    }catch(e){const c=ls.get(CACHE+link);M.offline=true;M.error="Can't reach the family database right now"+(c?' — showing the last copy on this device; saving is off.':'.');
      if(c)M.DB=JSON.parse(c);else M.blank()}
  };
  M.blank=()=>{M.DB={link,name:null,version:0,root:{k:['x1','x2'],c:[]},people:{x1:{first:'',g:'M'},x2:{first:'',g:'F'}}}};
  const disp=p=>(p.first||'??')+(p.alt?' ('+p.alt+')':'');   // "??" = not named yet (the same mark the family sheet uses)
  const toT=n=>({n:n.k.map(id=>disp(M.DB.people[id])),g:n.k.map(id=>M.DB.people[id].g||'?').join(''),k:n.k.slice(),x:n.k.map(id=>M.DB.people[id].dead?'1':'0').join(''),a:n.k.map(id=>M.DB.people[id].adopted?'1':'0').join(''),c:(n.c||[]).map(toT),...(n.m?{m:n.m}:{})});
  M.tree=()=>toT(M.DB.root);M.disp=disp;
  // Entry 149: is `cell` one of `viewer`'s godparents (picked from the search, so it carries an id)?
  window.GODOF=(viewer,cell)=>{const p=M.DB&&M.DB.people[viewer];if(!p||!p.god)return false;const ids=[cell,window.PID?window.PID(cell):cell];return Object.values(p.god).some(g=>g&&g.id&&ids.includes(g.id))};
  M.find=function find(id,n=M.DB.root,parent=null){const i=n.k.indexOf(id);if(i>=0)return {node:n,parent,i};for(const c of n.c||[]){const r=find(id,c,n);if(r)return r}return null};
  M.newId=()=>'m-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  // the code: asked once per device (Entry 126), checked by Supabase; only remembered after Supabase says yes
  M.code=()=>ls.get(CK);
  M.checkCode=async c=>{const r=await rpc('check_code',{p_code:c});if(r.ok){ls.set(CK,c.trim().toUpperCase());M.editor=r;if(r.admin)ls.set(AK,'1');else ls.del(AK)}return r};
  // Entry 137: Hanh's admin code (Supabase says admin) → the review list + Code Maker link in the pane
  M.isAdmin=()=>!!ls.get(AK)&&!!ls.get(CK);
  M.reviewList=()=>rpc('review_list',{p_code:M.code()||''});
  M.confirm=ids=>rpc('confirm_changes',{p_code:M.code()||'',p_ids:ids});
  // Entry 143: pictures waiting for Hanh (Confirm / Reject)
  M.photoReview=()=>rpc('photo_review',{p_code:M.code()||''});
  M.photoDecide=(ids,ok)=>rpc('photo_decide',{p_code:M.code()||'',p_ids:ids,p_ok:ok});
  M.photoRemove=person=>rpc('photo_remove',{p_code:M.code()||'',p_person:person});   // Entry 155
  M.forget=()=>{ls.del(CK);ls.del(AK)};
  M.keep=state=>{try{sessionStorage.setItem(RK,JSON.stringify(state))}catch(e){}};   // come back to this view after a reload
  // save the whole tree (Supabase logs every difference for Hanh's review list)
  M.save=async function(state){
    if(M.offline)return {ok:false,why:'offline'};
    const people={};ids(M.DB.root).forEach(id=>people[id]=M.DB.people[id]);
    const r=await rpc('save_tree',{p_code:M.code()||'',p_link:M.DB.link,p_version:M.DB.version,p_doc:M.DB.root,p_people:people});
    if(r.ok){M.DB.version=r.version;ls.set(CACHE+M.DB.link,JSON.stringify(M.DB));try{if(state)sessionStorage.setItem(RK,JSON.stringify(state))}catch(e){}}
    if(r.why==='code')M.forget();
    return r};
  // Entry 138: rename the tree (the link name stays)
  M.rename=name=>rpc('rename_tree',{p_code:M.code()||'',p_link:M.DB.link,p_name:name});
  M.createTree=(name,lnk,doc,people)=>rpc('create_tree',{p_code:M.code()||'',p_link:lnk,p_name:name,p_doc:doc,p_people:people});
  return M;
})();
// start the page once Minh's tree is in hand: the v2 engine waits in <script type="text/hft-engine">
MINH.load().then(()=>{const s=document.createElement('script');s.textContent=document.getElementById('engine').textContent;document.body.appendChild(s)});
