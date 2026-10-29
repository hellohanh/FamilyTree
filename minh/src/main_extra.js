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
  a.querySelector('.grow').firstChild.textContent=t.name||'Unnamed tree';if(t.published===false)a.dataset.unpub='1';last.after(a)});
 document.querySelectorAll('#pane a.item').forEach(a=>{const u=new URL(a.href,location.href);if(u.pathname!==location.pathname)return;
  const here=(u.searchParams.get('tree')||'hanh-paternal')===MINH.LINK;a.classList.toggle('here',here);if(here)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  const sb=a.querySelector('.sub');if(sb)sb.textContent=(here?'Open now':'Open this tree')+(a.dataset.unpub?' · not published':'')})
 // Entry 201: Hanh viewing an unpublished tree — marked in the header; someone else was sent here from one → a note
 if(MINH.DBT&&MINH.PUBLISHED===false){const sm=document.querySelector('#hdr h1 small');if(sm)sm.insertAdjacentHTML('beforeend',' <span id="unpubTag" style="color:var(--gold)">· not published</span>')}
 const U=new URLSearchParams(location.search),np=U.get('unpublished')||U.get('offline');
 if(np){setTimeout(()=>{if(typeof toast==='function')toast(U.get('offline')?"Can't reach the family database — showing "+MINH.NAME:'That tree isn’t published yet')},1200);try{history.replaceState(null,'',location.pathname)}catch(e){}}})();
// Pending marks on Simple / Side / Top cards: a "Pending" tag after the name; new people also get a dashed outline
window.PENDW=q=>MINH.PEND.has(q.cell)?(MINH.GONE.has(q.cell)?76:62):0;
window.PENDTAG=function(g,xr,cy,s,q,box){if(!MINH.PEND.has(q.cell))return;const w=(MINH.GONE.has(q.cell)?70:56)*s,h=18*s;
 if(MINH.NEW.has(q.cell)&&box)g.append('rect').attr('x',box.x).attr('y',box.y).attr('width',box.w).attr('height',box.h).attr('rx',7*s).attr('fill','none').attr('stroke','#9a948a').attr('stroke-width',1.4*s).attr('stroke-dasharray',`${5*s} ${4*s}`).style('pointer-events','none');
 g.append('rect').attr('x',xr-w).attr('y',cy-h/2).attr('width',w).attr('height',h).attr('rx',h/2).attr('fill','#c9c2b6').style('pointer-events','none');
 g.append('text').attr('x',xr-w/2).attr('y',cy).attr('dy','.35em').attr('text-anchor','middle').attr('font-size',11*s).attr('font-weight',700).attr('fill','#161616').style('pointer-events','none').text(MINH.GONE.has(q.cell)?'Removing':'Pending')};
// Entry 159: ?focus=<id> (from "Also in") opens the tree with that person as the focal, in the Simple view
setTimeout(()=>{const f=new URLSearchParams(location.search).get('focus');if(!f||!CP[f])return;FOCAL=CP[f];document.getElementById('pSimple').click()},300);
// Entry 193: links from The Multiverse's pane — ?open=side|top|simple|edit|review|rename does that item; ?q=<name> fills the search
(function(){const U=new URLSearchParams(location.search),o=U.get('open'),qq=U.get('q');if(!o&&!qq)return;
 const ID={side:'pSide',top:'pTop',simple:'pSimple',edit:'pSug',review:'pReview',rename:'pRenTree'}[o];
 const when=(test,fn,n=0)=>{if(test())fn();else if(n<40)setTimeout(()=>when(test,fn,n+1),150)};
 const clean=()=>{try{const u=new URL(location.href);u.searchParams.delete('open');u.searchParams.delete('q');history.replaceState(history.state,'',u)}catch(e){}};
 if(ID)when(()=>document.getElementById(ID),()=>{setTimeout(()=>{document.getElementById(ID).click();clean()},350)});
 if(qq)when(()=>document.getElementById('q'),()=>{setTimeout(()=>{const q=document.getElementById('q');if(innerWidth<=820)document.body.classList.add('pane-open');q.value=qq;q.dispatchEvent(new Event('input',{bubbles:true}));clean()},350)})})();
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
 // after a save the page comes back into the same view: say it went through
 let sent=null;try{sent=sessionStorage.getItem('hft-main-sent');sessionStorage.removeItem('hft-main-sent')}catch(e){}
 if(sent)setTimeout(()=>toast('Update sent — it shows now, marked Pending'),900);
})();
