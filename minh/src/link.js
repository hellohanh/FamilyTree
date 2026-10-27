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
