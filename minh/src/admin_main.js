/* ================= The main page's admin section (Entry 143) =================
   Hanh's admin code is shared with Minh's page (same site, same saved code), so a device signed in on /minh/ shows the
   Admin section here too. Signing in on the main page: open it with ?admin. Nothing shows for anyone else. */
const MINH=(function(){
 const SB='https://quqgwvwijvwshdpwvkrk.supabase.co',KEY='sb_publishable_nrPplI-hzHW96Ar3dmd5EQ_4AnptidV',H={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
 const CK='hft-minh-code',AK='hft-minh-admin';
 const ls={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
 const rpc=async(fn,a)=>{const r=await fetch(SB+'/rest/v1/rpc/'+fn,{method:'POST',headers:H,body:JSON.stringify(a)});if(!r.ok){let m='HTTP '+r.status;try{m=(await r.json()).message||m}catch(e){}throw new Error(m)}return r.json()};
 const M={DB:{link:null},offline:false,EDITBASE:'minh/'};
 M.code=()=>ls.get(CK);M.isAdmin=()=>!!ls.get(AK)&&!!ls.get(CK);
 M.checkCode=async c=>{const r=await rpc('check_code',{p_code:c});if(r.ok&&r.admin){ls.set(CK,c.trim().toUpperCase());ls.set(AK,'1')}return r};   // only Hanh's admin code is kept here
 M.reviewList=()=>rpc('review_list',{p_code:M.code()||''});
 M.confirm=ids=>rpc('confirm_changes',{p_code:M.code()||'',p_ids:ids});
 M.photoReview=()=>rpc('photo_review',{p_code:M.code()||''});
 M.photoDecide=(ids,ok)=>rpc('photo_decide',{p_code:M.code()||'',p_ids:ids,p_ok:ok});
 return M})();
(function(){if(!new URLSearchParams(location.search).has('admin')||MINH.isAdmin())return;
 const cd=$('codeDlg'),ci=$('codeIn');cd.querySelector('h2').textContent='Enter your admin code';cd.querySelector('p').textContent='Only for Hạnh. You only need to do this once on this device.';
 const shut=()=>cd.classList.remove('on');$('codeCancel').onclick=shut;
 const go=async()=>{const c=ci.value.trim();if(!c){$('codeErr').textContent='Enter the code';return}$('codeOk').textContent='Checking…';
  try{const r=await MINH.checkCode(c);$('codeOk').textContent='Continue';
   if(!r.ok||!r.admin){$('codeErr').textContent=r.ok?"That isn't an admin code":"That code isn't right";return}shut();window.ADMINUI()}
  catch(e){$('codeOk').textContent='Continue';$('codeErr').textContent=/Too many/.test(e.message)?'Too many tries — wait a few minutes':"Can't reach the family database"}};
 $('codeOk').onclick=go;ci.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
 setTimeout(()=>{cd.classList.add('on');ci.focus()},400)})();
