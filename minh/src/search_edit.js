/* ================= Edit Tree · Add a picture · The Multiverse (shared: main page and Minh's page) =================
   Entry 144/148/169, shared with Minh's page in Entry 172 (Hanh: "these should be on the /minh site too").
   Edit Tree opens a search; picking someone opens that page's edit pop-up (main: family code + Pending review;
   Minh's page: his edit code, saved straight away). */
(function(){
 const BASE=/\/minh\/?$/.test(location.pathname)?'../':'';
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
 const ph=document.createElement('a');ph.className='item';ph.id='pPic';ph.href=BASE+'photo/';
 ph.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg><span class="grow">Add a picture<span class="sub">Send a photo for someone\'s card</span></span>';
 it.after(ph);
 // Entry 169 (Hanh): "The Multiverse" (first called Inception View) below it — the 3D page (stacked trees with the people who link them)
 const iv=document.createElement('a');iv.className='item';iv.id='p3d';iv.href=BASE+'3d/';
 iv.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5.5" rx="8" ry="2.6"/><ellipse cx="12" cy="12" rx="8" ry="2.6"/><ellipse cx="12" cy="18.5" rx="8" ry="2.6"/><path d="M9 7.8v1.9M15 14.3v1.9"/></svg><span class="grow">The Multiverse<span class="sub">The trees stacked in 3D, linked</span></span>';
 ph.after(iv);
 it.onclick=()=>{document.body.classList.remove('pane-open');if(MINH.offline){toast("Updates are off — can't reach the family database");return}q.value='';res.innerHTML='';IDX=null;sd.classList.add('on');setTimeout(()=>q.focus(),50)};
})();
