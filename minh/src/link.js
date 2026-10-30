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
/* ================= Entry 206 (Hanh): "Same person?" for anyone already in a built-in tree =================
   When a blood relative (first in their box) is saved and their first name (accents ignored) and gender match someone
   in one of the built-in trees who has a family under them, the page asks "Is this … from <tree>?". Yes → the card
   becomes that person's shared record and their branch is copied in: their spouse — only the one they share the
   children with (Hanh: "Lịch & Hai only") — and their children's families, all as shared records (hp:<cell> for Hạnh's
   Paternal tree, the tree's own ids for the others). No → that card is never asked again. */
(function(){
 const BR=__BRANCHES__;if(!BR||!BR.length)return;
 const fold=t=>(t||'').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[đĐ]/g,'d').toLowerCase().trim();
 const ids=n=>[...n.k,...(n.c||[]).flatMap(ids)],clone=o=>JSON.parse(JSON.stringify(o));
 const find=(id,n,par=null)=>{const i=n.k.indexOf(id);if(i>=0)return {node:n,parent:par,i};for(const c of n.c||[]){const r=find(id,c,n);if(r)return r}return null};
 // the branch of person X in tree T: X, the partner(s) they share children with, and those children's families
 function branch(T,X){const f=find(X,T.root);if(!f)return null;const n=f.node;let k,c;
  if(f.i===0){k=n.k.slice();c=(n.c||[]).map(clone)}
  else{k=[X,n.k[0]];c=(n.c||[]).filter(ch=>n.k.length===2||ch.m===X).map(clone);c.forEach(ch=>delete ch.m)}
  return {k,c,f}}
 const disp=p=>(p.first||'??')+(p.alt?' ('+p.alt+')':'');
 function candidates(id){const p=MINH.DB.people[id],f=MINH.find(id);if(!p||p.nolink||!f||f.i!==0||!fold(p.first)||(window.isINC&&window.isINC(p.first))||BR.some(T=>T.people[id]))return [];   // Entry 209: never for ~INC~, nor for someone already a shared record
  const have=new Set(ids(MINH.DB.root)),out=[];
  BR.forEach(T=>Object.entries(T.people).forEach(([x,q])=>{if(have.has(x)||fold(q.first)!==fold(p.first))return;if(p.g&&q.g&&p.g!=='?'&&q.g!=='?'&&p.g!==q.g)return;
   const b=branch(T,x);if(!b||(b.k.length<2&&!b.c.length))return;out.push({T,x,b})}));return out}
 window.GENCHECK=id=>candidates(id).length>0;
 window.XBUILT=BR;   // Entry 210: the built-in trees for "Already in another tree" (xlink.js)
 const dlg=$('linkDlg');let queue=[],cur=null,done=null;
 function show(){const c=queue[0],T=c.T,P=T.people,q=P[c.x],she=q.g==='F',sp=c.b.k.filter(i=>i!==c.x).map(i=>P[i]);
  const cnt=n=>n.k.length+(n.c||[]).reduce((s,x)=>s+cnt(x),0),fam=c.b.c.map(n=>({names:n.k.map(i=>disp(P[i])).join(' & '),n:cnt(n)}));
  const total=sp.length+fam.reduce((s,g)=>s+g.n,0);
  $('lkTitle').innerHTML='Is this '+(q.title?q.title+' ':'')+disp(q)+' from <span style="color:var(--gold)">'+T.name+'</span>?';
  $('lkAv').src=window.AVATAR({d:null,g:q.g==='F'?'F':'M'});$('lkName').textContent=disp(q);$('lkWings').hidden=!q.dead;
  $('lkSub').textContent=[sp.length?(she?'vợ của ':'chồng của ')+sp.map(disp).join(', '):'',c.b.c.length?(she?'mẹ của ':'cha của ')+c.b.c.map(n=>disp(P[n.k[0]])).join(', '):''].filter(Boolean).join(' · ');
  $('lkCount').innerHTML='Linking '+(she?'her':'him')+' adds the family already in that tree — <b>'+total+' people</b>:';
  $('lkList').innerHTML=(sp.length?'<div><b>'+sp.map(disp).join(', ')+'</b> — '+(she?'her husband':'his wife')+'</div>':'')+(fam.length?'<div class="h">Their children\'s families</div><div>'+fam.map(g=>g.names+' · '+g.n).join(' &nbsp;·&nbsp; ')+'</div>':'');
  $('lkFine').textContent='These people are shared: one record in both trees. A change made in one tree shows in the other.';
  $('lkNo').textContent=queue.length>1?'No — show the next match':'No, a different '+disp(q);$('lkYes').textContent='Yes, link '+(she?'her':'him');dlg.classList.add('on')}
 function apply(c,id){const DB=MINH.DB,f=MINH.find(id),node=f.node,T=c.T;
  ids({k:c.b.k,c:c.b.c}).forEach(k=>{if(!DB.people[k]){const r=Object.assign({},T.people[k]);delete r.title;r.src=T.link;DB.people[k]=r}});
  const mine=node.k.slice(1),myKids=node.c||[];node.k=[...c.b.k,...mine.filter(k=>!c.b.k.includes(k))];node.c=[...c.b.c,...myKids];
  if(id!==c.x)delete DB.people[id]}
 window.GENOFFER=(id,cb)=>{cur=id;done=cb;queue=candidates(id);if(!queue.length)return cb();show()};
 const yes0=$('lkYes').onclick,no0=$('lkNo').onclick;
 $('lkYes').onclick=()=>{if(!queue.length)return yes0&&yes0();dlg.classList.remove('on');apply(queue[0],cur);queue=[];if(done)done()};
 $('lkNo').onclick=()=>{if(!queue.length)return no0&&no0();queue.shift();if(queue.length){show();return}dlg.classList.remove('on');MINH.DB.people[cur].nolink=true;if(done)done()};
})();
