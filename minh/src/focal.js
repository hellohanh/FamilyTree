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
  wr({id:pid(v.cell),nm:v.nm.replace(/ \(.*\)$/,''),from:HERE(),titles,gen,bl,by:+p.by||null,bm:+p.bm||null})};
 function redraw(){try{labels()}catch(e){}try{paneSync()}catch(e){}dispatchEvent(new Event('resize'))}
 function off(){if(!window.XT)return;window.XT=null;const pl=$('xtPill');if(pl)pl.remove();redraw()}
 function age(s){return s&&s.by?(+s.by)*12+((+s.bm||7)-1):null}
 function bridge(s){const sh=Object.values(CP).filter(c=>{const id=pid(c.cell);return id in s.titles&&id!==s.id});if(!sh.length)return null;
  // the closest blood relative the focal shares with this tree names the pill (highest generation first)
  const ttl=sh.filter(c=>s.titles[pid(c.cell)]);const pick=(ttl.length?ttl:sh).slice().sort((a,b)=>((s.bl||{})[pid(b.cell)]?1:0)-((s.bl||{})[pid(a.cell)]?1:0)||(s.gen[pid(a.cell)]-s.gen[pid(b.cell)]))[0];   // blood relatives in the focal's tree first (O Văn before Dượng Trung)
  return {b:pick,fd:dep(pick)-s.gen[pid(pick.cell)]}}
 function on(s){const br=bridge(s);if(!br)return false;const me=age(s);
  window.XT=cell=>{const c=CP[cell];if(!c)return '';const id=pid(cell);if(id in s.titles)return s.titles[id];
   const g=dep(c)-br.fd;if(g<=-2)return c.g==='F'?'Bà':'Ông';
   const a=age((MINH.DB.people||{})[cell]);if(a==null||me==null||a===me)return '';
   return a<me?(c.g==='F'?'Chị':'Anh'):(g>=1?'Cháu':'Em')};
  const t=s.titles[pid(br.b.cell)];
  const pl=document.createElement('div');pl.id='xtPill';pl.setAttribute('role','status');
  pl.innerHTML=`<span>Titles for <b></b>${t?' · through <i></i>':''}</span><button type="button" aria-label="Stop showing these titles">✕</button>`;
  pl.querySelector('b').textContent=s.nm;if(t)pl.querySelector('i').textContent=t+' '+br.b.nm.replace(/ \(.*\)$/,'');
  pl.querySelector('button').onclick=()=>{wr(null);off()};const h=$('hdr');(h||document.body).appendChild(pl);redraw();return true}   /* in the header, where "Focused on …" sits */
 function boot(){if(typeof CP==='undefined'||typeof FOCAL==='undefined'||typeof paintFocal!=='function'||!MINH.DB){setTimeout(boot,150);return}
  ready=true;const c=$('pClear');if(c)c.addEventListener('click',()=>{cleared=true},true);
  const s=rd();if(!s||FOCAL){if(FOCAL)window.FOCALSAVE();return}
  const me=Object.values(CP).find(c=>pid(c.cell)===s.id||c.cell===s.id);
  if(me){FOCAL=me;paintFocal();try{nav();hint()}catch(e){}redraw();return}
  on(s)}
 setTimeout(boot,300);
 const st=document.createElement('style');st.textContent='#xtPill{display:inline-flex;align-items:center;gap:6px;padding:3px 4px 3px 12px;border-radius:999px;background:#2a2414;border:1.5px solid var(--gold,#F0BC4F);color:#f1ece4;font-size:13px}#xtPill b{color:var(--gold,#F0BC4F);font-weight:600}#xtPill i{font-style:normal;color:var(--gold,#F0BC4F)}#xtPill button{all:unset;cursor:pointer;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:#c9c2b6;font-size:12px}#xtPill button:hover{background:#3a3220;color:#fff}@media (max-width:820px){#xtPill{font-size:12.5px;margin-top:4px}}';document.head.appendChild(st);
})();
