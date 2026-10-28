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
  MINH.trees.forEach(t=>{const here=t.link===MINH.DB.link,a=document.createElement('a');a.className='item mtree'+(here?' here':'');a.href='../?tree='+encodeURIComponent(t.link);if(here)a.setAttribute('aria-current','page');
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
   sw.onclick=()=>{document.body.classList.remove('pane-open');MINH.forget();window.ASKCODE(()=>location.reload())};anchor.before(sw)}if(window.SORTTREES)window.SORTTREES()}
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
// Entry 180 (Hanh): optional names for the centre; a preset fills the dialog (Admin → Start a new tree)
 const who=()=>{$('newN1').style.display=centre.includes('M')?'':'none';$('newN2').style.display=centre.includes('F')?'':'none'};
 function openNew(pre){pre=pre&&pre.name?pre:{};document.body.classList.remove('pane-open');$('newName').value=pre.name||'';$('newLink').value=pre.link||'';$('newErr').textContent='';centre=pre.centre||'MF';
  $('newN1').value=pre.n1||'';$('newN2').value=pre.n2||'';
  nd.querySelectorAll('.chip2').forEach(b=>b.classList.toggle('sel',b.dataset.c===centre));who();showLink();nd.classList.add('on');setTimeout(()=>$('newName').focus(),50)}
 nd.querySelectorAll('.chip2').forEach(b=>b.onclick=()=>{centre=b.dataset.c;nd.querySelectorAll('.chip2').forEach(x=>x.classList.toggle('sel',x===b));who()});
 // Admin → "Start a new tree": the first one Hanh asked for is ready to go; once it exists the dialog opens blank
 const PRESET={name:"Hạnh's Maternal Grandpa & Siblings",link:'hanh-maternal-grandpa',centre:'MF',n1:'Ông Cố',n2:'Bà Cố'};
 window.OPENNEW=()=>{const go=()=>openNew(MINH.trees.some(x=>x.link===PRESET.link)?{}:PRESET);if(MINH.code())go();else window.ASKCODE(go)};
 if(new URLSearchParams(location.search).has('start'))setTimeout(window.OPENNEW,400);
 $('newName').addEventListener('input',showLink);$('newLink').addEventListener('input',showLink);
 $('newCancel').onclick=()=>nd.classList.remove('on');nd.addEventListener('click',e=>{if(e.target===nd)nd.classList.remove('on')});
 $('newOk').onclick=async()=>{const name=$('newName').value.trim(),lnk=slug($('newLink').value||name);
  if(!name){$('newErr').textContent='Give the tree a name';return}if(!lnk){$('newErr').textContent='Give it a link name with letters or numbers';return}
  const ids=centre.split('').map(()=>MINH.newId()),people={};ids.forEach((id,i)=>people[id]={first:(centre[i]==='M'?$('newN1'):$('newN2')).value.trim(),middle:'',last:'',alt:'',g:centre[i],dead:false});
  $('newOk').textContent='Starting…';
  try{const r=await MINH.createTree(name,lnk,{k:ids,c:[]},people);$('newOk').textContent='Start tree';
   if(r.ok){location.href='?tree='+encodeURIComponent(lnk);return}
   $('newErr').textContent=r.why==='link taken'?'That link name is taken — try another':r.why==='code'?'Your edit code was not accepted':'Not started ('+r.why+')';
   if(r.why==='code'){MINH.forget();nd.classList.remove('on');window.ASKCODE(openNew)}}
  catch(e){$('newOk').textContent='Start tree';$('newErr').textContent="Can't reach the family database"}};
})();
