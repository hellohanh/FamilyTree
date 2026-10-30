/* ================= Entry 210: "Already in another tree" — while typing a new person's first name =================
   Hanh: adding Thương as a son (main page) — he is already in Sơn's tree as Phúc's husband — no link was offered.
   Both pages: under the new person's First name box, people from every OTHER tree (the built-in ones and the ones kept
   in the family database) whose first name starts with what's typed (accents ignored), the right gender for Son /
   Daughter / Brother / Sister, not already in this tree. Each shows "con của … / vợ của …", the tree, and how many
   people come with them. Picking one links them: Save adds that same person (shared record) with the family under
   them — a blood relative's whole box and children; someone who married in: them, their partner, and the children
   they share (Thương → Phúc & their children's families). A spouse picked from the list comes alone. */
(function(){
 const $=i=>document.getElementById(i),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const fold=t=>String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[đĐ]/g,'d').toLowerCase().trim();
 const ids=n=>[...n.k,...(n.c||[]).flatMap(ids)],clone=o=>JSON.parse(JSON.stringify(o));
 const SB='https://quqgwvwijvwshdpwvkrk.supabase.co',KEY='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV',H={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
 const get=async u=>{const r=await fetch(SB+'/rest/v1/'+u,{headers:H});if(!r.ok)throw new Error(r.status);return r.json()};
 const rpc=async(fn,a)=>{const r=await fetch(SB+'/rest/v1/rpc/'+fn,{method:'POST',headers:H,body:JSON.stringify(a)});if(!r.ok)throw new Error(r.status);return r.json()};
 const HERE=()=>(MINH.DB&&MINH.DB.link)||MINH.LINK||'';
 const isInc=s=>window.isINC&&window.isINC(s);
 // every other tree as {link,name,root,people} with shared ids (Hạnh's Paternal cells → hp:<cell>)
 let LOAD=null;
 function trees(){if(LOAD)return LOAD;LOAD=(async()=>{const out=[],here=HERE();
  (window.XBUILT||[]).forEach(T=>{if(T.link!==here)out.push(T)});
  try{const rows=await get('trees?select=link,name,doc,published&order=created_at');const all=rows.slice(),code=(()=>{try{return localStorage.getItem('hft-minh-code')||''}catch(e){return ''}})();
   // Hanh (admin) and editors also see their unpublished trees
   const more=(MINH.more||MINH.trees||[]).filter(t=>t.published===false&&!all.some(r=>r.link===t.link));
   for(const t of more){try{const g=await rpc('get_tree',{p_code:code,p_link:t.link});if(g.ok)all.push({link:g.tree.link,name:g.tree.name,doc:g.tree.doc,_people:g.people,published:false})}catch(e){}}
   const need=new Set();all.forEach(t=>{if(t.link!==here&&!t._people&&t.doc)ids(t.doc).forEach(i=>need.add(i))});const L=[...need],pp={};
   for(let i=0;i<L.length;i+=80)(await get('people?select=id,data&id=in.('+L.slice(i,i+80).map(encodeURIComponent).join(',')+')')).forEach(p=>pp[p.id]=p.data);
   all.forEach(t=>{if(t.link===here||!t.doc)return;out.push({link:t.link,name:t.name||'Unnamed tree',root:t.doc,people:t._people||pp,pub:t.published!==false})})}catch(e){}
  return out})();return LOAD}
 function find(id,n,par=null){const i=n.k.indexOf(id);if(i>=0)return {node:n,parent:par,i};for(const c of n.c||[]){const r=find(id,c,n);if(r)return r}return null}
 // the family that comes along (same rule as the "Same person?" offer, Entry 206)
 function branch(T,X){const f=find(X,T.root);if(!f)return null;const n=f.node;
  if(f.i===0)return {k:n.k.slice(),c:(n.c||[]).map(clone),...(f.parent?{}:{})};
  const c=(n.c||[]).filter(ch=>n.k.length===2||ch.m===X).map(clone);c.forEach(ch=>delete ch.m);return {k:[X,n.k[0]],c}}
 const dp=p=>p?((p.first||'??')+(p.alt?' ('+p.alt+')':'')):'??',bare=s=>String(s).replace(/^(Ông|Bà) /,'');
 function who(T,X){const f=find(X,T.root);if(!f)return '';const n=f.node,P=T.people;
  if(f.i>0){const g=(P[X]||{}).g;return (g==='F'?'vợ':g==='M'?'chồng':'vợ/chồng')+' của '+bare(dp(P[n.k[0]]))}
  if(!f.parent)return '';const par=f.parent,mi=n.m?par.k.indexOf(n.m):(par.k.length===2?1:-1);
  return 'con của '+[0,mi].filter(i=>i>=0).map(i=>bare(dp(P[par.k[i]]))).join(' & ')}
 // already in this tree? (its own ids, the shared form of them, and people linked to it in data/links.json)
 function inHere(id,T){const have=new Set(ids(MINH.DB.root));if(have.has(id))return true;
  if(window.PID&&[...have].some(h=>window.PID(h)===id))return true;
  if(MINH.hereOf&&MINH.hereOf(T.link,id))return true;return false}
 let TS=null,ROW=null;
 function want(){const r=window.EDSTATE&&window.EDSTATE().rel;return r==='son'||r==='brother'?'M':r==='daughter'||r==='sister'?'F':null}
 async function show(){const inp=$('nF'),box=$('nX');if(!inp||!box)return;const ED=window.EDSTATE&&window.EDSTATE();
  if(!ED||ED.xl){box.innerHTML=ED&&ED.xl?linked(ED.xl):'';wire();return}
  const t=fold(inp.value);if(!t||t.length<2||isInc(inp.value)){box.innerHTML='';return}
  TS=TS||await trees();if(fold(inp.value)!==t)return;const g=want(),hits=[],seen=new Set();
  TS.forEach(T=>Object.entries(T.people).forEach(([x,p])=>{if(!p||seen.has(x)||isInc(p.first)||!fold(p.first).startsWith(t))return;if(g&&p.g&&p.g!=='?'&&p.g!==g)return;
   if(!find(x,T.root)||inHere(x,T))return;seen.add(x);const b=ED.rel==='spouse'?{k:[x],c:[]}:branch(T,x);hits.push({T,x,p,b,n:ids(b).length,w:who(T,x),exact:fold(p.first)===t})}));
  hits.sort((a,b)=>(b.exact-a.exact)||(b.n-a.n));
  box.innerHTML=hits.length?'<span class="lb">Already in another tree — tap to link the same person</span>'+hits.slice(0,5).map((h,i)=>`<button class="xo" type="button" data-i="${i}"><img alt="" src="${window.AVATAR?window.AVATAR({d:null,g:h.p.g==='F'?'F':'M'}):''}"><span><b>${esc([h.p.last,h.p.middle,dp(h.p)].filter(Boolean).join(' '))}</b><small>${esc(h.w)}</small><small class="tg">${esc(h.T.name)}${h.n>1?' · brings '+h.n+' people':''}</small></span></button>`).join(''):'';
  box.querySelectorAll('.xo').forEach(bn=>bn.onclick=()=>pick(hits[+bn.dataset.i]))}
 function linked(x){const P=x.T.people,o=x.b.k.slice(1).map(k=>dp(P[k])),kids=x.b.c.length;
  return `<div class="xl"><span class="lb">Linked — the same person as in ${esc(x.T.name)}</span><div class="xlr"><b>${esc(dp(P[x.x]))}</b><small>${esc(x.w)}${x.n>1?' · comes with '+[o.length?o.join(', '):'',kids?kids+' children’s famil'+(kids===1?'y':'ies'):''].filter(Boolean).join(' and ')+' ('+x.n+' people)':''}</small><button class="btn" id="nXun" type="button">Unlink</button></div></div>`}
 function wire(){const u=$('nXun');if(u)u.onclick=()=>{const ED=window.EDSTATE();ED.xl=null;['nF','nM','nL','nA'].forEach(i=>{$(i).readOnly=false;$(i).value=''});$('nP').checked=false;$('nF').focus();window.EDRENDER();show()}}
 function pick(h){const ED=window.EDSTATE();ED.xl={T:h.T,x:h.x,b:h.b,n:h.n,w:h.w};const p=h.p;
  $('nF').value=p.first||'';$('nM').value=p.middle||'';$('nL').value=p.last||'';$('nA').value=p.alt||'';$('nP').checked=!!p.dead;if($('nBm')){$('nBm').value=p.bm?String(p.bm):'';$('nBy').value=p.by?String(p.by):''}['nF','nM','nL','nA'].forEach(i=>{$(i).readOnly=true;const s=$(i+'s');if(s)s.innerHTML=''});
  if(ED.rel==='spouse'&&(p.g==='M'||p.g==='F'))ED.sg=p.g;window.EDRENDER();show()}
 // Save: put the linked person (and the family that comes along) in place of a new person; returns the id used
 window.XLINKAPPLY=function(ED,place){const x=ED.xl;if(!x)return null;const DB=MINH.DB;
  ids(x.b).forEach(k=>{if(!DB.people[k]){const r=clone(x.T.people[k]||{first:'',g:'?'});delete r.title;r.src=x.T.link;DB.people[k]=r}});
  place(ED.rel==='spouse'?x.x:clone({k:x.b.k,c:x.b.c}));return x.x};
 // Entry 215 (Hanh): "the search function in the navigational pane should search across all publish trees" —
 // under this tree's matches, "In other trees": the same name search (any word of the name or nickname starts with what
 // is typed, accents ignored) in every other published tree (built-in + the family database). Someone already in this
 // tree (shared) is left out — they're in the list above. A tap opens that tree with them as the focal (?focus=).
 {const q=$('q'),res=$('res');if(q&&res){
  const unhp=i=>String(i).slice(3).replace(/_([0-9a-f]{2})/g,(m,h)=>String.fromCharCode(parseInt(h,16)));
  const BASEURL=/\/(minh|editor)\/?$/.test(location.pathname)?'../':'./';let seq=0;
  async function other(){const my=++seq,t=fold(q.value);if(!t)return;const L=await trees();if(my!==seq||fold(q.value)!==t)return;
   const hits=[];L.forEach(T=>{if(!T.pub&&T.pub!==undefined)return;Object.entries(T.people).forEach(([x,p])=>{if(!p||isInc(p.first))return;
    const nm=dp(p),key=fold(nm);if(!(' '+key.replace(/[()]/g,' ')).includes(' '+t))return;if(!find(x,T.root)||inHere(x,T))return;
    hits.push({T,x,nm,w:who(T,x),st:key.startsWith(t)})})});
   if(!hits.length)return;hits.sort((a,b)=>(b.st-a.st)||a.nm.localeCompare(b.nm,'vi')||a.T.name.localeCompare(b.T.name,'vi'));
   const none=res.querySelector('.none');if(none)none.remove();
   const h=document.createElement('div');h.className='xres';h.innerHTML='<div class="xhd">In other trees</div>';
   hits.slice(0,30).forEach(r=>{const b=document.createElement('button');b.setAttribute('role','option');b.innerHTML='<b></b><small></small><small class="xt"></small>';
    b.querySelector('b').textContent=r.nm;b.querySelector('small').textContent=r.w;b.querySelector('.xt').textContent=r.T.name;
    const id=r.T.link==='hanh-paternal'&&String(r.x).startsWith('hp:')?unhp(r.x):r.x;
    b.onclick=()=>{location.href=BASEURL+'?tree='+encodeURIComponent(r.T.link)+'&focus='+encodeURIComponent(id)};h.appendChild(b)});
   res.appendChild(h)}
  q.addEventListener('input',()=>setTimeout(other,0));q.addEventListener('focus',()=>{trees()},{once:true});
  const st=document.createElement('style');st.textContent='#res .xres .xhd{font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--gold,#F0BC4F);padding:10px 12px 4px;font-weight:700}#res .xres small.xt{color:var(--gold,#F0BC4F);opacity:.85}';document.head.appendChild(st)}}
 window.XLINKSHOW=show;window.XTREES=trees;   /* Entry 212: focal.js reads every other tree too */
 window.XLINKREL=()=>{const ED=window.EDSTATE&&window.EDSTATE();if(ED&&ED.xl){const x=ED.xl;x.b=ED.rel==='spouse'?{k:[x.x],c:[]}:branch(x.T,x.x)||{k:[x.x],c:[]};x.n=ids(x.b).length}show()};
 const inp=$('nF');if(inp){const box=document.createElement('div');box.className='sug xs';box.id='nX';$('nRow').before(box);
  inp.addEventListener('input',()=>{const ED=window.EDSTATE&&window.EDSTATE();if(ED&&ED.xl)return;show()});
  inp.addEventListener('focus',()=>{trees()})}
})();
