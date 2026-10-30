/* ================= Entry 211: the focal follows you between trees; titles through shared people =================
   Hanh: "If I pick myself as the focal — and I pick another tree that has a link via my aunts and uncles — I want see
   their titles too" (Hạnh's Paternal Grandpa tree → Sơn's (Trung/Văn) tree). Answers: always, until Clear focal; a top
   pill "Titles for Hạnh · through O Văn ✕"; Trung's side by AGE ("we call Dượng Trung's brothers and sisters Anh/Chị")
   — from a new birth month / year; the same gold chip.
   · Picking a focal saves (this browser) who it is (shared id), their titles for everyone in that tree, each person's
     generation from them, and their birth month / year.
   · Another tree: the same person there → they are the focal again. Not there, but people they share are → titles
     through them: a shared person keeps the title from the focal's tree (Dượng Trung, O Văn, Em Sơn …); anyone else by
     generation and age: two or more generations up → Ông / Bà; otherwise older than the focal → Anh / Chị, younger →
     Em (Cháu a generation or more down); no birth year on either → no title yet.
   · Clear focal (or ✕ on the pill) forgets it. */
(function(){
 const KEY='hft-focal-x',$=i=>document.getElementById(i);
 const rd=()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}},wr=v=>{try{v?localStorage.setItem(KEY,JSON.stringify(v)):localStorage.removeItem(KEY)}catch(e){}};
 const pid=c=>window.PID?window.PID(c):c,HERE=()=>(MINH.DB&&MINH.DB.link)||MINH.LINK||'';
 const dep=c=>c&&c.d?c.d.depth:0;
 let ready=false,cleared=false;
 window.FOCALSAVE=function(){if(!ready)return;
  if(!FOCAL){window._fsv=null;if(cleared){wr(null);cleared=false;off()}return}
  if(window._fsv===FOCAL.cell+'|'+HERE())return;window._fsv=FOCAL.cell+'|'+HERE();   // once per focal
  off();const v=FOCAL,titles={},gen={},bl={};
  Object.values(CP).forEach(c=>{const id=pid(c.cell);gen[id]=dep(c)-dep(v);if(c.i===0)bl[id]=1;if(c!==v)titles[id]=titleOf(v.cell,c.cell)||''});
  const p=(MINH.DB.people||{})[v.cell]||{};
  wr({id:pid(v.cell),cell:v.cell,nm:v.nm.replace(/ \(.*\)$/,''),from:HERE(),titles,gen,bl,by:+p.by||null,bm:+p.bm||null})};
 function redraw(){try{labels()}catch(e){}try{paneSync()}catch(e){}dispatchEvent(new Event('resize'))}
 window.XTCLEAR=()=>{wr(null);off()};   /* Entry 216: Clear focal while titles come through shared people */
 function off(){const pl=$('xtPill');if(!window.XT&&!pl)return;window.XT=null;window.XTNM=null;if(pl)pl.remove();redraw()}
 function age(s){return s&&s.by?(+s.by)*12+((+s.bm||7)-1):null}
 function bridge(s){const sh=Object.values(CP).filter(c=>{const id=pid(c.cell);return id in s.titles&&id!==s.id});if(!sh.length)return null;
  // the closest blood relative the focal shares with this tree names the pill (highest generation first)
  const ttl=sh.filter(c=>s.titles[pid(c.cell)]);const pick=(ttl.length?ttl:sh).slice().sort((a,b)=>((s.bl||{})[pid(b.cell)]?1:0)-((s.bl||{})[pid(a.cell)]?1:0)||(s.gen[pid(a.cell)]-s.gen[pid(b.cell)]))[0];   // blood relatives in the focal's tree first (O Văn before Dượng Trung)
  return {b:pick,fd:dep(pick)-s.gen[pid(pick.cell)]}}
 function on(s){const br=bridge(s);if(!br)return false;const me=age(s);window.XTNM=s.nm;
  window.XT=cell=>{const c=CP[cell];if(!c)return '';const id=pid(cell);if(id in s.titles)return s.titles[id];
   const g=dep(c)-br.fd;if(g<=-2)return c.g==='F'?'Bà':'Ông';
   const a=age((MINH.DB.people||{})[cell]);if(a==null||me==null||a===me)return '';
   return a<me?(c.g==='F'?'Chị':'Anh'):(g>=1?'Cháu':'Em')};
  const t=s.titles[pid(br.b.cell)];
  const pl=document.createElement('div');pl.id='xtPill';pl.setAttribute('role','status');
  pl.innerHTML=`<span>Titles for <b></b>${t?' · through <i></i>':''}</span><button type="button" aria-label="Stop showing these titles">✕</button>`;
  pl.querySelector('b').textContent=s.nm;if(t)pl.querySelector('i').textContent=t+' '+br.b.nm.replace(/ \(.*\)$/,'');
  pl.querySelector('button').onclick=()=>{wr(null);off()};const h=$('hdr');(h||document.body).appendChild(pl);redraw();return true}   /* in the header, where "Focused on …" sits */
 // Entry 212 (Hanh: "I expected to see my relation with Bác Thương and Phúc … also O Văn and Dượng Trung"): the focal is
 // often in several trees (Hạnh: his Grandpa's tree, his Grandma's tree, his Maternal tree …). Titles come from EVERY
 // tree they are in — the tree they were picked in first, then the others fill in whoever it doesn't have.
 const ids=n=>[...n.k,...(n.c||[]).flatMap(ids)];
 function kinOf(T,me){const P=T.people,nm=id=>{const p=P[id]||{};return (p.first||'??')+(p.alt?' ('+p.alt+')':'')};
  const cv=n=>({n:n.k.map(nm),g:n.k.map(id=>(P[id]||{}).g||'?').join(''),k:n.k.slice(),c:(n.c||[]).map(cv),...(n.m?{m:n.m}:{})});
  const K=buildKin(cv(T.root)),ix={};K.cells.forEach((c,i)=>ix[c]=i);const row=K.M[me];if(!row)return null;
  const D={},B={},S={};(function w(n,d){n.k.forEach((id,i)=>{D[id]=d;if(i===0)B[id]=1;S[id]=n});(n.c||[]).forEach(c=>w(c,d+1))})(T.root,0);
  const t={},g={},bl={};K.cells.forEach(id=>{if(id===me)return;let u=K.titles[row[ix[id]]]||'';
   if(!B[me]&&S[id]===S[me]&&B[id])u=(P[id]||{}).g==='F'?'Vợ':(P[id]||{}).g==='M'?'Chồng':'';   // as titleOf: someone who married in sees their spouse
   u=u.replace(/(^| )Thím$/,'$1Thím/Mự');if(typeof CENTRAL!=='undefined'&&!CENTRAL)u=u.replace(/(^| )O$/,'$1Cô');
   u=u.replace(/(^|[ /])(\p{Ll})/gu,(m,a,b)=>a+b.toUpperCase());t[id]=u;g[id]=D[id]-D[me];if(B[id])bl[id]=1});
  return {t,g,bl}}
 async function more(s){if(!window.XTREES)return s;let L=[];try{L=await window.XTREES()}catch(e){return s}
  const G=window.XGROUPS||[],out=JSON.parse(JSON.stringify(s));out.bl=out.bl||{};let n=0;
  for(const T of L){if(T.link===s.from||!T.root)continue;let me=T.people[s.id]?s.id:null;
   if(!me&&s.cell!=null){const gp=G.find(x=>s.from in x&&String(x[s.from])===String(s.cell));if(gp&&gp[T.link]!=null){const l=T.link==='hanh-paternal'&&window.XHP?window.XHP(gp[T.link]):gp[T.link];if(T.people[l])me=l}}
   if(!me||!ids(T.root).includes(me))continue;const K=kinOf(T,me);if(!K)continue;n++;
   Object.entries(K.t).forEach(([id,t])=>{if(!(id in out.titles)||(!out.titles[id]&&t)){out.titles[id]=t;out.gen[id]=K.g[id];if(K.bl[id])out.bl[id]=1}})}
  out._n=n;return out}
 function boot(){if(typeof CP==='undefined'||typeof FOCAL==='undefined'||typeof paintFocal!=='function'||!MINH.DB){setTimeout(boot,150);return}
  ready=true;const c=$('pClear');if(c)c.addEventListener('click',()=>{cleared=true},true);
  const s=rd();if(!s||FOCAL){if(FOCAL)window.FOCALSAVE();return}
  const me=Object.values(CP).find(c=>pid(c.cell)===s.id||c.cell===s.id);
  if(me){FOCAL=me;paintFocal();try{nav();hint()}catch(e){}redraw();return}
  on(s);
  // then the focal's other trees (Entry 212) — redrawn with the fuller set
  more(s).then(m=>{if(FOCAL||!rd()||!m._n)return;off();window.XT=null;on(m)})}
 setTimeout(boot,300);
 const st=document.createElement('style');st.textContent='#xtPill{display:inline-flex;align-items:center;gap:6px;padding:3px 4px 3px 12px;border-radius:999px;background:#2a2414;border:1.5px solid var(--gold,#F0BC4F);color:#f1ece4;font-size:13px}#xtPill b{color:var(--gold,#F0BC4F);font-weight:600}#xtPill i{font-style:normal;color:var(--gold,#F0BC4F)}#xtPill button{all:unset;cursor:pointer;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:#c9c2b6;font-size:12px}#xtPill button:hover{background:#3a3220;color:#fff}@media (max-width:820px){#xtPill{font-size:12.5px;margin-top:4px}}';document.head.appendChild(st);
})();
