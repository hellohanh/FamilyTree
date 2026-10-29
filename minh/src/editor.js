/* ================= Minh's editor (Entry 126) ================= */
// v1's pencil (yellow with a red eraser, Entry 17) on every card in Simple, Side and Top; it opens the v1 editor
// restyled to v2 (locked): First / Middle / Last / Nickname, Has passed, Male / Female (that couple's avatars);
// add a Spouse / Brother / Sister / Son / Daughter in birth order; yellow = required; accent suggestions on every
// name field from data/vn_names.txt. Save stores the tree (this browser, step 1) and redraws the same view.
const VN_GIVEN=__VN_GIVEN__,VN_LAST=__VN_LAST__,LINK=__LINK__;
window.PEN=function(g,x,cy,size,q){const s=size/24,p=g.append('g').attr('class','pencil').attr('transform',`translate(${x},${cy-size/2}) scale(${s})`).style('cursor','pointer')
  .on('click',e=>{e.stopPropagation();window.EDIT(q)}).on('pointerdown',e=>e.stopPropagation());
 p.append('title').text('Edit '+q.nm);
 p.append('rect').attr('x',-5).attr('y',-5).attr('width',34).attr('height',34).attr('rx',6).attr('fill','transparent');
 const r=p.append('g').attr('transform','rotate(45 12 12)');
 r.append('rect').attr('x',9).attr('y',0).attr('width',6).attr('height',4).attr('rx',1.2).attr('fill','#fa4d56');
 r.append('rect').attr('x',9).attr('y',4).attr('width',6).attr('height',2.2).attr('fill','#a8a8a8');
 r.append('rect').attr('x',9).attr('y',6.2).attr('width',6).attr('height',11.8).attr('fill','#f1c21b');
 r.append('path').attr('d','M9 18 L15 18 L12 23.5 Z').attr('fill','#e8c39e');
 r.append('path').attr('d','M11 21.6 L13 21.6 L12 23.5 Z').attr('fill','#393939')};
(function(){
 const ov=$('edOv'),E={};let ED=null;
 const fold=t=>t.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[đĐ]/g,'d').toLowerCase();
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const av=(q,g)=>{const a=window.AVATAR({d:q?q.d:null,g});return a?`<img class="av sm" src="${a}" alt="">`:'<span class="av sm">?</span>'};
 const PP=id=>MINH.DB.people[id];
 // accent suggestions (locked): up to 6, accents ignored, đ = d, from the start of the name, exact match first
 document.querySelectorAll('#edOv input.fn').forEach(inp=>{const box=$(inp.id+'s');
  const show=()=>{const v=inp.value.trim(),f=fold(v);box.innerHTML='';if(!f)return;
   const L=inp.dataset.k==='last'?VN_LAST.map(n=>[n,'']):VN_GIVEN;
   const hits=L.filter(([n])=>fold(n).startsWith(f)&&n!==v).sort((a,b)=>(fold(a[0])===f?-1:0)-(fold(b[0])===f?-1:0)).slice(0,6);if(!hits.length)return;
   box.innerHTML='<span class="lb">Suggestions</span>'+hits.map(([n,m])=>`<button class="sg" type="button" data-n="${esc(n)}">${esc(n)}${m?` <span class="mn">(${esc(m)})</span>`:''}</button>`).join('');
   box.querySelectorAll('.sg').forEach(b=>b.onclick=()=>{inp.value=b.dataset.n;box.innerHTML='';render()})};
  inp.addEventListener('input',()=>{$('edErr').textContent='';show();render()});inp.addEventListener('blur',()=>setTimeout(()=>{if(!box.contains(document.activeElement))box.innerHTML=''},200))});
 const fullName=(L,M,F,A)=>[L,M,F].filter(Boolean).join(' ')+(A?` (${A})`:'');   // Vietnamese order: Last Middle First (v1 Entry 17)
 const openEd=function(q){const f=MINH.find(q.cell);if(!f)return;const p=PP(q.cell);
  ED={q,f,rel:'son',pos:null,eg:p.g||null,sg:null,par:null};
  $('eF').value=p.first||'';$('eM').value=p.middle||'';$('eL').value=p.last||'';$('eA').value=p.alt||'';$('eP').checked=!!p.dead;$('eAd').checked=!!p.adopted;
  $('eAdL').style.display=f.i===0&&f.parent?'':'none';   // Entry 148: children only (not someone who married in)
  if(window.GODFILL)window.GODFILL(p);
  // Entry 159: "Also in …" — the same person in another tree (linked in data/links.json)
  {const al=MINH.alsoIn?MINH.alsoIn(q.cell):[];$('eAlso').hidden=!al.length;
   $('eAlso').innerHTML=al.map(x=>`<a class="btn" href="./?tree=${encodeURIComponent(x.t)}&focus=${encodeURIComponent(x.id)}">Also in ${esc(x.name)} →</a>`).join('')}
  // Entry 155: Hanh's admin code — a person's picture can be taken off here (the drawing comes back)
  {const ph=typeof photoOf==='function'?photoOf(q):null,adm=MINH.isAdmin&&MINH.isAdmin()&&MINH.photoRemove;$('ePh').hidden=!(ph&&adm);
   if(ph&&adm){$('ePhI').src=ph.url;$('ePhS').textContent=ph.pending?'Waiting for your review':'Confirmed';$('ePhX').textContent='Remove picture';$('ePhX').style.pointerEvents='';
    $('ePhU').href=(MINH.EDITBASE==='editor/'&&location.pathname.indexOf('/editor/')<0?'':'../')+'photo/?person='+encodeURIComponent(window.PID?window.PID(q.cell):q.cell)}}   // Entry 155: Update → the picture page, at this person
  // Entry 152: Remove — a spouse any time (their children stay); a blood relative only with no spouse or children
  // under them; never the centre couple
  {const blood=f.i===0,ok=!!f.parent&&(!blood||(f.node.k.length===1&&!(f.node.c||[]).length));$('edRm').hidden=!f.parent&&blood;
   $('edRm').dataset.why=ok?'':'Remove their spouse and children first'}
  ['nF','nM','nL','nA'].forEach(i=>$(i).value='');$('nP').checked=false;$('nAd').checked=false;$('edErr').textContent='';
  document.querySelectorAll('#edOv .sug').forEach(b=>b.innerHTML='');
  if(f.i>0&&f.node.k.length>2)ED.par=q.cell;   // a second spouse adding a child: that child is theirs
  ov.classList.add('on');render();ov.querySelector('.mdl').scrollTop=0};
 // Entry 132: editing needs the code once per device — Supabase checks it; offline → no editing
 window.EDIT=q=>{if(MINH.offline){toast("Editing is off — can't reach the family database");return}
  if(MINH.code())openEd(q);else window.ASKCODE(()=>openEd(q))};
 const close=()=>{ov.classList.remove('on');ED=null};
 const allowed=r=>{const {f}=ED;if(r==='son'||r==='daughter')return true;if(f.i>0)return false;if(r==='brother'||r==='sister')return !!f.parent;return true};
 function items(){const {f,rel,q}=ED,n=f.node;
  if(rel==='spouse')return n.k.slice(1).map(id=>({id,sp:[]}));
  if(rel==='son'||rel==='daughter')return (n.c||[]).map(c=>({id:c.k[0],sp:c.k.slice(1)}));
  return (f.parent.c||[]).map(c=>({id:c.k[0],sp:c.k.slice(1),me:c===n}))}
 function render(){if(!ED)return;const {q,f}=ED,F=$('eF').value.trim();
  $('edAv').outerHTML=`<span class="av" id="edAv">${(()=>{const a=window.AVATAR({d:q.d,g:ED.eg});return a?`<img class="av" src="${a}" alt="" style="width:48px;height:48px">`:'?'})()}</span>`;
  $('edTitle').textContent=fullName($('eL').value.trim(),$('eM').value.trim(),F,$('eA').value.trim())||'—';
  $('eG').innerHTML=['M','F'].map(g=>`<button class="gbtn ${ED.eg===g?'sel':''}" data-g="${g}" type="button">${window.AVATAR({d:q.d,g})?`<img src="${window.AVATAR({d:q.d,g})}" alt="">`:''}${g==='M'?'Male':'Female'}</button>`).join('');
  $('eG').querySelectorAll('.gbtn').forEach(b=>b.onclick=()=>{ED.eg=b.dataset.g;render()});
  $('edAdd').textContent='Add to '+(F||'??')+"'s family";
  if(!allowed(ED.rel))ED.rel='son';
  const R=[['spouse','Spouse'],['brother','Brother'],['sister','Sister'],['son','Son'],['daughter','Daughter']];
  $('edRels').innerHTML=R.map(([k,l])=>`<button class="rel ${k===ED.rel?'sel':''}" data-r="${k}" type="button" ${allowed(k)?'':'disabled title="'+(f.i>0?"Their own family isn't in this tree":'No parents in this tree')+'"'}>${l}</button>`).join('');
  $('edRels').querySelectorAll('.rel').forEach(b=>b.onclick=()=>{if(b.disabled)return;ED.rel=b.dataset.r;ED.pos=null;render()});
  const it=items(),r=ED.rel;if(ED.pos===null||ED.pos>it.length)ED.pos=it.length;
  $('edHint').textContent=r==='spouse'?'Current spouse(s). A new spouse is added after them':(r==='son'||r==='daughter')?'Children, oldest first. Drag the new row into birth order':'Siblings, oldest first. Drag the new row into birth order';
  const g=r==='brother'||r==='son'?'M':r==='sister'||r==='daughter'?'F':ED.sg,nn=$('nF').value.trim()||'New person';
  const ttl=id=>{const t=titleOf(q.cell,id);return t?t.split('|').map((x,i)=>`<span class="chip"${i?' style="background:#d1452b;color:#fff"':''}>${esc(x)}</span>`).join(''):''};
  const newT=r==='son'||r==='daughter'?`<span class="chip">${$('nAd').checked?'Con Nuôi':'Con'}</span>`:'';
  const newRow=`<div class="card new" draggable="true" id="edNR"><span class="grip">⠿</span>${g?av(null,g):'<span class="av sm">?</span>'}${newT}<span>${esc(nn)}</span><span class="mv"><button id="edUp" type="button" aria-label="Move up">↑</button><button id="edDn" type="button" aria-label="Move down">↓</button></span></div>`;
  let h='',k=1;
  it.forEach((x,i)=>{if(i===ED.pos)h+=`<div class="li"><span class="ord">${k++}</span>${newRow}</div>`;
   const X=CP[x.id];h+=`<div class="li" data-i="${i}"><span class="ord">${k++}</span><div class="card ${x.me?'me':''}">${av(X,PP(x.id).g)}${x.me?'':ttl(x.id)}<span>${esc(MINH.disp(PP(x.id)))}</span>${x.sp.length?`<span class="sp">&amp; ${x.sp.map(s=>esc(MINH.disp(PP(s)))).join(', ')}</span>`:''}${x.me?'<span class="sp" style="margin-left:auto;color:var(--gold)">this card</span>':''}</div></div>`});
  if(ED.pos>=it.length)h+=`<div class="li"><span class="ord">${k}</span>${newRow}</div>`;
  $('edList').innerHTML=h;
  $('edUp').onclick=()=>{if(ED.pos>0){ED.pos--;render()}};$('edDn').onclick=()=>{if(ED.pos<it.length){ED.pos++;render()}};
  $('edNR').ondragstart=e=>e.dataTransfer.setData('text/plain','n');
  $('edList').querySelectorAll('[data-i]').forEach(el=>{el.ondragover=e=>e.preventDefault();el.ondrop=e=>{e.preventDefault();const i=+el.dataset.i,rc=el.getBoundingClientRect();let p=e.clientY<rc.top+rc.height/2?i:i+1;if(p>ED.pos)p--;ED.pos=Math.max(0,Math.min(it.length,p));render()}});
  // a new spouse: Male / Female is required (Son / Daughter / Brother / Sister set it)
  $('nG').style.display=r==='spouse'?'inline-flex':'none';$('nAdL').style.display=r==='spouse'?'none':'';
  $('nG').innerHTML='<span class="lb">Spouse is</span>'+['M','F'].map(g=>`<button class="gbtn ${ED.sg===g?'sel':''}" data-g="${g}" type="button">${window.AVATAR({d:q.d,g})?`<img src="${window.AVATAR({d:q.d,g})}" alt="">`:''}${g==='M'?'Male':'Female'}</button>`).join('');
  $('nG').querySelectorAll('.gbtn').forEach(b=>b.onclick=()=>{ED.sg=b.dataset.g;render()});
  // a child of someone with two or more spouses: which one is the other parent (required)
  const sps=f.node.k.slice(1),needPar=(r==='son'||r==='daughter')&&sps.length>1;
  $('nPar').style.display=needPar?'inline-flex':'none';
  $('nPar').innerHTML='<span class="lb">Other parent</span>'+sps.map(id=>`<button class="gbtn ${ED.par===id?'sel':''}" data-p="${id}" type="button">${esc(MINH.disp(PP(id)))}</button>`).join('');
  $('nPar').querySelectorAll('.gbtn').forEach(b=>b.onclick=()=>{ED.par=b.dataset.p;render()})}
 $('nAd').addEventListener('change',()=>render());
 // Entry 149: godparents — a name box per ticked kind, with the same search as Options across every tree
 // (this page's people + the trees in the family database); any name can also be kept as typed
 const GP={idx:null,load:null};
 const gfold=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase(),gbare=t=>t.replace(/^(Ông|Bà) /,'').replace(/ \(.*\)$/,'');
 function gwho(n,i,par){if(i>0)return (n.g[i]==='F'?'vợ':n.g[i]==='M'?'chồng':'vợ/chồng')+' của '+gbare(n.n[0]);if(!par)return '';
  const mi=n.m?par.k.indexOf(n.m):(par.n.length===2?1:-1),ix=[0,mi].filter(x=>x>=0),same=ix.length>1&&gbare(par.n[ix[0]])===gbare(par.n[ix[1]]);
  const two=ix.map(x=>({nm:same?par.n[x].replace(/ \(.*\)$/,''):gbare(par.n[x]),g:par.g[x]}));two.sort((a,b)=>(a.g==='M'?0:1)-(b.g==='M'?0:1));return 'con của '+two.map(x=>x.nm).join(' & ')}
 function gadd(root,tree,idOf,L){(function w(n,par){n.n.forEach((nm,i)=>{if(window.isINC(nm))return;const id=idOf(n.k[i]),x=L.get(id);if(x){if(!x.trees.includes(tree))x.trees.push(tree);return}
   L.set(id,{id,nm:nm.replace(/^(Ông|Bà) /,''),g:n.g[i],w:gwho(n,i,par),trees:[tree]})});(n.c||[]).forEach(c=>w(c,n))})(root,null)}
 function gindex(){if(GP.load)return GP.load;const L=new Map(),here=(document.querySelector('#hdr h1 small')||{}).textContent||'This tree';
  gadd(T,here,id=>window.PID?window.PID(id):id,L);GP.idx=[...L.values()];
  const SB='https://quqgwvwijvwshdpwvkrk.supabase.co',KEY='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV',H={apikey:KEY,Authorization:'Bearer '+KEY};
  const get=async u=>{const r=await fetch(SB+'/rest/v1/'+u,{headers:H});if(!r.ok)throw new Error(r.status);return r.json()};
  GP.load=(async()=>{try{const trees=await get('trees?select=link,name,doc&order=created_at'),need=new Set(),ids=n=>[...n.k,...(n.c||[]).flatMap(ids)];
    trees.forEach(t=>ids(t.doc).forEach(i=>need.add(i)));const all=[...need],pp={};for(let i=0;i<all.length;i+=80)(await get('people?select=id,data&id=in.('+all.slice(i,i+80).map(encodeURIComponent).join(',')+')')).forEach(p=>pp[p.id]=p.data);
    const dp=p=>p?((p.first||'??')+(p.alt?' ('+p.alt+')':'')):'??',cv=n=>({n:n.k.map(id=>dp(pp[id])),g:n.k.map(id=>(pp[id]||{}).g||'?').join(''),k:n.k.slice(),c:(n.c||[]).map(cv),...(n.m?{m:n.m}:{})});
    trees.forEach(t=>{if(MINH.DB&&MINH.DB.link===t.link)return;gadd(cv(t.doc),t.name||'Unnamed tree',id=>id,L)})}catch(e){}GP.idx=[...L.values()];return GP.idx})();return GP.load}
 const AVG={M:window.AVATAR({d:null,g:'M'}),F:window.AVATAR({d:null,g:'F'})};
 document.querySelectorAll('#eGod .gpr').forEach(row=>{const cb=row.querySelector('.gc'),nm=row.querySelector('.gn'),kd=row.querySelector('.gk'),list=row.querySelector('.gpl');
  cb.addEventListener('change',()=>{nm.hidden=!cb.checked;if(kd)kd.hidden=!cb.checked;if(cb.checked){gindex();setTimeout(()=>(kd&&!kd.value?kd:nm).focus(),30)}else{list.innerHTML=''}});
  const show=()=>{const t=gfold(nm.value.trim());list.innerHTML='';if(!t||!GP.idx)return;
   GP.idx.filter(x=>(' '+gfold(x.nm).replace(/[()]/g,' ')).includes(' '+t)).slice(0,6).forEach(x=>{const b=document.createElement('button');b.type='button';
    b.innerHTML=`<img alt="" src="${AVG[x.g]||AVG.M||''}"><span><b></b><small></small><span class="tg"></span></span>`;b.querySelector('b').textContent=x.nm;b.querySelector('small').textContent=x.w;b.querySelector('.tg').textContent=x.trees.join(' · ');
    b.onclick=()=>{nm.value=x.nm;nm.dataset.id=x.id;list.innerHTML=''};list.appendChild(b)})};
  nm.addEventListener('input',()=>{delete nm.dataset.id;gindex().then(show);show()});nm.addEventListener('blur',()=>setTimeout(()=>{if(!list.contains(document.activeElement))list.innerHTML=''},200))});
 function godFill(p){const g=p.god||{};document.querySelectorAll('#eGod .gpr').forEach(row=>{const k=row.dataset.k,v=g[k],cb=row.querySelector('.gc'),nm=row.querySelector('.gn'),kd=row.querySelector('.gk');
  cb.checked=!!v;nm.hidden=!v;nm.value=v?v.name||'':'';if(v&&v.id)nm.dataset.id=v.id;else delete nm.dataset.id;if(kd){kd.hidden=!v;kd.value=v?v.kind||'':''}row.querySelector('.gpl').innerHTML=''})}
 function godRead(){const g={};let bad='';document.querySelectorAll('#eGod .gpr').forEach(row=>{const k=row.dataset.k,cb=row.querySelector('.gc'),nm=row.querySelector('.gn'),kd=row.querySelector('.gk');if(!cb.checked)return;
  const name=nm.value.trim();if(!name){bad="Enter the godparent's name";return}g[k]={name,...(nm.dataset.id?{id:nm.dataset.id}:{}),...(kd&&kd.value.trim()?{kind:kd.value.trim()}:{})}});return bad||g}
 window.GODFILL=godFill;window.GODREAD=godRead;
 // Entry 152: Remove from the tree — asks why (Divorced / Added by mistake), then saves like any other change
 const rd=$('rmDlg');
 $('edRm').onclick=()=>{if($('edRm').dataset.why){$('edErr').textContent=$('edRm').dataset.why;return}const {q,f}=ED;
  $('rmTitle').textContent='Remove '+MINH.disp(PP(q.cell))+'?';
  $('rmSub').textContent=f.i>0?'Their children stay in the tree with '+MINH.disp(PP(f.node.k[0]))+'.':'They have no spouse or children in the tree.';
  rd.querySelectorAll('input[name=rmWhy]').forEach(r=>{r.checked=false;r.closest('label').style.display=(r.value==='divorced'&&f.i===0)?'none':''});
  $('rmErr').textContent='';rd.classList.add('on')};
 $('rmCancel').onclick=()=>rd.classList.remove('on');
 $('rmOk').onclick=()=>{const why=(rd.querySelector('input[name=rmWhy]:checked')||{}).value;if(!why){$('rmErr').textContent='Pick a reason';return}
  rd.classList.remove('on');const {q,f}=ED,undo=JSON.stringify({root:MINH.DB.root,people:MINH.DB.people});
  if(f.i>0){const two=f.node.k.length===2;f.node.k.splice(f.i,1);if(two)(f.node.c||[]).forEach(c=>{if(!c.m)c.m=q.cell})}   /* children keep the removed spouse as their other parent — no one else becomes it */
  else{const i=f.parent.c.indexOf(f.node);f.parent.c.splice(i,1)}
  MINH.removed=Object.assign(MINH.removed||{},{[q.cell]:why});
  const btn=$('edSave');btn.textContent='Saving…';btn.style.pointerEvents='none';
  const back=m=>{const u=JSON.parse(undo);MINH.DB.root=u.root;MINH.DB.people=u.people;delete MINH.removed[q.cell];ED.f=MINH.find(q.cell);btn.textContent='Save';btn.style.pointerEvents='';$('edErr').textContent=m};
  MINH.save(viewNow()).then(r=>{if(r.ok)return location.reload();if(r.why==='code'){back('Your code was not accepted — enter it again.');close();window.ASKCODE(()=>openEd(q));return}
   back(r.why==='offline'?"Can't reach the family database — not saved.":'Not saved ('+(r.why||'error')+').')}).catch(e=>back("Can't reach the family database — not saved."))};
 $('ePhX').onclick=async()=>{const {q}=ED,b=$('ePhX');b.textContent='Removing…';b.style.pointerEvents='none';
  try{const r=await MINH.photoRemove(window.PID?window.PID(q.cell):q.cell);if(!r.ok){b.textContent=r.why==='code'?'Admin code not accepted':'Not removed';b.style.pointerEvents='';return}
   $('ePh').hidden=true;if(window.PHOTOS_RELOAD)await window.PHOTOS_RELOAD();render()}catch(e){b.textContent="Can't reach the database";b.style.pointerEvents=''}};
 $('edX').onclick=close;$('edCancel').onclick=close;ov.addEventListener('click',e=>{if(e.target===ov)close()});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&ov.classList.contains('on')){e.stopImmediatePropagation();close()}},true);
 $('edSave').onclick=()=>{const {q,f,rel}=ED,v=id=>$(id).value.trim(),F=v('eF'),err=t=>{$('edErr').textContent=t};
  if(!F)return err("First name can't be empty");
  if(!ED.eg)return err('Pick Male or Female');
  const adding=v('nF')||v('nM')||v('nL')||v('nA');
  if(adding&&!v('nF'))return err("Enter the new person's first name");
  if(adding&&rel==='spouse'&&!ED.sg)return err('Pick Male or Female for the spouse');
  const sps=f.node.k.slice(1);if(adding&&(rel==='son'||rel==='daughter')&&sps.length>1&&!ED.par)return err('Pick the other parent');
  const god=window.GODREAD?window.GODREAD():{};if(typeof god==='string')return err(god);
  const undo=JSON.stringify({root:MINH.DB.root,people:MINH.DB.people});   // put back if the save doesn't go through
  Object.assign(PP(q.cell),{first:F,middle:v('eM'),last:v('eL'),alt:v('eA'),dead:$('eP').checked,g:ED.eg,...(f.i===0&&f.parent?{adopted:$('eAd').checked}:{})});
  {const P0=PP(q.cell);if(Object.keys(god).length)P0.god=god;else delete P0.god}
  let added=null;
  if(adding){const id=MINH.newId();added=id;const g=rel==='brother'||rel==='son'?'M':rel==='sister'||rel==='daughter'?'F':ED.sg;
   MINH.DB.people[id]={first:v('nF'),middle:v('nM'),last:v('nL'),alt:v('nA'),g,dead:$('nP').checked,...(rel!=='spouse'&&$('nAd').checked?{adopted:true}:{}),added:new Date().toISOString()};
   if(rel==='spouse')f.node.k.splice(1+ED.pos,0,id);
   else if(rel==='son'||rel==='daughter'){const c={k:[id],c:[]};if(sps.length>1)c.m=ED.par;(f.node.c=f.node.c||[]).splice(ED.pos,0,c)}
   else f.parent.c.splice(ED.pos,0,{k:[id],c:[]})}
  const btn=$('edSave');btn.textContent='Saving…';btn.style.pointerEvents='none';
  const go=()=>{
  const back=m=>{const u=JSON.parse(undo);MINH.DB.root=u.root;MINH.DB.people=u.people;f.node=MINH.find(q.cell).node;btn.textContent='Save';btn.style.pointerEvents='';err(m)};
  MINH.save(viewNow()).then(r=>{
   if(r.ok)return location.reload();
   if(r.why==='code'){back('Your edit code was not accepted — enter it again.');close();window.ASKCODE(()=>openEd(q));return}
   if(r.why==='changed'){back('Someone else saved this tree a moment ago. Reloading the latest — then make your change again.');MINH.keep(viewNow());setTimeout(()=>location.reload(),2500);return}
   back(r.why==='offline'?"Can't reach the family database — not saved.":'Not saved ('+(r.why||'error')+').')})
  .catch(e=>back(e instanceof TypeError?"Can't reach the family database — not saved.":'Not saved — the family database refused it ('+e.message+').'))};
  // Entry 135: saving a Thương / Tường → first the link offer (Entry 130); either answer then saves
  const cand=window.LINKCHECK?[q.cell,added].filter(Boolean).find(window.LINKCHECK):null;
  if(cand)window.LINKOFFER(cand,go);else go()};
})();
// after a save the page reloads straight back into the same view (no splash, no drop), with the same focal
setTimeout(()=>{const st=MINH.restore;if(!st)return;const B=document.body;FOCAL=st.f?(CP[st.f]||null):null;ANCHOR=st.a?(CP[st.a]||null):null;
 if(st.v==='simple'){B.classList.add('simple');window.simpleDraw(false)}
 else if(st.v==='side'||st.v==='top'){B.classList.add(st.v);window.sideDraw(false,st.v)}
 else if(st.v==='snap'&&P.length)snapTo(st.th,st.r);
 paintFocal();labels();nav();hint();paneSync()});
