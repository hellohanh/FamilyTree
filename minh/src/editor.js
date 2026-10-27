/* ================= Minh's editor (Entry 126) ================= */
// v1's pencil (yellow with a red eraser, Entry 17) on every card in Simple, Side and Top; it opens the v1 editor
// restyled to v2 (locked): First / Middle / Last / Nickname, Has passed, Male / Female (that couple's avatars);
// add a Spouse / Brother / Sister / Son / Daughter in birth order; yellow = required; accent suggestions on every
// name field from data/vn_names.txt. Save stores the tree (this browser, step 1) and redraws the same view.
const VN_GIVEN=__VN_GIVEN__,VN_LAST=__VN_LAST__;
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
 window.EDIT=function(q){const f=MINH.find(q.cell);if(!f)return;const p=PP(q.cell);
  ED={q,f,rel:'son',pos:null,eg:p.g||null,sg:null,par:null};
  $('eF').value=p.first||'';$('eM').value=p.middle||'';$('eL').value=p.last||'';$('eA').value=p.alt||'';$('eP').checked=!!p.dead;
  ['nF','nM','nL','nA'].forEach(i=>$(i).value='');$('nP').checked=false;$('edErr').textContent='';
  document.querySelectorAll('#edOv .sug').forEach(b=>b.innerHTML='');
  if(f.i>0&&f.node.k.length>2)ED.par=q.cell;   // a second spouse adding a child: that child is theirs
  ov.classList.add('on');render();ov.querySelector('.mdl').scrollTop=0};
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
  Object.assign(PP(q.cell),{first:F,middle:v('eM'),last:v('eL'),alt:v('eA'),dead:$('eP').checked,g:ED.eg});
  if(adding){const id=MINH.newId(),g=rel==='brother'||rel==='son'?'M':rel==='sister'||rel==='daughter'?'F':ED.sg;
   MINH.DB.people[id]={first:v('nF'),middle:v('nM'),last:v('nL'),alt:v('nA'),g,dead:$('nP').checked,added:new Date().toISOString()};
   if(rel==='spouse')f.node.k.splice(1+ED.pos,0,id);
   else if(rel==='son'||rel==='daughter'){const c={k:[id],c:[]};if(sps.length>1)c.m=ED.par;(f.node.c=f.node.c||[]).splice(ED.pos,0,c)}
   else f.parent.c.splice(ED.pos,0,{k:[id],c:[]})}
  if(MINH.save(viewNow()))location.reload()};
})();
// after a save the page reloads straight back into the same view (no splash, no drop), with the same focal
window.addEventListener('load',()=>{const st=MINH.restore;if(!st)return;const B=document.body;FOCAL=st.f?(CP[st.f]||null):null;
 if(st.v==='simple'){B.classList.add('simple');window.simpleDraw(false)}
 else if(st.v==='side'||st.v==='top'){B.classList.add(st.v);window.sideDraw(false,st.v)}
 else if(st.v==='snap'&&P.length)snapTo(st.th,st.r);
 paintFocal();labels();nav();hint();paneSync()});
