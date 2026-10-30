// Entry 207b: edit pop-up — every child (and sibling) row has a grip; drag (mouse or finger) puts them in a new birth
// order; Save keeps it. Main page (Hanh, Edit on → straight in; Edit off → an "Order" line in Review changes) and the
// editors' page (saved into the tree). Local database copy (publish_reset.sh first). Usage: node child_order.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const who=async(c,edit)=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(([c,e])=>{try{sessionStorage.setItem('hft-splash-seen','1');if(e)sessionStorage.setItem('hft-edit-on','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},[c,edit]);return ctx};
 const open=async(ctx,url,wait=6500)=>{const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto('http://localhost:8765'+url);await p.waitForTimeout(wait);return p};
 const rows=p=>p.evaluate(()=>[...document.querySelectorAll('#edList .li')].map(r=>(r.querySelector('.card.new')?'NEW:':'')+r.querySelector('.card').textContent.replace(/⠿|↑|↓/g,'').replace(/^(Con( Nuôi)?|Em|Anh|Chị)/,'').split('&')[0].trim()));
 const drag=async(p,fromIdx,toIdx)=>{const g=await p.$$('#edList .li .grip');const a=await g[fromIdx].boundingBox(),t=await (await p.$$('#edList .li'))[toIdx].boundingBox();
  await p.mouse.move(a.x+a.width/2,a.y+a.height/2);await p.mouse.down();await p.mouse.move(a.x+a.width/2,t.y+4,{steps:12});await p.waitForTimeout(150);await p.mouse.up();await p.waitForTimeout(300)};
 const kids=(p,nm)=>p.evaluate(nm=>{const q=Object.values(CP).find(x=>x.nm===nm);const f=MINH.find(q.cell);return (f.node.c||[]).map(c=>MINH.disp(MINH.DB.people[c.k[0]]))},nm);
 // ---------- main page, Hanh, Edit on ----------
 let ctx=await who(ADMIN,true),p=await open(ctx,'/');
 const k0=await kids(p,'Hậu');
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Hậu')));await p.waitForTimeout(800);
 let R=await rows(p);const nG=await p.evaluate(()=>document.querySelectorAll('#edList .grip').length);
 ok(nG===R.length&&R.length===k0.length+1,`${TAG} main: a grip on every row (${nG} grips, ${R.length} rows: ${R.join(' · ')})`);
 await p.evaluate(()=>document.querySelector('#edList').scrollIntoView({block:'center'}));
 await drag(p,k0.length-1,0);R=await rows(p);
 ok(R[0]===k0[k0.length-1],`${TAG} main: dragged ${k0[k0.length-1]} to the top (${R.join(' · ')})`);
 await drag(p,k0.length,1);R=await rows(p);ok(/^NEW/.test(R[1]),`${TAG} main: the new row drags too (${R.join(' · ')})`);
 // mid-drag look
 {const g=await p.$$('#edList .li .grip');const a=await g[2].boundingBox();await p.mouse.move(a.x+5,a.y+5);await p.mouse.down();await p.mouse.move(a.x+5,a.y-30,{steps:5});await p.waitForTimeout(200);
  await p.screenshot({path:`${OUT}/order-${TAG}-dragging.png`});await p.mouse.up();await p.waitForTimeout(300)}
 R=await rows(p);const want=R.filter(x=>!/^NEW/.test(x));
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(7500);
 const k1=await kids(p,'Hậu');
 ok(JSON.stringify(k1)===JSON.stringify(want),`${TAG} main: saved — after the reload ${k1.join(' · ')}`);
 const u=(await L.q("select status,ops from updates order by id desc limit 1")).rows[0];
 ok(u&&u.status==='ok'&&u.ops.some(o=>o.op==='order'),`${TAG} main: one "order" update, confirmed straight in (${u&&u.status})`);
 ok(!p.errs.length,`${TAG} main: no page errors ${p.errs.join('|')}`);
 // put back with Edit off → Review shows the Order line; Confirm applies it
 await p.evaluate(()=>document.getElementById('pEditOn').click());await p.waitForTimeout(500);
 await p.evaluate(()=>window.EDIT(Object.values(CP).find(x=>x.nm==='Hậu')));await p.waitForTimeout(800);
 await drag(p,0,k0.length);await p.evaluate(()=>{document.getElementById('nF').value='';document.getElementById('edSave').click()});await p.waitForTimeout(7500);
 const pend=(await L.q("select id,ops from updates where status='pending'")).rows;
 ok(pend.length===1&&pend[0].ops.length===1&&pend[0].ops[0].op==='order',`${TAG} main: Edit off → only the order change waits for review`);
 await p.evaluate(()=>document.getElementById('pReview').click());await p.waitForTimeout(2500);
 const line=await p.evaluate(()=>{const t=[...document.querySelectorAll('#revBody .ln')].find(l=>/Order/.test(l.textContent));return t?t.textContent:''});
 ok(/Hậu.*children/.test(line)&&/1\. /.test(line),`${TAG} main: Review changes → "${line.slice(0,90)}"`);
 await p.screenshot({path:`${OUT}/order-${TAG}-review.png`});
 await p.evaluate(id=>document.querySelector(`[data-upd="${id}"][data-ok="1"]`).click(),pend[0].id);await p.waitForTimeout(2000);
 await p.reload();await p.waitForTimeout(6500);const k2=await kids(p,'Hậu');
 ok(k2[k2.length-1]===want[0]&&!k2.includes(undefined),`${TAG} main: confirmed → ${k2.join(' · ')}`);
 await ctx.close();
 // ---------- editors' page (Minh's tree) ----------
 ctx=await who({'hft-minh-code':'HANHTRANX','hft-minh-admin':'1'});p=await open(ctx,'/editor/?tree=son-s-trung-van-paternal-grandparents',7000);
 const par=await p.evaluate(()=>{const q=Object.values(CP).find(x=>{const f=MINH.find(x.cell);return f&&f.i===0&&(f.node.c||[]).length>=2});return q&&q.nm});
 if(!par){console.log('  (no family with 2+ children on Sơn\'s tree — skipped)')}else{
  const e0=await kids(p,par);await p.evaluate(nm=>window.EDIT(Object.values(CP).find(x=>x.nm===nm)),par);await p.waitForTimeout(800);
  await drag(p,1,0);await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(7000);
  const e1=await kids(p,par);ok(e1[0]===e0[1]&&e1[1]===e0[0],`${TAG} editors' page: ${par}'s children ${e0.join(' · ')} → ${e1.join(' · ')}`);
  ok(!p.errs.length,`${TAG} editors' page: no page errors ${p.errs.join('|')}`)}
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
