/* ================= Hanh's review list + Code Maker link (Entry 137) · pictures (Entry 143) =================
   Shared by Minh's page and the main page (the main page gives it a small MINH with the same calls). */
window.ADMINUI=function(){
 if(!MINH.isAdmin()||MINH.offline||document.getElementById('pReview'))return;
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const CODE_MAKER='https://claude.ai/artifact/36nTUeKgVfCusvZyjYtyy2';   // Hanh's private Code Maker (Entry 134)
 const anchor=document.querySelector('#pane .hint2'),sep=document.createElement('div');sep.className='sep mtree';
 const head=document.createElement('div');head.className='ptitle';head.textContent='Admin';
 const rv=document.createElement('button');rv.className='item';rv.type='button';rv.id='pReview';
 rv.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h11"/></svg><span class="grow">Review changes <span class="pbadge" id="revN">…</span><span class="sub">Confirm what others changed</span></span>';
 const cm=document.createElement('a');cm.className='item';cm.href=CODE_MAKER;cm.target='_blank';cm.rel='noopener';
 cm.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M15 8l2 2"/></svg><span class="grow">Code Maker<span class="sub">Make an edit code</span></span>';
 [sep,head,rv,cm].forEach(e=>anchor.before(e));
 let LIST=[],PICS=[],UPD=[],DIRTY=false;const dlg=$('revDlg');const LK=typeof LINK!=='undefined'?LINK:null;
 const ago=t=>{const s=(Date.now()-new Date(t))/1000;return s<90?'just now':s<5400?Math.round(s/60)+' min ago':s<129600?Math.round(s/3600)+' h ago':new Date(t).toLocaleDateString()};
 const nm=p=>p?((p.first||'??')+(p.alt?' ('+p.alt+')':'')):'??';
 const full=p=>[p.last,p.middle,p.first].filter(Boolean).join(' ')||'??';
 const FIELDS=[['first','First name'],['middle','Middle name'],['last','Last name'],['alt','Nickname'],['g','Male / Female'],['dead','Has passed'],['adopted','Adopted'],['god','Godparents']];
 const GODS=v=>v&&typeof v==='object'?Object.entries(v).map(([k,x])=>({baptism:'Baptism',confirmation:'Confirmation',other:'Other'}[k]||k)+(x.kind?' ('+x.kind+')':'')+': '+x.name).join(' · ')||'—':'—';
 const show=(k,v)=>k==='god'?GODS(v):k==='g'?(v==='M'?'Male':v==='F'?'Female':'?'):(k==='dead'||k==='adopted')?(v?'yes':'no'):(v||'—');
 function line(c){const sh=String(c.person||'').startsWith('hp:')?'<span class="shared">also in Hạnh\'s tree</span>':'',ed=c.person?`<button class="lnb" data-link="${esc(c.link)}" data-p="${esc(c.person)}" type="button">Edit</button>`:'';
  if(c.kind==='add')return `<div class="ln"><span class="tag add">Added</span><div class="what"><b>${esc(nm(c.after))}</b>${sh}<small>${esc(full(c.after))} · ${show('g',c.after.g)}${c.after.dead?' · has passed':''}</small></div>${ed}</div>`;
  if(c.kind==='edit'){const d=FIELDS.filter(([k])=>JSON.stringify((c.before||{})[k]??'')!==JSON.stringify((c.after||{})[k]??'')&&!((k==='dead'||k==='adopted')&&!c.before[k]&&!c.after[k]));
   return `<div class="ln"><span class="tag edit">Changed</span><div class="what"><b>${esc(nm(c.after))}</b>${sh}${d.map(([k,l])=>`<small>${l}: <s>${esc(show(k,c.before[k]))}</s> → ${esc(show(k,c.after[k]))}</small>`).join('')||'<small>(details only)</small>'}</div>${ed}</div>`}
  if(c.kind==='rename')return `<div class="ln"><span class="tag edit">Renamed</span><div class="what"><b>${esc(c.after.name)}</b><small>Tree name: <s>${esc((c.before||{}).name||'Unnamed tree')}</s> → ${esc(c.after.name)}</small></div></div>`;
  if(c.kind==='tree')return `<div class="ln"><span class="tag add">New tree</span><div class="what"><b>${esc(c.after.name)}</b><small>?tree=${esc(c.after.link)}</small></div></div>`;
  return `<div class="ln"><span class="tag shape">Moved</span><div class="what">Who belongs where or the birth order changed</div></div>`}
 function render(){$('revN').textContent=String(new Set(LIST.map(c=>c.link+'|'+c.at)).size+PICS.length+UPD.length);
  $('revAll').textContent='Confirm all';$('revAll').style.pointerEvents='';
  if(!LIST.length&&!PICS.length&&!UPD.length){$('revBody').innerHTML='<div class="empty">Nothing to review — everything is confirmed.</div>';$('revAll').hidden=true;return}
  $('revAll').hidden=false;const byTree=new Map();
  LIST.forEach(c=>{const k=c.tree+' · '+c.link;if(!byTree.has(k))byTree.set(k,new Map());const saves=byTree.get(k),s=c.at;if(!saves.has(s))saves.set(s,[]);saves.get(s).push(c)});
  let h=upds()+pics();byTree.forEach((saves,k)=>{const [tn]=k.split(' · ');h+=`<div class="tree">${esc(tn)}</div>`;
   saves.forEach((cs,at)=>{const adds=cs.some(c=>c.kind==='add'||c.kind==='edit'),ord={edit:0,add:1,tree:2,rename:2,shape:3};
    // the Bà Thương link (Entry 135) adds dozens of shared people at once: one line for them, then the rest
    const linked=cs.filter(c=>c.kind==='add'&&String(c.person).startsWith('hp:')),big=linked.length>=5;
    let shown=cs.filter(c=>(c.kind!=='shape'||!adds)&&!(big&&linked.includes(c))).sort((a,b)=>ord[a.kind]-ord[b.kind]);
    const her=big&&(linked.find(c=>LK&&c.person===LK.her)||linked[0]);
    const linkLine=big?`<div class="ln"><span class="tag add">🔗 Linked</span><div class="what"><b>Bà ${esc(nm(her.after))}</b> ${LK?'from '+esc(LK.tree):''}<small>${linked.length} shared people added with her${LK?' (Ông '+esc(LK.people[LK.husband].first)+' and their families, Tường\'s family)':''}</small></div><button class="lnb" data-link="${esc(cs[0].link)}" data-p="${esc(LK?LK.her:her.person)}" type="button">Edit</button></div>`:'';
    const few=shown.length>8?shown.slice(0,6):shown,rest=shown.length>8?shown.slice(6):[];   // a big save (e.g. the Bà Thương link) folds
    h+=`<div class="save"><div class="meta"><span><b>${esc(cs[0].editor||'?')}</b> saved ${ago(at)}</span><span>${new Date(at).toLocaleString()}</span></div>${linkLine}${few.map(line).join('')}${rest.length?`<details><summary class="lnb" style="display:inline-block;padding:6px 0">＋ ${rest.length} more</summary>${rest.map(line).join('')}</details>`:''}<div class="acts"><button class="btn pri" data-ids="${cs.map(c=>c.id).join(',')}" type="button">Confirm</button></div></div>`})});
  $('revBody').innerHTML=h;
  $('revBody').querySelectorAll('[data-upd]').forEach(b=>b.onclick=()=>decideU([+b.dataset.upd],b.dataset.ok==='1',b));
  $('revBody').querySelectorAll('[data-pic]').forEach(b=>b.onclick=()=>decide([+b.dataset.pic],b.dataset.ok==='1',b));
  $('revBody').querySelectorAll('[data-ids]').forEach(b=>b.onclick=()=>confirmIds(b.dataset.ids.split(',').map(Number),b));
  $('revBody').querySelectorAll('.lnb').forEach(b=>b.onclick=()=>editPerson(b.dataset.link,b.dataset.p))}
 // Entry 143: pictures from the picture page — before → after, Reject (the drawing / older picture comes back) or Confirm
 const DRAW='<div class="drw">Drawing</div>';
 function pics(){if(!PICS.length)return '';let h='<div class="tree">Pictures</div>';
  PICS.forEach(p=>{const [nm,...w]=String(p.who||'').split(' · ');h+=`<div class="save"><div class="meta"><span><b>${esc(p.sender)}</b> sent ${ago(p.at)}</span><span>${new Date(p.at).toLocaleString()}</span></div>
   <div class="ln"><span class="tag edit">📷 Picture</span><div class="what"><b>${esc(nm||p.person)}</b><small>${esc(w.join(' · '))}</small><small>${esc(p.tree)}</small></div></div>
   <div class="pics">${p.prev?`<img src="${p.prev}" alt="">`:DRAW}<span class="arw">→</span><img src="${p.img}" alt=""><small>Showing now, marked Pending</small></div>
   <div class="acts"><button class="btn no" data-pic="${p.id}" data-ok="0" type="button">Reject</button><button class="btn pri" data-pic="${p.id}" data-ok="1" type="button">Confirm</button></div></div>`});return h}
 async function decide(ids,ok,btn){if(btn){btn.textContent=ok?'Confirming…':'Rejecting…';btn.style.pointerEvents='none'}
  try{const r=await MINH.photoDecide(ids,ok);if(r.ok){PICS=PICS.filter(p=>!ids.includes(p.id));render();if(window.PHOTOS_RELOAD)window.PHOTOS_RELOAD()}else if(btn){btn.textContent='Not saved';btn.style.pointerEvents=''}}
  catch(e){if(btn){btn.textContent="Can't reach the database";btn.style.pointerEvents=''}}}
 // Entry 144: family updates on the main page — each save, line by line, Reject (undone at once) or Confirm
 const F2={first:'First name',middle:'Middle name',last:'Last name',alt:'Nickname',g:'Male / Female',dead:'Has passed',adopted:'Adopted',god:'Godparents'};
 const nmP=p=>p?((p.title?p.title+' ':'')+(p.first||'??')+(p.alt?' ('+p.alt+')':'')):'??';
 const who2=id=>MINH.DB&&MINH.DB.people&&MINH.DB.people[id]?nmP(MINH.DB.people[id]):id;
 const show2=(k,v)=>k==='god'?GODS(v):k==='g'?(v==='M'?'Male':v==='F'?'Female':'?'):(k==='dead'||k==='adopted')?(v?'yes':'no'):(v||'—');
 function upds(){if(!UPD.length)return '';let h='';const NM=window.TREENAMES||{},here=MINH.LINK||'hanh-paternal',tl=u=>((u.ops||[])[0]||{}).t||'hanh-paternal';
  // Entry 150: grouped by tree; the open tree's updates line by line, other trees' as their summary + a link to open them
  const order=[...new Set(UPD.map(tl))].sort((a,b)=>(a===here?-1:0)-(b===here?-1:0));
  order.forEach(t=>{h+='<div class="tree">Updates to '+esc(NM[t]||t)+'</div>';
  UPD.filter(u=>tl(u)===t).forEach(u=>{h+=`<div class="save"><div class="meta"><span><b>${esc(u.sender)}</b> sent ${ago(u.at)}</span><span>${new Date(u.at).toLocaleString()}</span></div>`;
   if(t!==here)h+=`<div class="ln"><span class="tag edit">Update</span><div class="what">${esc(String(u.summary||'').replace(/^[^:]*: /,''))}<small><a href="./?tree=${encodeURIComponent(t)}&admin" style="color:var(--gold)">Open this tree</a> to see it on the cards</small></div></div>`;
   else (u.ops||[]).forEach(o=>{if(o.op==='remove')h+=`<div class="ln"><span class="tag" style="background:#3a1d1b;color:#ff8389">Removed</span><div class="what"><b>${esc(nmP(o.was))}</b><small>${o.why==='divorced'?'Divorced out of the family':'Added by mistake'}</small></div></div>`;else if(o.op==='edit')h+=`<div class="ln"><span class="tag edit">Changed</span><div class="what"><b>${esc(who2(o.id))}</b>${Object.keys(o.set||{}).map(k=>`<small>${F2[k]||k}: <s>${esc(show2(k,(o.was||{})[k]))}</s> → ${esc(show2(k,o.set[k]))}</small>`).join('')}</div></div>`;
    else{const p=o.person||{};h+=`<div class="ln"><span class="tag add">Added</span><div class="what"><b>${esc(nmP(p))}</b><small>${o.op==='spouse'?'Spouse of':'Child of'} ${esc(who2(o.to))}${o.m?' & '+esc(who2(o.m)):''} · ${show2('g',p.g)}${p.dead?' · has passed':''}${p.adopted?' · adopted':''}</small></div></div>`}});
   h+=`<div class="acts"><button class="btn no" data-upd="${u.id}" data-ok="0" type="button">Reject</button><button class="btn pri" data-upd="${u.id}" data-ok="1" type="button">Confirm</button></div></div>`})});return h}
 async function decideU(ids,ok,btn){if(btn){btn.textContent=ok?'Confirming…':'Rejecting…';btn.style.pointerEvents='none'}
  try{const r=await MINH.updateDecide(ids,ok);if(r.ok){UPD=UPD.filter(u=>!ids.includes(u.id));DIRTY=true;render()}else if(btn){btn.textContent='Not saved';btn.style.pointerEvents=''}}
  catch(e){if(btn){btn.textContent="Can't reach the database";btn.style.pointerEvents=''}}}
 async function load(){try{const [r,ph,up]=await Promise.all([MINH.reviewList(),MINH.photoReview().catch(()=>({ok:false})),MINH.updateReview?MINH.updateReview().catch(()=>({ok:false})):{ok:false}]);UPD=up.ok?up.updates:[];if(!r.ok){$('revN').textContent='!';return}
  LIST=r.changes;PICS=ph.ok?ph.photos:[];render()}catch(e){$('revN').textContent='!'}}
 async function confirmIds(ids,btn){if(btn){btn.textContent='Confirming…';btn.style.pointerEvents='none'}
  try{const r=await MINH.confirm(ids);if(r.ok){LIST=LIST.filter(c=>!ids.includes(c.id));render()}else if(btn){btn.textContent='Not confirmed';btn.style.pointerEvents=''}}catch(e){if(btn){btn.textContent="Can't reach the database";btn.style.pointerEvents=''}}}
 function editPerson(link,pid){dlg.classList.remove('on');
  if(link===MINH.DB.link&&typeof CP!=='undefined'&&CP[pid]){window.EDIT(CP[pid]);return}
  location.href=(MINH.EDITBASE||'')+'?tree='+encodeURIComponent(link)+'&edit='+encodeURIComponent(pid)}
 rv.onclick=()=>{document.body.classList.remove('pane-open');render();dlg.classList.add('on');load()};
 $('revX').onclick=$('revDone').onclick=()=>{dlg.classList.remove('on');if(DIRTY){DIRTY=false;if(MINH.keep&&typeof viewNow==='function')MINH.keep(viewNow());location.reload()}};   // decided updates → redraw the tree
 $('revAll').onclick=async()=>{if(UPD.length)await decideU(UPD.map(u=>u.id),true,null);if(PICS.length)await decide(PICS.map(p=>p.id),true,null);if(LIST.length)confirmIds(LIST.map(c=>c.id),$('revAll'))};
 addEventListener('keydown',e=>{if(e.key==='Escape'&&dlg.classList.contains('on')){e.stopImmediatePropagation();dlg.classList.remove('on')}},true);
 load();
 // ?edit=<person> (from the review list on another tree) opens that person's editor
 const want=new URLSearchParams(location.search).get('edit');if(want&&typeof CP!=='undefined'&&CP[want])setTimeout(()=>window.EDIT(CP[want]),600);
};
window.ADMINUI();
