/* ================= Entry 247: Relationship — how two people are related =================
   Hanh: "In the side panel … a section called Relationship. Two name fields … the first is the focal, the second the
   relative … the results will say: Kygo is your Cháu — he is related to you by xxx via xxx. Next to the two fields a
   swap icon … Hanh is your Chú …". Walked through with Hanh step by step (S019):
   1. a card over the tree (like Edit Tree);  2. both fields start empty; they find everyone in every tree (built-in +
   family database), accents optional, each match with "con của … / vợ của …";  3. the answer: a sentence ("Kygo is
   your Cháu — he is related to you by being your second cousin's son, via your Bà Nội Lịch and her brother Cư.")
   and under it the path, each person with the title the focal uses;  4. marriage only: "not a blood relative —
   related to you by marriage: he is your Mợ Văn's brother" + the path with ═ (title by age when both birth years are
   known, else "no set title"); related two ways: both, the one chosen in Options → Related both ways first;
   no link: said plainly.
   How: one family graph from every tree (the same person in two built-in trees is one — data/links.json); the couple
   both come from; then a small tree of just those two lines goes through the site's own title engine (buildKin), so
   vai (the sibling listed first is older), Nội / Ngoại, Thím/Mự and Miền Trung come out exactly as on the cards. */
(function(){
 const $=i=>document.getElementById(i),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const fold=t=>String(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[đĐ]/g,'d').toLowerCase().trim();
 const pid=c=>window.PID?window.PID(c):c,HERE=()=>(MINH.DB&&MINH.DB.link)||MINH.LINK||'';
 // ---------- the family graph ----------
 let G=null;
 async function graph(){if(G)return G;
  const T=[];(window.XBUILT||[]).forEach(t=>T.push(t));let L=[];try{L=window.XTREES?await window.XTREES():[]}catch(e){}
  L.forEach(t=>{if(t.root&&!T.some(x=>x.link===t.link))T.push(t)});
  if(MINH.DB&&MINH.DB.root&&!T.some(x=>x.link===HERE())){const cv=n=>({k:n.k.map(pid),c:(n.c||[]).map(cv),...(n.m?{m:pid(n.m)}:{})}),P0=MINH.DB.people||{},cp={};
   Object.keys(P0).forEach(k=>cp[pid(k)]=P0[k]);T.push({link:HERE(),name:MINH.DB.name||MINH.NAME||'',root:cv(MINH.DB.root),people:cp})}
  const CAN={};(window.XGROUPS||[]).forEach(g=>{const s=Object.entries(g).map(([t,id])=>t==='hanh-paternal'?'hp:'+id:id);s.forEach(x=>CAN[x]=s[0])});
  const C=id=>CAN[id]||id,P={},par={},kids={},sp={},ord={},inT={};
  const add=(m,a,b)=>{(m[a]=m[a]||new Set()).add(b)};
  T.forEach(t=>{(function w(n,p,pos){const a=C(n.k[0]);n.k.forEach(id=>{const c=C(id);if(!P[c]&&t.people[id])P[c]=t.people[id];(inT[c]=inT[c]||new Set()).add(t.name||t.link)});
   n.k.slice(1).forEach(id=>{add(sp,a,C(id));add(sp,C(id),a)});
   if(p){const pa=C(p.k[0]),pb=n.m?C(n.m):p.k.length===2?C(p.k[1]):null;[pa,pb].forEach(x=>{if(!x)return;add(par,a,x);add(kids,x,a);if(!((x+'|'+a) in ord))ord[x+'|'+a]=pos})}
   (n.c||[]).forEach((c,i)=>w(c,n,i))})(t.root,null,0)});
  G={P,par,kids,sp,ord,inT,C};return G}
 const nm=id=>{const p=G.P[id]||{};return (p.first||'??')},nmA=id=>{const p=G.P[id]||{};return (p.first||'??')+(p.alt?' ('+p.alt+')':'')};
 const gen=id=>(G.P[id]||{}).g||'?',he=id=>gen(id)==='F'?'she':gen(id)==='M'?'he':'they',his=id=>gen(id)==='F'?'her':gen(id)==='M'?'his':'their';
 const ws=(id,m,f,x)=>gen(id)==='M'?m:gen(id)==='F'?f:x;
 // Hanh: "add the avatar to each of the relative" — a real photo when there is one, else the drawn avatar; a couple
 // shares one set (Entry 77), picked from their ids so it stays the same
 const SETS=['set1-blue','set2-black-white','set3-gold-red','set4-porcelain-jade','set5-purple-lilac','set6-brown-checkered'];
 function av(id){try{const ph=typeof PHOTO!=='undefined'&&PHOTO.get(id);if(ph&&ph.url)return `<img class="ra" src="${esc(ph.url)}" alt="">`}catch(e){}
  const g=gen(id);if(g!=='M'&&g!=='F')return '<span class="ra none">?</span>';const base=window.AVATAR?window.AVATAR({d:null,g}):'';if(!base)return '<span class="ra none">?</span>';
  const key=[id,...(G.sp[id]||[])].sort()[0];let h=0;for(const ch of key)h=(h*31+ch.charCodeAt(0))>>>0;
  return `<img class="ra" src="${esc(base.replace(/set\d-[a-z-]+?-(male|female)\.webp/,SETS[h%6]+'-$1.webp'))}" alt="">`}
 // all ancestors of `a` with their distance and the step back towards `a`
 function ups(a){const out=new Map([[a,{d:0,next:null}]]),q=[a];while(q.length){const x=q.shift();(G.par[x]||[]).forEach(p=>{if(!out.has(p)){out.set(p,{d:out.get(x).d+1,next:x});q.push(p)}})}return out}
 // blood ties between a and b: one per side (through a's father / mother), the nearest shared ancestor on each
 function blood(a,b){if(a===b)return [];const B=ups(b),res=[];
  const A=ups(a);if(B.has(a))return [{x:a,ua:0,ub:B.get(a).d,side:'',A,B}];if(A.has(b))return [{x:b,ua:A.get(b).d,ub:0,side:sideOf(A,b,a),A,B}];
  const best={};A.forEach((v,x)=>{if(x===a||!B.has(x))return;const s=sideOf(A,x,a),d=v.d+B.get(x).d;if(!best[s]||d<best[s].d||(d===best[s].d&&gen(x)==='M'&&gen(best[s].x)!=='M'))best[s]={x,d,ua:v.d,ub:B.get(x).d}});
  Object.entries(best).forEach(([s,v])=>{const cA=chainUp(A,v.x).slice(-1)[0],cB=chainUp(B,v.x).slice(-1)[0];if(cA!==cB)res.push({x:v.x,ua:v.ua,ub:v.ub,side:s,A,B})});return res}
 function sideOf(A,x,a){let n=x;while(A.get(n).next!==a&&A.get(n).next!==null)n=A.get(n).next;return gen(n)==='M'?'father':gen(n)==='F'?'mother':''}
 // [a, …, the one just below x] going up from a
 function chainUp(M,x){const out=[];let n=M.get(x).next;while(n!==null&&n!==undefined){out.unshift(n);n=M.get(n).next}return out}
 // ---------- titles: a small tree of the two lines through the site's engine ----------
 function fmt(u){u=u.replace(/(^| )Thím$/,'$1Thím/Mự');if(typeof CENTRAL!=='undefined'&&!CENTRAL)u=u.replace(/(^| )O$/,'$1Cô');return u.replace(/(^|[ /])(\p{Ll})/gu,(m,a,b)=>a+b.toUpperCase())}
 function mini(t,a,extra){   // t: a blood tie; extra: {at, sp} — `sp` married to `at` (already on the tree)
  const lineA=t.ua?chainUp(t.A,t.x):[],lineB=t.ub?chainUp(t.B,t.x):[];   // from a up to the child of x / from b up to the child of x
  const other=c=>[...(G.par[c]||[])].find(p=>p!==t.x);
  const node=(id,kids)=>{const k=[id];if(extra&&extra.at===id)k.push(extra.sp);return {n:k.map(nm),g:k.map(gen).join(''),k,c:kids}};
  const down=line=>{let n=null;line.forEach(id=>{n=node(id,n?[n]:[])});return n};   // line is [leaf … top]
  let root;
  if(t.ua===0)root=down(lineB.length?[...lineB.slice(0).reverse().reverse()]:[]),root=(()=>{let n=null;[...lineB].forEach(id=>{n=node(id,n?[n]:[])});return node(a,n?[n]:[])})();
  else if(t.ub===0){let n=null;[...lineA].forEach(id=>{n=node(id,n?[n]:[])});root=node(t.x,n?[n]:[])}
  else{const bA=down(lineA),bB=down(lineB),cA=lineA[lineA.length-1],cB=lineB[lineB.length-1],o=G.ord;
   const first=(o[t.x+'|'+cA]??0)<=(o[t.x+'|'+cB]??0);const r=node(t.x,first?[bA,bB]:[bB,bA]);const s=other(cA)||other(cB);if(s&&!(extra&&extra.at===t.x)){r.k.push(s);r.n.push(nm(s));r.g+=gen(s)}root=r}
  const K=buildKin(root),ix={};K.cells.forEach((c,i)=>ix[c]=i);const row=K.M[a];
  return id=>{if(!row||!(id in ix))return '';return fmt(K.titles[row[ix[id]]]||'')}}
 // ---------- words ----------
 const ORD=['','first','second','third','fourth','fifth','sixth','seventh','eighth','ninth','tenth'];
 const gWord=(n,id,base)=>n===1?base[0]:n===2?base[1]:'great-'.repeat(n-2)+base[1];
 function plain(t,a,b){const ua=t.ua,ub=t.ub;
  if(ua===0)return gWord(ub,b,ws(b,['son','grandson'],['daughter','granddaughter'],['child','grandchild'])).replace(/^(son|daughter|child)$/,'$1');
  if(ub===0)return gWord(ua,b,ws(b,['father','grandfather'],['mother','grandmother'],['parent','grandparent']));
  const n=Math.min(ua,ub);
  if(ub>=ua){const lineB=chainUp(t.B,t.x),z=lineB[lineB.length-ua];const base=ua===1?ws(z,'brother','sister','sibling'):ORD[ua-1]+' cousin';const e=ub-ua;
   return e?base+"'s "+gWord(e,b,ws(b,['son','grandson'],['daughter','granddaughter'],['child','grandchild'])):base}
  const lineA=chainUp(t.A,t.x),w=lineA[lineA.length-ub],e=ua-ub;const base=ub===1?ws(b,'brother','sister','sibling'):ORD[ub-1]+' cousin';
  const anc=lineA[e];   // a's ancestor e steps up
  return gWord(e,anc,ws(anc,['father','grandfather'],['mother','grandmother'],['parent','grandparent']))+"'s "+base}
 // ---------- the answer ----------
 function ties(a,b){const out=[];
  blood(a,b).forEach(t=>{const T=mini(t,a);out.push({kind:'blood',side:t.side,d:t.ua+t.ub,t,title:T(b),T})});
  // b married into a's blood family (Lâm → Bảo through Phưởng)
  (G.sp[b]||[]).forEach(s=>blood(a,s).forEach(t=>{const T=mini(t,a,{at:s,sp:b});out.push({kind:'spouse',side:t.side,d:t.ua+t.ub,t,via:s,title:T(b),T})}));
  return out}
 function pick(list){const by={};list.forEach(x=>{const k=x.side||'-';if(!by[k]||x.d<by[k].d||(x.d===by[k].d&&x.kind==='blood'))by[k]=x});
  let L=Object.values(by).filter(x=>x.title);
  // two ways only when the titles differ; Options → Related both ways decides which comes first
  let mode='closer';try{mode=localStorage.getItem('hft-both')||'closer'}catch(e){}
  L.sort((p,q)=>mode==='father'?(p.side==='father'?-1:1):mode==='mother'?(p.side==='mother'?-1:1):p.d-q.d||(p.kind==='blood'?-1:1));
  const seen=new Set();return L.filter(x=>{if(seen.has(x.title))return false;seen.add(x.title);return true})}
 function sentence(a,b,x){const T=x.T,t=x.t,B=nmA(b),title=x.title;
  let rel,via='';
  if(x.kind==='blood'){rel=`by being your ${plain(t,a,b)}`;
   if(t.ua===0||t.ub===0){const mid=(t.ua===0?chainUp(t.B,t.x).slice(1):chainUp(t.A,t.x).slice(1)).filter(id=>id!==a&&id!==b);
    const m=t.ua===0?mid.reverse():mid;if(m.length)via=`, via your ${m.slice(0,2).map(id=>`${T(id)} ${nm(id)}`.trim()).join(' and ')}`}
   else{const lineA=chainUp(t.A,t.x),lineB=chainUp(t.B,t.x),cA=lineA[lineA.length-1],cB=lineB[lineB.length-1];
    if(cA===a&&cB===b)via=`, via your parents ${nm(t.x)} & ${[...(G.par[a]||[])].filter(p=>p!==t.x).map(nm)[0]||''}`.replace(/ & $/,'');
    else if(cA===a)via=`, via your ${ws(cB,'brother','sister','sibling')} ${nm(cB)}`;
    else if(cB===b)via=`, via your ${T(cA)} ${nm(cA)}`;
    else via=`, via your ${T(cA)} ${nm(cA)} and ${his(cA)} ${ws(cB,'brother','sister','sibling')} ${nm(cB)}`}}
  else{rel=`by marriage: ${he(b)} is ${ws(b,'the husband','the wife','the spouse')} of your ${x.T(x.via)} ${nm(x.via)}`}
  return `<b>${esc(B)}</b> is your <span class="rc">${esc(title)}</span> — ${he(b)} is related to you ${esc(rel)}${esc(via)}.`}
 function path(a,b,x){const T=x.T,t=x.t,row=(arrow,id,lab)=>`<li><span class="ar">${arrow}</span>${lab?`<span class="lk">${esc(lab)}</span>`:''}${av(id)}${T(id)?`<span class="rc">${esc(T(id))}</span>`:''}<b>${esc(nmA(id))}</b></li>`;
  const end=x.kind==='spouse'?x.via:b;let h=`<li><span class="ar">•</span>${av(a)}<b>${esc(nmA(a))}</b> <small>(you)</small></li>`;
  const up=t.ua?chainUp(t.A,t.x):[],dn=t.ub?chainUp(t.B,t.x):[];
  if(t.ua===0){dn.slice().reverse().forEach(id=>{if(id!==a)h+=row('↓',id)})}
  else if(t.ub===0){up.slice(1).forEach(id=>h+=row('↑',id));h+=row('↑',t.x)}
  else{up.slice(1).forEach(id=>h+=row('↑',id));const cA=up[up.length-1],cB=dn[dn.length-1];
   if(cA!==a)h=h;h+=row('↔',cB,`${his(cA)} ${ws(cB,'brother','sister','sibling')}:`);dn.slice(0,-1).reverse().forEach(id=>h+=row('↓',id))}
  if(x.kind==='spouse')h+=row('═',b,`${his(end)} ${ws(b,'husband','wife','spouse')}:`);
  return `<ol class="rpath">${h}</ol>`}
 // marriage only (Bảo → Hùng): a blood relative X of a married to Y, and Y is b or b's blood relative; the marriage
 // nearest a wins (Bảo → Cậu Trung ═ Mợ Văn → her brother Hùng), title by age when both birth years are known
 function kin(a){const U=ups(a),out=new Map();U.forEach((v,x)=>{const q=[[x,v.d]];while(q.length){const [y,d]=q.shift();if(!out.has(y)||out.get(y)>d)out.set(y,d);(G.kids[y]||[]).forEach(k=>q.push([k,d+1]))}});return out}
 function route(a,b){if(a===b)return [a];const t=blood(a,b)[0];if(!t)return null;const up=t.ua?chainUp(t.A,t.x):[a],dn=t.ub?chainUp(t.B,t.x):[b];
  if(t.ua===0)return [a,...dn.slice().reverse()];if(t.ub===0)return [...up,t.x];return [...up,...dn.slice().reverse()]}   // sibling hop between the two lines
 function marriageAnswer(a,b){const KA=kin(a),KB=kin(b);let best=null;
  KA.forEach((da,X)=>(G.sp[X]||[]).forEach(Y=>{if(KA.has(Y))return;const db=Y===b?0:KB.get(Y);if(db===undefined)return;const s=da+db;if(!best||s<best.s||(s===best.s&&da<best.da))best={X,Y,s,da}}));
  if(!best)return null;const {X,Y}=best,ty=pick(ties(a,Y))[0],tb=Y===b?null:blood(Y,b)[0];
  const lead=ty?`${he(b)} is your ${ty.title} ${nm(Y)}`+(tb?`'s ${plain(tb,Y,b)}`:''):'';
  const p=[...(route(a,X)||[a,X]),...(route(Y,b)||[Y,b])];
  let g=0;for(let k=0;k<p.length-1;k++){if((G.par[p[k]]||new Set()).has(p[k+1]))g--;else if((G.kids[p[k]]||new Set()).has(p[k+1]))g++}
  const ya=+(G.P[a]||{}).by,yb=+(G.P[b]||{}).by;let title='';
  if(g<=-2)title=ws(b,'Ông','Bà','Ông/Bà');else if(ya&&yb)title=yb<ya?ws(b,'Anh','Chị','Anh/Chị'):'Em';
  const T=id=>{if(id===a)return '';const x=pick(ties(a,id))[0];return x?x.title:''};
  const hp=p.map((id,k)=>{const prev=p[k-1];const e=!k?'•':(G.sp[prev]||new Set()).has(id)?'═':(G.par[prev]||new Set()).has(id)?'↑':(G.kids[prev]||new Set()).has(id)?'↓':'↔';
   return `<li><span class="ar">${e}</span>${av(id)}${T(id)?`<span class="rc">${esc(T(id))}</span>`:''}<b>${esc(nmA(id))}</b>${k?'':' <small>(you)</small>'}</li>`}).join('');
  return `<p class="rs"><b>${esc(nmA(b))}</b> is not a blood relative — ${he(b)} is related to you by marriage${lead?': '+esc(lead):''}.</p><p class="rt">${title?`Title: <span class="rc">${esc(title)}</span>${g<=-2?' (two or more generations up)':' (by age)'}`:'No set title (no birth years to go by).'}</p><ol class="rpath">${hp}</ol>`}
 function answer(a,b){if(!a||!b)return '';if(a===b)return '<p class="rs">That\'s the same person.</p>';
  const L=pick(ties(a,b));if(L.length){const [x,...more]=L;let h=`<p class="rs">${sentence(a,b,x)}</p>${path(a,b,x)}`;
   more.forEach(y=>{h+=`<div class="also"><p class="rs"><span class="rc o">also ${esc(y.title)}</span> ${sentence(a,b,y)}</p>${path(a,b,y)}</div>`});
   if(more.length)h+=`<p class="rt">Related two ways — the order follows Options → Related both ways.</p>`;return h}
  return marriageAnswer(a,b)||`<p class="rs">No family link found between <b>${esc(nmA(a))}</b> and <b>${esc(nmA(b))}</b> in the trees yet.</p>`}
 // ---------- the card ----------
 // Hanh: "Hanh, son of Hau and Thuong, husband of Huong" · "Kygo, son of Huy and Anh Dao" (father first)
 const who=id=>{const ps=[...(G.par[id]||[])].sort((x,y)=>(gen(x)==='M'?0:1)-(gen(y)==='M'?0:1)),ss=[...(G.sp[id]||[])],out=[];
  if(ps.length)out.push(ws(id,'son','daughter','child')+' of '+ps.map(nm).join(' and '));
  if(ss.length)out.push(ws(id,'husband','wife','spouse')+' of '+ss.map(nm).join(' and '));return out.join(', ')};
 const sel={a:null,b:null};
 function field(k){const inp=$('rel'+k),list=$('rel'+k+'L');
  inp.oninput=()=>{sel[k.toLowerCase()]=null;show();const f=fold(inp.value);if(!f){list.innerHTML='';return}
   const hits=Object.keys(G.P).filter(id=>{const p=G.P[id];const s=fold((p.first||'')+' '+(p.alt||'')+' '+(p.last||''));return s.split(/\s+/).some(w=>w.startsWith(f))||s.startsWith(f)}).slice(0,8);
   list.innerHTML=hits.length?hits.map(id=>`<li role="option" data-id="${esc(id)}" tabindex="-1">${av(id)}<span><b>${esc(nmA(id))}</b>${who(id)?', '+esc(who(id)):''}</span></li>`).join(''):'<li class="none">No one by that name</li>';
   list.querySelectorAll('li[data-id]').forEach(li=>li.onclick=()=>{sel[k.toLowerCase()]=li.dataset.id;inp.value=nmA(li.dataset.id);list.innerHTML='';show()})}}
 function show(){const o=$('relOut');if(!o)return;o.innerHTML=sel.a&&sel.b?answer(sel.a,sel.b):'<p class="rt">Pick both people to see how they are related.</p>'}
 async function open(){document.body.classList.remove('pane-open');let c=$('relCard');
  if(!c){c=document.createElement('div');c.id='relCard';c.setAttribute('role','dialog');c.setAttribute('aria-label','Relationship');
   c.innerHTML=`<div class="rbox"><div class="rh"><b>Relationship</b><button type="button" id="relX" aria-label="Close">✕</button></div>
   <div class="rf"><div class="rcol"><label for="relA">Focal</label><input id="relA" autocomplete="off" placeholder="Type a name"><ul id="relAL" class="rl" role="listbox"></ul>
   <label for="relB">Relative</label><input id="relB" autocomplete="off" placeholder="Type a name"><ul id="relBL" class="rl" role="listbox"></ul></div>
   <button type="button" id="relSwap" aria-label="Swap focal and relative" title="Swap"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/></svg></button></div>
   <div id="relOut" aria-live="polite"></div></div>`;document.body.appendChild(c);
   $('relX').onclick=close;c.addEventListener('click',e=>{if(e.target===c)close()});
   $('relSwap').onclick=()=>{[sel.a,sel.b]=[sel.b,sel.a];const A=$('relA').value;$('relA').value=$('relB').value;$('relB').value=A;show()}}
  c.classList.add('on');$('relOut').innerHTML='<p class="rt">Loading the trees…</p>';await graph();field('A');field('B');show();setTimeout(()=>$('relA').focus(),50)}
 function close(){const c=$('relCard');if(c)c.classList.remove('on')}
 addEventListener('keydown',e=>{if(e.key==='Escape'&&$('relCard')&&$('relCard').classList.contains('on'))close()});
 window.RELOPEN=open;window.RELANSWER=async(a,b)=>{await graph();return answer(G.C(a),G.C(b))};   // for tests
 // the side panel link — Hanh: "move the link above the clear focal"
 const put=()=>{const before=$('pClear');if(!before||$('pRel'))return !!$('pRel');const it=document.createElement('button');it.type='button';it.className='item';it.id='pRel';
  it.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M6 8.6v3.4a3 3 0 0 0 3 3h6a3 3 0 0 1 3 3"/></svg><span class="grow">Relationship<span class="sub">How two people are related</span></span>';
  it.onclick=open;before.before(it);return true};
 if(!put()){const iv=setInterval(()=>{if(put())clearInterval(iv)},400)}
 const st=document.createElement('style');st.textContent=`#relCard{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.55);display:none;align-items:flex-start;justify-content:center;padding:max(16px,env(safe-area-inset-top)) 12px 16px;overflow:auto}#relCard.on{display:flex}
#relCard .rbox{width:min(560px,100%);margin-top:6vh;background:#232323;border:1px solid #444;border-radius:14px;color:#f1ece4;padding:14px 16px 16px;box-shadow:0 16px 40px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:12px;font-size:15px}
#relCard .rh{display:flex;align-items:center}#relCard .rh b{font-size:18px}#relX{all:unset;cursor:pointer;margin-left:auto;width:30px;height:30px;display:grid;place-items:center;border-radius:50%;color:#c9c2b6}#relX:hover{background:#3a3a3a}
#relCard .rf{display:flex;gap:10px;align-items:center}#relCard .rcol{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;position:relative}
#relCard label{font-size:12px;color:#9a948a;letter-spacing:.06em;text-transform:uppercase;margin-top:4px}
#relCard input{font:inherit;color:#f1ece4;background:#161616;border:1px solid #4a4a4a;border-radius:8px;padding:9px 10px}#relCard input:focus{outline:2px solid #F0BC4F;outline-offset:1px}
#relSwap{all:unset;cursor:pointer;width:42px;height:42px;display:grid;place-items:center;border-radius:50%;border:1px solid #555;color:#F0BC4F;margin-top:16px;transition:transform .3s}#relSwap:hover{background:#333}#relSwap:active{transform:rotate(180deg)}#relSwap:focus-visible{outline:2px solid #F0BC4F}
#relCard .rl{list-style:none;margin:0;padding:0;border-radius:8px;background:#2c2c2c;max-height:240px;overflow:auto}#relCard .rl:empty{display:none}
#relCard .rl li{padding:6px 10px;cursor:pointer;display:flex;flex-direction:row;align-items:center;gap:10px}#relCard .rl li:hover{background:#3a3a3a}#relCard .rl li small{color:#9a948a;font-size:12px}#relCard .rl li.none{color:#9a948a;cursor:default}
#relOut{display:flex;flex-direction:column;gap:10px;border-top:1px solid #3a3a3a;padding-top:12px}#relOut .rs{margin:0;line-height:1.5}#relOut .rt{margin:0;color:#9a948a;font-size:13px}
#relOut .rc{background:#D9A521;color:#161616;font-weight:700;border-radius:5px;padding:0 6px;margin-right:6px}#relOut .rs .rc{margin-right:0}#relOut .rc.o{background:none;color:#D9A521;border:1.5px dashed #D9A521}
#relOut .rpath{list-style:none;margin:0;padding:8px 10px;background:#1b1b1b;border-radius:10px;display:flex;flex-direction:column;gap:4px}#relOut .rpath li{display:flex;align-items:center;gap:6px;flex-wrap:wrap;min-height:40px}.ra{width:34px;height:34px;border-radius:6px;object-fit:cover;flex:none;background:#2a2a2a}.ra.none{display:inline-grid;place-items:center;color:#777;font-size:14px}#relCard .rl li .ra{width:30px;height:30px}
#relOut .ar{width:18px;text-align:center;color:#F0BC4F}#relOut .lk{color:#9a948a;font-size:13px}#relOut small{color:#9a948a}#relOut .also{border-top:1px dashed #444;padding-top:10px;display:flex;flex-direction:column;gap:8px}`;
 document.head.appendChild(st);
})();
