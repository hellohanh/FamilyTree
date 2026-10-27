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
  $('eF').value=p.first||'';$('eM').value=p.middle||'';$('eL').value=p.last||'';$('eA').value=p.alt||'';$('eP').checked=!!p.dead;
  ['nF','nM','nL','nA'].forEach(i=>$(i).value='');$('nP').checked=false;$('edErr').textContent='';
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
  const ttl=id=>{const t=titleOf(q.cell,id);return t?`<span class="chip">${esc(t)}</span>`:''};
  const newT=r==='son'||r==='daughter'?'<span class="chip">Con</span>':'';
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
  $('nG').style.display=r==='spouse'?'inline-flex':'none';
  $('nG').innerHTML='<span class="lb">Spouse is</span>'+['M','F'].map(g=>`<button class="gbtn ${ED.sg===g?'sel':''}" data-g="${g}" type="button">${window.AVATAR({d:q.d,g})?`<img src="${window.AVATAR({d:q.d,g})}" alt="">`:''}${g==='M'?'Male':'Female'}</button>`).join('');
  $('nG').querySelectorAll('.gbtn').forEach(b=>b.onclick=()=>{ED.sg=b.dataset.g;render()});
  // a child of someone with two or more spouses: which one is the other parent (required)
  const sps=f.node.k.slice(1),needPar=(r==='son'||r==='daughter')&&sps.length>1;
  $('nPar').style.display=needPar?'inline-flex':'none';
  $('nPar').innerHTML='<span class="lb">Other parent</span>'+sps.map(id=>`<button class="gbtn ${ED.par===id?'sel':''}" data-p="${id}" type="button">${esc(MINH.disp(PP(id)))}</button>`).join('');
  $('nPar').querySelectorAll('.gbtn').forEach(b=>b.onclick=()=>{ED.par=b.dataset.p;render()})}
 $('edX').onclick=close;$('edCancel').onclick=close;ov.addEventListener('click',e=>{if(e.target===ov)close()});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&ov.classList.contains('on')){e.stopImmediatePropagation();close()}},true);
 $('edSave').onclick=()=>{const {q,f,rel}=ED,v=id=>$(id).value.trim(),F=v('eF'),err=t=>{$('edErr').textContent=t};
  if(!F)return err("First name can't be empty");
  if(!ED.eg)return err('Pick Male or Female');
  const adding=v('nF')||v('nM')||v('nL')||v('nA');
  if(adding&&!v('nF'))return err("Enter the new person's first name");
  if(adding&&rel==='spouse'&&!ED.sg)return err('Pick Male or Female for the spouse');
  const sps=f.node.k.slice(1);if(adding&&(rel==='son'||rel==='daughter')&&sps.length>1&&!ED.par)return err('Pick the other parent');
  const undo=JSON.stringify({root:MINH.DB.root,people:MINH.DB.people});   // put back if the save doesn't go through
  Object.assign(PP(q.cell),{first:F,middle:v('eM'),last:v('eL'),alt:v('eA'),dead:$('eP').checked,g:ED.eg});
  let added=null;
  if(adding){const id=MINH.newId();added=id;const g=rel==='brother'||rel==='son'?'M':rel==='sister'||rel==='daughter'?'F':ED.sg;
   MINH.DB.people[id]={first:v('nF'),middle:v('nM'),last:v('nL'),alt:v('nA'),g,dead:$('nP').checked,added:new Date().toISOString()};
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
  const cand=[q.cell,added].filter(Boolean).find(window.LINKCHECK);
  if(cand)window.LINKOFFER(cand,go);else go()};
})();
// after a save the page reloads straight back into the same view (no splash, no drop), with the same focal
setTimeout(()=>{const st=MINH.restore;if(!st)return;const B=document.body;FOCAL=st.f?(CP[st.f]||null):null;ANCHOR=st.a?(CP[st.a]||null):null;
 if(st.v==='simple'){B.classList.add('simple');window.simpleDraw(false)}
 else if(st.v==='side'||st.v==='top'){B.classList.add(st.v);window.sideDraw(false,st.v)}
 else if(st.v==='snap'&&P.length)snapTo(st.th,st.r);
 paintFocal();labels();nav();hint();paneSync()});
/* ================= Bà Thương link (Entries 130, 135) ================= */
(function(){
 const fold=t=>(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase().trim();
 const ids=n=>[...n.k,...(n.c||[]).flatMap(ids)];
 // offer when a blood relative (first in their box) named Thương / Tường is saved, the tree doesn't have her yet,
 // and Minh hasn't already said "a different Thương" for that card
 window.LINKCHECK=id=>{const p=MINH.DB.people[id],f=MINH.find(id);
  return !!p&&!p.nolink&&f&&f.i===0&&['thuong','tuong'].includes(fold(p.first))&&!ids(MINH.DB.root).includes(LINK.her)};
 const P=LINK.people,her=P[LINK.her],kidsOf=LINK.kids.map(k=>P[k.k[0]].first);
 function applyLink(id){const DB=MINH.DB,f=MINH.find(id),node=f.node,fh=MINH.newId();
  Object.keys(P).forEach(k=>{if(!DB.people[k])DB.people[k]=JSON.parse(JSON.stringify(P[k]))});
  DB.people[fh]={first:'',middle:'',last:'',alt:'',g:'M',dead:false};      // her first husband (Tường's father) — "??" until Minh names him
  const kids=JSON.parse(JSON.stringify(LINK.kids));kids.forEach(k=>{if(k.m==='@first')k.m=fh});
  const myKids=node.c||[];myKids.forEach(c=>{if(!c.m&&node.k.length>1)c.m=node.k[1]});
  node.k=[LINK.her,fh,LINK.husband,...node.k.slice(1)];node.c=[...kids,...myKids];
  if(id!==LINK.her)delete DB.people[id]}
 const dlg=$('linkDlg');let done=null,cur=null;
 window.LINKOFFER=(id,cb)=>{done=cb;cur=id;
  $('lkTitle').innerHTML='Is this Bà '+her.first+' from <span style="color:var(--gold)">'+LINK.tree+'</span>?';
  $('lkAv').src=window.AVATAR({d:null,g:'F'});$('lkName').textContent=her.first+(her.alt?' ('+her.alt+')':'');
  $('lkSub').textContent='vợ của '+P[LINK.husband].first+' · mẹ của '+kidsOf.join(', ');$('lkWings').hidden=!her.dead;
  $('lkCount').innerHTML='Linking her adds the family already in that tree — <b>'+(1+LINK.groups.reduce((s,g)=>s+g.n,0))+' people</b>:';
  const ours=LINK.groups.filter(g=>!g.first),first=LINK.groups.filter(g=>g.first);
  $('lkList').innerHTML='<div><b>Ông '+P[LINK.husband].first+'</b> — her husband</div><div class="h">Their children\'s families</div><div>'+ours.map(g=>g.names+' · '+g.n).join(' &nbsp;·&nbsp; ')+'</div>'+
   (first.length?'<div class="h">From her first marriage</div><div>'+first.map(g=>g.names+'\'s family · '+g.n).join(' · ')+' &nbsp;<span style="color:var(--muted)">(her first husband shows as ?? until you add him)</span></div>':'');
  $('lkFine').textContent="These people are shared: one record in both trees. A change you make shows in Hạnh's tree too, once Hạnh confirms it.";
  $('lkNo').textContent='No, a different '+her.first;dlg.classList.add('on')};
 $('lkYes').onclick=()=>{dlg.classList.remove('on');applyLink(cur);if(done)done()};
 $('lkNo').onclick=()=>{dlg.classList.remove('on');MINH.DB.people[cur].nolink=true;if(done)done()};   // never asked again for that card
})();
/* ================= Code prompt · tree name · TREES list · new tree (Entries 131–132) ================= */
(function(){
 const fold=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[đĐ]/g,'d').toLowerCase();
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 // notice when the database can't be reached / the tree doesn't exist
 if(MINH.error){$('mNotice').textContent=MINH.error;$('mNotice').classList.add('on')}
 // the tree's name under Trancestry and in the tab (unnamed → "Our Family Tree")
 if(MINH.DB.name){document.querySelector('#hdr h1 small').textContent=MINH.DB.name;document.title='Trancestry · '+MINH.DB.name}
 // the code, asked once per device
 let after=null;const cd=$('codeDlg'),ci=$('codeIn');
 window.ASKCODE=fn=>{after=fn;ci.value='';$('codeErr').textContent='';cd.classList.add('on');setTimeout(()=>ci.focus(),50)};
 const shut=()=>{cd.classList.remove('on');after=null};
 $('codeCancel').onclick=shut;cd.addEventListener('click',e=>{if(e.target===cd)shut()});
 const go=async()=>{const c=ci.value.trim();if(!c){$('codeErr').textContent='Enter the code';return}
  $('codeOk').textContent='Checking…';
  try{const r=await MINH.checkCode(c);$('codeOk').textContent='Continue';
   if(!r.ok){$('codeErr').textContent="That code isn't right";return}
   const fn=after;shut();paneTrees();if(window.ADMINUI)window.ADMINUI();if(fn)fn()}
  catch(e){$('codeOk').textContent='Continue';$('codeErr').textContent=/Too many/.test(e.message)?'Too many tries — wait a few minutes':"Can't reach the family database"}};
 $('codeOk').onclick=go;ci.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
 addEventListener('keydown',e=>{if(e.key==='Escape'){if(cd.classList.contains('on')){e.stopImmediatePropagation();shut()}if($('newDlg').classList.contains('on')){e.stopImmediatePropagation();$('newDlg').classList.remove('on')}}},true);
 // TREES list: the trees kept in Supabase join the built-in ones; code holders can start a new tree
 const icon='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="5"/><path d="M12 13v9M12 17l-3-2M12 16l3-2"/></svg>';
 function paneTrees(){document.querySelectorAll('#pane .mtree').forEach(e=>e.remove());
  const anchor=document.querySelector('#pane .hint2');
  MINH.trees.forEach(t=>{const here=t.link===MINH.DB.link,a=document.createElement('a');a.className='item mtree'+(here?' here':'');a.href='?tree='+encodeURIComponent(t.link);if(here)a.setAttribute('aria-current','page');
   a.innerHTML=icon+`<span class="grow">${esc(t.name||'Unnamed tree')}<span class="sub">${here?'Open now':'Open this tree'}</span></span>`;anchor.before(a)});
  if(MINH.code()&&!MINH.offline){const b=document.createElement('button');b.className='item mtree';b.type='button';
   b.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span class="grow">Start a new tree<span class="sub">Opens blank</span></span>';
   b.onclick=openNew;
   // Entry 138: rename the tree that's open (Supabase checks it's this code's tree, or Hanh's admin code)
   const rn=document.createElement('button');rn.className='item mtree';rn.type='button';
   rn.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg><span class="grow">Rename this tree<span class="sub">Now: '+esc(MINH.DB.name||'Unnamed tree')+'</span></span>';
   rn.onclick=openRen;anchor.before(rn);anchor.before(b);
   // Entry 137: switch to another code on this device (e.g. Hanh's admin code after testing with Minh's)
   const sw=document.createElement('button');sw.className='item mtree';sw.type='button';
   sw.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h13l-3-3M20 17H7l3 3"/></svg><span class="grow">Switch edit code<span class="sub">'+(MINH.editor&&MINH.editor.name?'Now: '+MINH.editor.name:'Use a different code on this device')+'</span></span>';
   sw.onclick=()=>{document.body.classList.remove('pane-open');MINH.forget();window.ASKCODE(()=>location.reload())};anchor.before(sw)}}
 // Rename this tree
 const rd=$('renDlg');
 function openRen(){document.body.classList.remove('pane-open');$('renName').value=MINH.DB.name||'';$('renErr').textContent='';$('renOk').textContent='Save name';rd.classList.add('on');setTimeout(()=>{$('renName').focus();$('renName').select()},50)}
 const renShut=()=>rd.classList.remove('on');
 $('renCancel').onclick=renShut;rd.addEventListener('click',e=>{if(e.target===rd)renShut()});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&rd.classList.contains('on')){e.stopImmediatePropagation();renShut()}},true);
 const renGo=async()=>{const name=$('renName').value.trim();if(!name){$('renErr').textContent='Give the tree a name';return}
  if(name===MINH.DB.name){renShut();return}
  $('renOk').textContent='Saving…';
  try{const r=await MINH.rename(name);$('renOk').textContent='Save name';
   if(r.ok){MINH.DB.name=r.name;const t=MINH.trees.find(x=>x.link===MINH.DB.link);if(t)t.name=r.name;
    document.querySelector('#hdr h1 small').textContent=r.name;document.title='Trancestry · '+r.name;paneTrees();renShut();return}
   $('renErr').textContent=r.why==='not your tree'?'Only the person who started this tree can rename it':r.why==='code'?'Your edit code was not accepted':'Not renamed ('+r.why+')';
   if(r.why==='code'){MINH.forget();renShut();window.ASKCODE(openRen)}}
  catch(e){$('renOk').textContent='Save name';$('renErr').textContent="Can't reach the family database"}};
 $('renOk').onclick=renGo;$('renName').addEventListener('keydown',e=>{if(e.key==='Enter')renGo()});
 paneTrees();
 // ＋ Start a new tree: name (required), link name (made from the name, editable), who is in the centre
 const nd=$('newDlg');let centre='MF';
 const slug=t=>fold(t).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
 const showLink=()=>{const l=slug($('newLink').value||$('newName').value);$('newLinkShow').textContent=l?'· ?tree='+l:''};
 function openNew(){document.body.classList.remove('pane-open');$('newName').value='';$('newLink').value='';$('newErr').textContent='';centre='MF';
  nd.querySelectorAll('.chip2').forEach(b=>b.classList.toggle('sel',b.dataset.c===centre));showLink();nd.classList.add('on');setTimeout(()=>$('newName').focus(),50)}
 nd.querySelectorAll('.chip2').forEach(b=>b.onclick=()=>{centre=b.dataset.c;nd.querySelectorAll('.chip2').forEach(x=>x.classList.toggle('sel',x===b))});
 $('newName').addEventListener('input',showLink);$('newLink').addEventListener('input',showLink);
 $('newCancel').onclick=()=>nd.classList.remove('on');nd.addEventListener('click',e=>{if(e.target===nd)nd.classList.remove('on')});
 $('newOk').onclick=async()=>{const name=$('newName').value.trim(),lnk=slug($('newLink').value||name);
  if(!name){$('newErr').textContent='Give the tree a name';return}if(!lnk){$('newErr').textContent='Give it a link name with letters or numbers';return}
  const ids=centre.split('').map(()=>MINH.newId()),people={};ids.forEach((id,i)=>people[id]={first:'',middle:'',last:'',alt:'',g:centre[i],dead:false});
  $('newOk').textContent='Starting…';
  try{const r=await MINH.createTree(name,lnk,{k:ids,c:[]},people);$('newOk').textContent='Start tree';
   if(r.ok){location.href='?tree='+encodeURIComponent(lnk);return}
   $('newErr').textContent=r.why==='link taken'?'That link name is taken — try another':r.why==='code'?'Your edit code was not accepted':'Not started ('+r.why+')';
   if(r.why==='code'){MINH.forget();nd.classList.remove('on');window.ASKCODE(openNew)}}
  catch(e){$('newOk').textContent='Start tree';$('newErr').textContent="Can't reach the family database"}};
})();
