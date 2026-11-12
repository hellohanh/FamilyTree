/* ================= Entry 245: related to the focal two ways =================
   Hanh (Bảo, son of Thương & Phúc, as the focal): "What would he call Phưởng (wife of Lâm) since he's related to both
   sides of the family there" — through his mother Phúc she is her younger sister (Dì Phưởng, Dượng Lâm); through his
   father Thương, Lâm is his second cousin, senior branch (Bác Lâm, Bác Phưởng). Each tree only sees one of the two
   ties, so the title depended on which tree he was picked in. Hanh chose (Option 3): the closer tie by default, an
   Options switch "Related both ways: Closer / Father's / Mother's", and a dashed "+Bác" chip for the other tie — tap
   it for both paths.
   · The focal's titles come from EVERY tree they are in (as a blood relative there): each tree says which parent the
     tie runs through (that tree's parent couple, the blood one listed first) and how far it is (steps up to the
     shared ancestor + steps down; someone who married in counts as their partner).
   · Someone with different titles through Ba and through Má is "related both ways". Closer = fewer steps (a tie keeps
     the tree's own title); Father's / Mother's = that side. The switch shows only when the focal has someone like that.
   · Remembered on this device (like Miền Trung). Both pages; also when titles come through shared people (focal.js). */
(function(){
 const $=i=>document.getElementById(i),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const pid=c=>window.PID?window.PID(c):c,HERE=()=>(MINH.DB&&MINH.DB.link)||MINH.LINK||'';
 const ids=n=>[...n.k,...(n.c||[]).flatMap(ids)];
 let MODE='closer';try{MODE=localStorage.getItem('hft-both')||'closer'}catch(e){}
 if(!['closer','father','mother'].includes(MODE))MODE='closer';
 let B=null,KEY='',RUN=0;   // B = {id, nm, map:{id:{father:{t,d,via,tree},mother:{…}}}}
 const nmOf=(P,id)=>{const p=P[id]||{};return (p.first||'??')+(p.alt?' ('+p.alt+')':'')};
 // titles for `me` in tree T, as the pages word them (same as focal.js kinOf)
 function titles(T,me){const P=T.people,cv=n=>({n:n.k.map(id=>nmOf(P,id)),g:n.k.map(id=>(P[id]||{}).g||'?').join(''),k:n.k.slice(),c:(n.c||[]).map(cv),...(n.m?{m:n.m}:{})});
  const K=buildKin(cv(T.root)),ix={};K.cells.forEach((c,i)=>ix[c]=i);const row=K.M[me];if(!row)return null;
  const S={};(function w(n){n.k.forEach(id=>S[id]=n);(n.c||[]).forEach(w)})(T.root);
  const t={};K.cells.forEach(id=>{if(id===me)return;let u=K.titles[row[ix[id]]]||'';
   if(S[id]===S[me]&&S[me].k[0]!==me&&S[id].k[0]===id)u=(P[id]||{}).g==='F'?'Vợ':(P[id]||{}).g==='M'?'Chồng':'';
   u=u.replace(/(^| )Thím$/,'$1Thím/Mự');if(typeof CENTRAL!=='undefined'&&!CENTRAL)u=u.replace(/(^| )O$/,'$1Cô');
   t[id]=u.replace(/(^|[ /])(\p{Ll})/gu,(m,a,b)=>a+b.toUpperCase())});
  return t}
 // which parent the focal's ties run through in T, and how far each person is
 function paths(T,me){const par=new Map(),dep=new Map(),at={};
  (function w(n,p,d){par.set(n,p);dep.set(n,d);n.k.forEach(id=>at[id]=n);(n.c||[]).forEach(c=>w(c,n,d+1))})(T.root,null,0);
  const mn=at[me];if(!mn||mn.k[0]!==me)return null;   // married in here: this tree's titles come through the spouse
  const pn=par.get(mn);if(!pn)return null;const g=(T.people[pn.k[0]]||{}).g;if(g!=='M'&&g!=='F')return null;
  const up=new Map();for(let n=mn,s=0;n;n=par.get(n),s++)up.set(n,s);
  const far=id=>{let n=at[id],s=0;while(n&&!up.has(n)){n=par.get(n);s++}return n?up.get(n)+s:99};
  return {side:g==='M'?'father':'mother',via:nmOf(T.people,pn.k[0]),far}}
 async function run(){const id=key();if(id===KEY)return;KEY=id;const my=++RUN;B=null;paint();if(!id)return;
  let L=[];try{L=window.XTREES?await window.XTREES():[]}catch(e){}if(my!==RUN)return;
  const cv=n=>({k:n.k.map(pid),c:(n.c||[]).map(cv),...(n.m?{m:pid(n.m)}:{})}),P0=MINH.DB.people||{},cp={};Object.keys(P0).forEach(k=>cp[pid(k)]=P0[k]);
  const all=[{link:HERE(),name:(MINH.DB&&MINH.DB.name)||document.title,root:cv(MINH.DB.root),people:cp},...L.filter(T=>T.root&&T.link!==HERE())];
  const map={};let nm='';
  all.forEach(T=>{if(!ids(T.root).includes(id))return;const pa=paths(T,id);if(!pa)return;const tt=titles(T,id);if(!tt)return;nm=nm||nmOf(T.people,id).replace(/ \(.*\)$/,'');
   Object.entries(tt).forEach(([x,t])=>{if(!t||/^(Vợ|Chồng)$/.test(t))return;const e=(map[x]=map[x]||{}),d=pa.far(x);
    if(!e[pa.side]||d<e[pa.side].d)e[pa.side]={t,d,via:pa.via,tree:T.name||T.link,nm:nmOf(T.people,x)}})});
  Object.keys(map).forEach(x=>{const e=map[x];if(!(e.father&&e.mother&&e.father.t!==e.mother.t))delete map[x]});
  B={id,nm,map};paint()}
 function key(){if(typeof FOCAL!=='undefined'&&FOCAL)return pid(FOCAL.cell);if(window.XT){try{const s=JSON.parse(sessionStorage.getItem('hft-focal-x'));return s&&s.id||''}catch(e){}}return ''}
 // which title to show, and the other one
 function choose(e,u){const f=e.father,m=e.mother;let a;
  if(MODE==='father')a=f;else if(MODE==='mother')a=m;else a=f.d<m.d?f:m.d<f.d?m:(u===m.t?m:f);
  return [a,a===f?m:f]}
 window.BOTHT=(viewer,cell,u)=>{if(!B||!cell)return u;if(viewer!=null&&pid(viewer)!==B.id)return u;const e=B.map[pid(cell)];if(!e)return u;
  const rest=String(u||'').split('|').slice(1).filter(x=>!/^\+/.test(x)),[a,o]=choose(e,String(u||'').split('|')[0]);
  return [a.t,'+'+o.t+'~'+cell,...rest].join('|')};
 // tap a "+…" chip: both paths
 window.BOTHPOP=(cell,ev)=>{const e=B&&B.map[pid(cell)];if(!e)return;const [a]=choose(e,'');let p=$('bothPop');if(!p){p=document.createElement('div');p.id='bothPop';p.setAttribute('role','dialog');document.body.appendChild(p)}
  const row=(s,lab)=>{const x=e[s];return `<div class="br"><span class="${x===a?'c':'c o'}">${esc(x.t)}</span><span>through ${lab} <b>${esc(x.via)}</b><small>${esc(x.tree)}${x===a?' · shown':''}</small></span></div>`};
  p.innerHTML=`<div class="bh"><b>${esc(e.father.nm.replace(/ \(.*\)$/,''))}</b> is family to ${esc(B.nm)} two ways<button type="button" aria-label="Close">✕</button></div>${(a===e.father?[['father','Ba'],['mother','Má']]:[['mother','Má'],['father','Ba']]).map(([s,l])=>row(s,l)).join('')}<div class="bf">${MODE==='closer'?'The closer tie is shown.':'Showing '+(MODE==='father'?"Father's":"Mother's")+' side.'} Change it in Options → Related both ways.</div>`;
  p.querySelector('button').onclick=()=>p.remove();
  const X=(ev&&ev.clientX)||innerWidth/2,Y=(ev&&ev.clientY)||innerHeight/2;p.style.left=Math.max(8,Math.min(innerWidth-p.offsetWidth-8,X-p.offsetWidth/2))+'px';p.style.top=Math.min(innerHeight-p.offsetHeight-8,Y+14)+'px'};
 addEventListener('pointerdown',ev=>{const p=$('bothPop');if(p&&!p.contains(ev.target))p.remove()},true);
 addEventListener('keydown',ev=>{if(ev.key==='Escape'){const p=$('bothPop');if(p)p.remove()}});
 // Options: "Related both ways" — only while the focal has someone related two ways
 function paint(){let r=$('pBoth');const n=B?Object.keys(B.map).length:0;
  if(!r){const c=$('pCentral');if(!c)return;r=document.createElement('div');r.id='pBoth';
   r.innerHTML=`<div class="bt">Related both ways<span class="sub" id="pBothSub"></span></div><div class="seg" role="group" aria-label="Related both ways">${[['closer','Closer'],['father',"Father's"],['mother',"Mother's"]].map(([m,l])=>`<button type="button" data-m="${m}">${l}</button>`).join('')}</div>`;
   c.insertAdjacentElement('afterend',r);
   r.querySelectorAll('button').forEach(b=>b.onclick=()=>{MODE=b.dataset.m;try{localStorage.setItem('hft-both',MODE)}catch(e){}paint();redraw()})}
  r.hidden=!n;r.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.m===MODE));
  const s=$('pBothSub');if(s)s.textContent=n?`${B.nm}: ${n} ${n===1?'person':'people'}`:'';redraw()}
 function redraw(){try{labels()}catch(e){}try{paneSync()}catch(e){}dispatchEvent(new Event('resize'))}
 setInterval(()=>{if(typeof MINH!=='undefined'&&MINH.DB&&typeof buildKin==='function')run()},600);
 const st=document.createElement('style');st.textContent=`#pBoth{padding:8px 10px 10px;display:flex;flex-direction:column;gap:7px}#pBoth[hidden]{display:none}#pBoth .bt{font-size:14.5px;color:var(--ink,#f1ece4);line-height:1.2}#pBoth .sub{display:block;font-size:11.5px;color:var(--muted,#9a948a);margin-top:1px}
#pBoth .seg{display:flex;border:1px solid #444;border-radius:8px;overflow:hidden}#pBoth .seg button{all:unset;cursor:pointer;flex:1;text-align:center;padding:6px 2px;font-size:12.5px;color:#c9c2b6}#pBoth .seg button+button{border-left:1px solid #444}#pBoth .seg button[aria-pressed="true"]{background:var(--gold,#F0BC4F);color:#161616;font-weight:600}#pBoth .seg button:focus-visible{outline:2px solid var(--gold,#F0BC4F);outline-offset:-2px}
#bothPop{position:fixed;z-index:9999;max-width:min(380px,calc(100vw - 16px));background:#262626;border:1px solid #555;border-radius:12px;padding:12px 14px;color:#f1ece4;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:9px}
#bothPop .bh{display:flex;gap:8px;align-items:flex-start;color:#c9c2b6}#bothPop .bh b{color:#f1ece4}#bothPop .bh button{all:unset;cursor:pointer;margin-left:auto;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;color:#c9c2b6}#bothPop .bh button:hover{background:#3a3a3a}
#bothPop .br{display:flex;gap:10px;align-items:flex-start}#bothPop .br small{display:block;color:#9a948a;font-size:12px}#bothPop .c{flex:none;background:#D9A521;color:#161616;font-weight:700;padding:1px 7px;border-radius:5px}#bothPop .c.o{background:none;color:#D9A521;border:1.5px dashed #D9A521}#bothPop .bf{color:#9a948a;font-size:12.5px}`;
 document.head.appendChild(st);
})();
