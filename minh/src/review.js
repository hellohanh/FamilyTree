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
 // Entry 180 (Hanh): Admin → Start a new tree (opens the new-tree dialog on Minh's page, which keeps the trees)
 const nt=document.createElement('button');nt.className='item';nt.type='button';nt.id='pNewTree';
 nt.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg><span class="grow">Start a new tree<span class="sub">Opens blank with the centre you pick</span></span>';
 nt.onclick=()=>{document.body.classList.remove('pane-open');if(window.OPENNEW)window.OPENNEW();else location.href='editor/?start=1'};
 // Entry 182 (Hanh): Admin → Rename a tree — any tree in the menu, the four built-in ones too (08_tree_names.sql)
 const rt=document.createElement('button');rt.className='item';rt.type='button';rt.id='pRenTree';
 rt.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg><span class="grow">Rename a tree<span class="sub">Any tree in the list</span></span>';
 const rdl=document.createElement('div');rdl.className='hdlg';rdl.id='rtDlg';rdl.setAttribute('role','dialog');rdl.setAttribute('aria-modal','true');rdl.setAttribute('aria-label','Rename a tree');
 rdl.innerHTML='<div class="box"><div class="k">✎ Admin</div><h2>Rename a tree</h2><p>Pick the tree, then type its new name. The link (?tree=…) stays the same, so links people already have keep working.</p>'+
  '<label class="f" for="rtWhich">Tree</label><select id="rtWhich" style="width:100%;box-sizing:border-box;font:inherit;font-size:16px;padding:10px 12px;border-radius:10px;background:#151515;color:#f1ece4;border:1px solid #525252"></select>'+
  '<label class="f" for="rtName">New name</label><input type="text" id="rtName" class="opt" maxlength="60" autocomplete="off" style="border-color:var(--req,#F0BC4F);box-shadow:0 0 0 1px var(--req,#F0BC4F) inset">'+
  '<div class="err" id="rtErr"></div><div class="foot"><span class="note">Yellow items are required</span><button class="btn" id="rtX" type="button">Cancel</button><button class="btn pri" id="rtOk" type="button">Save name</button></div></div>';
 document.body.appendChild(rdl);
 const rtList=()=>[...document.querySelectorAll('#pane a.item')].filter(a=>/tree=|\.\/$|FamilyTree\/$/.test(a.getAttribute('href')||'')).map(a=>({link:window.TREELINK(a),name:a.querySelector('.grow').firstChild.textContent.trim(),here:a.classList.contains('here')}));
 const rtShut=()=>rdl.classList.remove('on');
 rt.onclick=()=>{document.body.classList.remove('pane-open');const L=rtList(),s=$('rtWhich');s.innerHTML='';
  L.forEach(x=>{const o=document.createElement('option');o.value=x.link;o.textContent=x.name;if(x.here)o.selected=true;s.appendChild(o)});
  const cur=()=>{const x=L.find(y=>y.link===s.value);$('rtName').value=x?x.name:'';$('rtErr').textContent=''};s.onchange=cur;cur();$('rtOk').textContent='Save name';rdl.classList.add('on');setTimeout(()=>{$('rtName').focus();$('rtName').select()},50)};
 $('rtX').onclick=rtShut;rdl.addEventListener('click',e=>{if(e.target===rdl)rtShut()});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&rdl.classList.contains('on')){e.stopImmediatePropagation();rtShut()}},true);
 const rtGo=async()=>{const link=$('rtWhich').value,name=$('rtName').value.trim(),err=m=>$('rtErr').textContent=m;if(!name)return err('Give the tree a name');
  let code='';try{code=localStorage.getItem('hft-minh-code')||''}catch(e){}
  $('rtOk').textContent='Saving…';
  try{const KEY='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV',r=await fetch('https://quqgwvwijvwshdpwvkrk.supabase.co/rest/v1/rpc/rename_any_tree',{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify({p_code:code,p_link:link,p_name:name})});
   $('rtOk').textContent='Save name';if(r.status===404)return err('Run 08_tree_names.sql in Supabase first');
   const j=await r.json();if(!j.ok)return err(j.why==='code'||j.why==='not admin'?'Your admin code was not accepted':'Not renamed ('+j.why+')');
   window.APPLYNAME(link,j.name||name);rtShut();if(window.toast)toast('Renamed to '+(j.name||name))}
  catch(e){$('rtOk').textContent='Save name';err("Can't reach the family database")}};
 $('rtOk').onclick=rtGo;$('rtName').addEventListener('keydown',e=>{if(e.key==='Enter')rtGo()});
 // Entry 189 (Hanh): Admin → Download a backup — a full copy of everything kept in Supabase (09_backup.sql): trees,
 // people, Minh's edit history, pictures (the picture itself), updates, tree names, editor names; rejected ones included,
 // marked rejected; no codes. One dated .json file.
 const bk=document.createElement('button');bk.className='item';bk.type='button';bk.id='pBackup';
 const BKSUB='A copy of everything in the family database';
 bk.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg><span class="grow">Download a backup<span class="sub" id="bkSub">'+BKSUB+'</span></span>';
 let bkBusy=false;
 bk.onclick=async()=>{if(bkBusy)return;bkBusy=true;const sub=$('bkSub'),say=(m,ms)=>{sub.textContent=m;if(ms)setTimeout(()=>{sub.textContent=BKSUB},ms)};
  let code='';try{code=localStorage.getItem('hft-minh-code')||''}catch(e){}
  say('Preparing…');
  try{const KEY='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV',r=await fetch('https://quqgwvwijvwshdpwvkrk.supabase.co/rest/v1/rpc/backup_all',{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify({p_code:code})});
   if(r.status===404){bkBusy=false;return say('Run 09_backup.sql in Supabase first',6000)}
   if(!r.ok)throw new Error(r.status);const j=await r.json();
   if(!j.ok){bkBusy=false;return say('Your admin code was not accepted',6000)}
   const d=new Date(),day=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
   delete j.ok;const out={backup_of:'Trancestry family database (Supabase)',exported_at:d.toISOString(),built_in_tree_names:window.TREENAMES||{},...j};
   const blob=new Blob([JSON.stringify(out,null,1)],{type:'application/json'}),a=document.createElement('a');
   a.href=URL.createObjectURL(blob);a.download='trancestry-backup-'+day+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);
   const n=(k,w)=>{const c=(j[k]||[]).length;return c+' '+w+(c===1?'':'s')};say('Downloaded: '+n('trees','tree')+' · '+n('people','person').replace(/persons$/,'people')+' · '+n('photos','picture')+' · '+n('updates','update'),8000)}
  catch(e){say("Can't reach the family database",6000)}
  bkBusy=false};
 // Entry 201 (Hanh): on a tree kept in the database — Published switch (straight away; unpublished = only Hanh and its editor)
 let pub=null;if(MINH.DBT&&MINH.setPublished){pub=document.createElement('button');pub.className='item';pub.type='button';pub.id='pPublish';
  const lab=()=>{pub.setAttribute('aria-pressed',!!MINH.PUBLISHED);pub.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg><span class="grow">Published<span class="sub">'+(MINH.PUBLISHED?'This tree is on the family page':'Only you and its editor see it')+'</span></span><span class="sw"></span>'};lab();
  pub.onclick=async()=>{const on=!MINH.PUBLISHED;pub.querySelector('.sub').textContent=on?'Publishing…':'Unpublishing…';
   try{const r=await MINH.setPublished(on);if(r.ok){MINH.PUBLISHED=r.published;lab();const tg=document.getElementById('unpubTag');if(tg)tg.style.display=r.published?'none':'';else if(!r.published){const sm=document.querySelector('#hdr h1 small');if(sm)sm.insertAdjacentHTML('beforeend',' <span id="unpubTag" style="color:var(--gold)">· not published</span>')}
     if(window.toast)toast(r.published?'Published — on the family page now':'Unpublished — only you and its editor see it');return}
    lab();if(window.toast)toast(r.why==='code'?'Your admin code was not accepted':'Not changed ('+r.why+')')}catch(e){lab();if(window.toast)toast("Can't reach the family database")}}}
 [sep,head,pub,rv,nt,rt,bk,cm].filter(Boolean).forEach(e=>anchor.before(e));
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
   else (u.ops||[]).forEach(o=>{if(o.op==='remove')h+=`<div class="ln"><span class="tag" style="background:#3a1d1b;color:#ff8389">Removed</span><div class="what"><b>${esc(nmP(o.was))}</b><small>${o.why==='divorced'?'Divorced out of the family':'Added by mistake'}</small></div></div>`;else if(o.op==='order')h+=`<div class="ln"><span class="tag edit">Order</span><div class="what"><b>${esc(who2(o.id))}'s children</b><small>${(o.kids||[]).map((k,i)=>(i+1)+'. '+esc(who2(k))).join(' · ')}</small></div></div>`;else if(o.op==='edit')h+=`<div class="ln"><span class="tag edit">Changed</span><div class="what"><b>${esc(who2(o.id))}</b>${Object.keys(o.set||{}).map(k=>`<small>${F2[k]||k}: <s>${esc(show2(k,(o.was||{})[k]))}</s> → ${esc(show2(k,o.set[k]))}</small>`).join('')}</div></div>`;
    else{const p=o.person||{};h+=`<div class="ln"><span class="tag add">Added</span><div class="what"><b>${esc(nmP(p))}</b><small>${o.op==='spouse'?'Spouse of':'Child of'} ${esc(who2(o.to))}${o.m?' & '+esc(who2(o.m)):''} · ${show2('g',p.g)}${p.dead?' · has passed':''}${p.adopted?' · adopted':''}</small></div></div>`}});
   h+=`<div class="acts"><button class="btn no" data-upd="${u.id}" data-ok="0" type="button">Reject</button><button class="btn pri" data-upd="${u.id}" data-ok="1" type="button">Confirm</button></div></div>`})});return h}
 async function decideU(ids,ok,btn){if(btn){btn.textContent=ok?'Confirming…':'Rejecting…';btn.style.pointerEvents='none'}
  try{const r=await MINH.updateDecide(ids,ok);if(r.ok){
   // Entry 201: confirmed changes to a database tree are written into that tree (its editor sees them on /editor/)
   if(ok&&MINH.writeBack&&MINH.isDb){const by={};UPD.filter(u=>ids.includes(u.id)).forEach(u=>(u.ops||[]).forEach(o=>{if(MINH.isDb(o.t))(by[o.t]=by[o.t]||[]).push(o)}));
    for(const [t,ops] of Object.entries(by)){try{const w=await MINH.writeBack(t,ops);if(!w.ok&&window.toast)toast('Confirmed, but not written into that tree ('+w.why+')')}catch(e){if(window.toast)toast("Confirmed, but couldn't write it into that tree")}}}
   UPD=UPD.filter(u=>!ids.includes(u.id));DIRTY=true;render()}else if(btn){btn.textContent='Not saved';btn.style.pointerEvents=''}}
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
 // Entry 156: every confirmed Edit Tree update as one file — Hanh attaches it in the chat and Claude folds it into the
 // repo (data/updates.json) and lists the changes for the spreadsheet
 $('revDl').onclick=async()=>{const b=$('revDl');b.textContent='Preparing…';
  try{const KEY='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV',r=await fetch('https://quqgwvwijvwshdpwvkrk.supabase.co/rest/v1/updates?select=id,at,sender,summary,ops,status,decided_at,decided_by&status=eq.ok&order=id',{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
   if(!r.ok)throw new Error(r.status);const rows=await r.json();
   const blob=new Blob([JSON.stringify({exported_at:new Date().toISOString(),trees:window.TREENAMES||{},updates:rows},null,1)],{type:'application/json'});
   const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='trancestry-confirmed-updates-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();
   b.textContent='Downloaded ('+rows.length+')'}catch(e){b.textContent="Can't reach the database"}setTimeout(()=>b.textContent='Download confirmed updates',4000)};
 $('revAll').onclick=async()=>{if(UPD.length)await decideU(UPD.map(u=>u.id),true,null);if(PICS.length)await decide(PICS.map(p=>p.id),true,null);if(LIST.length)confirmIds(LIST.map(c=>c.id),$('revAll'))};
 addEventListener('keydown',e=>{if(e.key==='Escape'&&dlg.classList.contains('on')){e.stopImmediatePropagation();dlg.classList.remove('on')}},true);
 load();
 // ?edit=<person> (from the review list on another tree) opens that person's editor
 const want=new URLSearchParams(location.search).get('edit');if(want&&typeof CP!=='undefined'&&CP[want])setTimeout(()=>window.EDIT(CP[want]),600);
};
window.ADMINUI();
