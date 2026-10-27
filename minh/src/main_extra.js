/* ================= Main page: "Suggest an update" (Entry 144) =================
   No pencils on the main page: the left pane's "Suggest an update" opens a search first (the same search as Options),
   picking someone opens the locked edit pop-up. The family code (the one on the QR card) and the sender's name are
   asked once per phone, shared with the picture page. A save sends the changes as one update; it shows at once,
   marked Pending, until Hanh confirms or rejects it in Review changes. */
window.PEN=function(){};   // the editor's pencils stay on Minh's page
// Entry 150: the open tree's name under Trancestry and in the tab; TREES marks the open one
(function(){const nm=MINH.NAME;if(nm){const sm=document.querySelector('#hdr h1 small');if(sm)sm.textContent=nm;document.title='Trancestry · '+nm}
 // Entry 151: the trees kept in the family database (Minh's) join the list, with the same ?tree= links
 const last=[...document.querySelectorAll('#pane a.item')].filter(a=>/tree=|\.\/$|FamilyTree\/$/.test(a.getAttribute('href')||'')).pop();
 if(last)(MINH.more||[]).slice().reverse().forEach(t=>{const a=last.cloneNode(true);a.classList.remove('here');a.removeAttribute('aria-current');a.href='?tree='+encodeURIComponent(t.link);
  a.querySelector('.grow').firstChild.textContent=t.name||'Unnamed tree';last.after(a)});
 document.querySelectorAll('#pane a.item').forEach(a=>{const u=new URL(a.href,location.href);if(u.pathname!==location.pathname)return;
  const here=(u.searchParams.get('tree')||'hanh-paternal')===MINH.LINK;a.classList.toggle('here',here);if(here)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  const sb=a.querySelector('.sub');if(sb)sb.textContent=here?'Open now':'Open this tree'})})();
// Pending marks on Simple / Side / Top cards: a "Pending" tag after the name; new people also get a dashed outline
window.PENDW=q=>MINH.PEND.has(q.cell)?(MINH.GONE.has(q.cell)?76:62):0;
window.PENDTAG=function(g,xr,cy,s,q,box){if(!MINH.PEND.has(q.cell))return;const w=(MINH.GONE.has(q.cell)?70:56)*s,h=18*s;
 if(MINH.NEW.has(q.cell)&&box)g.append('rect').attr('x',box.x).attr('y',box.y).attr('width',box.w).attr('height',box.h).attr('rx',7*s).attr('fill','none').attr('stroke','#9a948a').attr('stroke-width',1.4*s).attr('stroke-dasharray',`${5*s} ${4*s}`).style('pointer-events','none');
 g.append('rect').attr('x',xr-w).attr('y',cy-h/2).attr('width',w).attr('height',h).attr('rx',h/2).attr('fill','#c9c2b6').style('pointer-events','none');
 g.append('text').attr('x',xr-w/2).attr('y',cy).attr('dy','.35em').attr('text-anchor','middle').attr('font-size',11*s).attr('font-weight',700).attr('fill','#161616').style('pointer-events','none').text(MINH.GONE.has(q.cell)?'Removing':'Pending')};
(function(){
 const cd=$('codeDlg'),ci=$('codeIn');let after=null,mode='fam';
 // a "Your name" field under the code (family mode only)
 const nmWrap=document.createElement('div');nmWrap.id='codeName';
 nmWrap.innerHTML='<label class="f" for="codeNm">Your name</label><input type="text" id="codeNm" autocomplete="name" maxlength="60">';
 $('codeErr').before(nmWrap);
 const T={fam:['✎ Edit Tree','Enter the family code',"It's on the QR card. You only need to do this once on this phone.",'Family code'],
          adm:['Admin','Enter your admin code','Only for Hạnh. You only need to do this once on this device.','Admin code']};
 function ask(m,fn){mode=m;after=fn;const t=T[m];cd.querySelector('.k').textContent=t[0];cd.querySelector('h2').textContent=t[1];cd.querySelector('p').textContent=t[2];
  cd.querySelector('label[for="codeIn"]').textContent=t[3];cd.classList.toggle('fam',m==='fam');
  ci.value='';$('codeNm').value=MINH.sender();$('codeErr').textContent='';cd.classList.add('on');setTimeout(()=>ci.focus(),50)}
 window.ASKCODE=fn=>ask('fam',fn);
 const shut=()=>{cd.classList.remove('on');after=null};
 $('codeCancel').onclick=shut;cd.addEventListener('click',e=>{if(e.target===cd)shut()});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&cd.classList.contains('on')){e.stopImmediatePropagation();shut()}},true);
 const go=async()=>{const c=ci.value.trim(),nm=$('codeNm').value.trim(),err=t=>$('codeErr').textContent=t;
  if(!c)return err('Enter the code');if(mode==='fam'&&!nm)return err('Enter your name');
  $('codeOk').textContent='Checking…';
  try{const r=mode==='fam'?await MINH.checkCode(c,nm):await MINH.adminCheck(c);$('codeOk').textContent='Continue';
   if(!r.ok)return err("That code isn't right");if(mode==='adm'&&!r.admin)return err("That isn't an admin code");
   const fn=after;shut();if(mode==='adm'&&window.ADMINUI)window.ADMINUI();if(fn)fn()}
  catch(e){$('codeOk').textContent='Continue';err(/Too many/.test(e.message)?'Too many tries — wait a few minutes':"Can't reach the family database")}};
 $('codeOk').onclick=go;ci.addEventListener('keydown',e=>{if(e.key==='Enter')go()});$('codeNm').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
 // Hanh: open the main page with ?admin to sign in (a device signed in on /minh/ already has it)
 if(new URLSearchParams(location.search).has('admin')&&!MINH.isAdmin())setTimeout(()=>ask('adm',null),400);
 // the search: same matching and "con của / vợ của" line as the Options search (Entry 92)
 const fold=t=>t.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase(),bare=t=>t.replace(/^(Ông|Bà) /,'').replace(/ \(.*\)$/,'');
 function who(p){const d=p.d,par=d.parent;if(p.i>0)return (p.g==='F'?'vợ':p.g==='M'?'chồng':'vợ/chồng')+' của '+bare(d.data.n[0]);if(!par)return '';
  const pn=par.data,mi=d.data.m?pn.k.indexOf(d.data.m):(pn.n.length===2?1:-1);if(d.data.s&&mi>=0)return 'con của '+bare(pn.n[mi]);
  const ix=[0,mi].filter(i=>i>=0),same=ix.length>1&&bare(pn.n[ix[0]])===bare(pn.n[ix[1]]);const two=ix.map(i=>({nm:same?pn.n[i].replace(/ \(.*\)$/,''):bare(pn.n[i]),g:pn.g[i]}));two.sort((a,b)=>(a.g==='M'?0:1)-(b.g==='M'?0:1));
  return 'con của '+two.map(x=>x.nm).join(' & ')}
 const sd=$('sugDlg'),q=$('sugQ'),res=$('sugRes');let IDX=null;
 function show(){IDX=IDX||Object.values(CP).filter(p=>!p.nm.startsWith('??')).map(p=>({p,key:fold(p.nm),w:who(p)}));
  const t=fold(q.value.trim());res.innerHTML='';if(!t)return;
  const hits=IDX.filter(x=>(' '+x.key.replace(/[()]/g,' ')).includes(' '+t)).sort((a,b)=>(a.key.startsWith(t)?0:1)-(b.key.startsWith(t)?0:1)||a.key.localeCompare(b.key)).slice(0,40);
  if(!hits.length){res.innerHTML='<div class="none">No one by that name</div>';return}
  hits.forEach(x=>{const b=document.createElement('button');b.type='button';b.innerHTML='<img alt=""><span><b></b><small></small></span>';
   const a=window.AVATAR?window.AVATAR(x.p):'';if(a)b.querySelector('img').src=a;b.querySelector('b').textContent=x.p.nm;b.querySelector('small').textContent=x.w;
   b.onclick=()=>{sd.classList.remove('on');window.EDIT(x.p)};res.appendChild(b)})}
 q.addEventListener('input',show);q.addEventListener('keydown',e=>{if(e.key==='Enter'){const f=res.querySelector('button');if(f)f.click()}});
 $('sugX').onclick=()=>sd.classList.remove('on');sd.addEventListener('click',e=>{if(e.target===sd)sd.classList.remove('on')});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&sd.classList.contains('on')){e.stopImmediatePropagation();sd.classList.remove('on')}},true);
 // the pane item, above TREES
 const it=document.createElement('button');it.className='item';it.type='button';it.id='pSug';
 it.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/></svg><span class="grow">Edit Tree<span class="sub">Add or fix someone</span></span>';
 const trees=[...document.querySelectorAll('#pane .ptitle')].find(e=>/trees/i.test(e.textContent));(trees||document.querySelector('#pane .hint2')).before(it);
 // Entry 148 (Hanh): "Add a picture" right below — opens the picture page (it asks for the family code itself)
 const ph=document.createElement('a');ph.className='item';ph.id='pPic';ph.href='photo/';
 ph.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><span class="grow">Add a picture<span class="sub">Send a photo for someone\'s card</span></span>';
 it.after(ph);
 it.onclick=()=>{document.body.classList.remove('pane-open');if(MINH.offline){toast("Updates are off — can't reach the family database");return}q.value='';res.innerHTML='';sd.classList.add('on');setTimeout(()=>q.focus(),50)};
 // after a save the page comes back into the same view: say it went through
 let sent=null;try{sent=sessionStorage.getItem('hft-main-sent');sessionStorage.removeItem('hft-main-sent')}catch(e){}
 if(sent)setTimeout(()=>toast('Update sent — it shows now, marked Pending'),900);
})();
