// Entry 201: publishing trees — the public, Minh (his editor code) and Hanh (admin), against the local database copy
// (run tools/tests/publish_reset.sh first). Usage: node publish_live.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const SON='son-s-trung-van-paternal-grandparents';
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const who=async(codes)=>{const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
  await ctx.addInitScript(c=>{try{sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(e){}},codes);return ctx};
 const open=async(ctx,url,wait=6500)=>{const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto('http://localhost:8765'+url);await p.waitForTimeout(wait);return p};
 const trees=p=>p.evaluate(()=>[...document.querySelectorAll('#pane a.item')].filter(a=>/tree=|\.\/$/.test(a.getAttribute('href')||'')).map(a=>a.querySelector('.grow').firstChild.textContent.trim()+' | '+(a.querySelector('.sub')||{}).textContent));
 const ppl=p=>p.evaluate(()=>typeof CP==='undefined'?[]:Object.values(CP).map(x=>x.nm));
 // ---------- the public ----------
 let ctx=await who({});
 let p=await open(ctx,'/');let T=await trees(p);
 ok(T.some(t=>/Sơn's/.test(t))&&T.some(t=>/Hậu\/Thường/.test(t))&&!T.some(t=>/Unnamed tree/.test(t)),`${TAG} public: TREES has the 2 published trees, not Minh's (${T.length} trees)`);
 await p.screenshot({path:`${OUT}/pub-${TAG}-public-pane.png`});
 p=await open(ctx,'/?tree='+SON);
 ok(new URL(p.url()).pathname==='/'&&/Sơn's/.test(await p.title()),`${TAG} public: Sơn's tree opens on the main page (${new URL(p.url()).pathname} · ${await p.title()})`);
 ok((await ppl(p)).includes('Văn')&&(await ppl(p)).length>50,`${TAG} public: its people are there (${(await ppl(p)).length})`);
 ok(await p.evaluate(()=>!document.querySelector('.pen')),`${TAG} public: no pencils`);
 await p.screenshot({path:`${OUT}/pub-${TAG}-public-son.png`});ok(!p.errs.length,`${TAG} public: no errors ${p.errs.join('|')}`);
 p=await open(ctx,'/?tree=thuong',7500);
 ok(!/tree=thuong/.test(p.url())&&/Paternal Grandpa/.test(await p.title()),`${TAG} public: Minh's unpublished tree → the default tree instead (${await p.title()})`);
 ok(/isn’t published/.test(await p.evaluate(()=>document.getElementById('toast').textContent)),`${TAG} public: "That tree isn’t published yet"`);
 p=await open(ctx,'/minh/?tree=thuong',4000);
 ok(/\/editor\/\?tree=thuong/.test(p.url()),`${TAG} public: the old /minh/ link → ${new URL(p.url()).pathname+new URL(p.url()).search}`);
 ok(await p.evaluate(()=>document.getElementById('codeDlg').classList.contains('on')&&/isn’t published/.test(document.getElementById('mNotice').textContent)),`${TAG} public: /editor/ on an unpublished tree asks for the code`);
 await p.screenshot({path:`${OUT}/pub-${TAG}-editor-locked.png`});
 // the database itself: nothing of Minh's tree reaches the public
 ok((await L.q("select count(*)::int n from trees where link='thuong'")).rows[0].n===0&&(await L.q("select count(*)::int n from people where id like 'minh-%'")).rows[0].n===0,`${TAG} public: the database hands out neither Minh's tree nor its people`);
 await ctx.close();
 // ---------- Minh (editor code, his tree: thuong) ----------
 ctx=await who({'hft-minh-code':'MINHTRANX'});
 p=await open(ctx,'/?tree=thuong',7000);
 ok(/\/editor\/\?tree=thuong/.test(p.url()),`${TAG} Minh: /?tree=thuong (his own) → the editors' page`);
 ok(await p.evaluate(()=>MINH.DB&&MINH.DB.link==='thuong'&&!MINH.locked),`${TAG} Minh: his unpublished tree opens with his code`);
 const pb=()=>p.evaluate(()=>{const b=document.getElementById('pPublish');return b?b.getAttribute('aria-pressed')+' | '+b.querySelector('.sub').textContent:null});
 ok(/^false/.test(await pb()||''),`${TAG} Minh: Published switch shown, off (${await pb()})`);
 if(TAG==='phone')await p.evaluate(()=>document.body.classList.add('pane-open'));await p.waitForTimeout(400);
 await p.evaluate(()=>document.getElementById('pPublish').scrollIntoView({block:'center'}));await p.screenshot({path:`${OUT}/pub-${TAG}-minh-switch.png`});
 await p.evaluate(()=>document.getElementById('pPublish').click());await p.waitForTimeout(1200);
 ok(/^true/.test(await pb()||'')&&(await L.q("select count(*)::int n from trees where link='thuong'")).rows[0].n===1,`${TAG} Minh: Publish → public at once (${await pb()})`);
 let q=await open(await who({}),'/?tree=thuong');ok(/tree=thuong/.test(q.url())&&new URL(q.url()).pathname==='/',`${TAG} public: Minh's tree now opens on the main page`);
 await p.evaluate(()=>document.getElementById('pPublish').click());await p.waitForTimeout(1200);
 ok(/^false/.test(await pb()||'')&&(await L.q("select count(*)::int n from trees where link='thuong'")).rows[0].n===0,`${TAG} Minh: Unpublish → private again`);
 p=await open(ctx,'/?tree='+SON);ok(new URL(p.url()).pathname==='/',`${TAG} Minh: a published tree that isn't his opens on the main page`);
 await ctx.close();
 // ---------- Hanh (admin) ----------
 ctx=await who({'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'});
 p=await open(ctx,'/');T=await trees(p);
 ok(T.some(t=>/Unnamed tree \| .*not published/.test(t)),`${TAG} Hanh: TREES also has Minh's tree, marked (${T.find(t=>/Unnamed/.test(t))})`);
 await p.screenshot({path:`${OUT}/pub-${TAG}-hanh-pane.png`});
 p=await open(ctx,'/?tree=thuong');
 ok(new URL(p.url()).pathname==='/'&&/tree=thuong/.test(p.url())&&await p.evaluate(()=>!!document.getElementById('unpubTag')),`${TAG} Hanh: Minh's unpublished tree opens on the main page, marked "not published"`);
 const hp=()=>p.evaluate(()=>{const b=document.getElementById('pPublish');return b?b.getAttribute('aria-pressed'):null});
 ok(await hp()==='false',`${TAG} Hanh: Admin → Published switch (off)`);
 await p.evaluate(()=>document.getElementById('pPublish').click());await p.waitForTimeout(1200);ok(await hp()==='true'&&(await L.q("select count(*)::int n from trees where link='thuong'")).rows[0].n===1,`${TAG} Hanh: publishes it`);
 await p.evaluate(()=>document.getElementById('pPublish').click());await p.waitForTimeout(1200);ok(await hp()==='false',`${TAG} Hanh: unpublishes it`);
 await p.screenshot({path:`${OUT}/pub-${TAG}-hanh-unpub.png`});
 // family Edit Tree on Sơn's tree → pending → Hanh confirms → written into the tree
 p=await open(ctx,'/?tree='+SON);
 await p.evaluate(()=>{const q=Object.values(CP).find(x=>x.nm==='Trung');MINH.DB.people[q.cell].alt='Test';});
 const sent=await p.evaluate(async()=>await MINH.save(null));ok(sent.ok,`${TAG} family: an Edit Tree change to Trung on Sơn's tree is sent (${JSON.stringify(sent)})`);
 const uid=(await L.q("select id from updates order by id desc limit 1")).rows[0].id;
 // through the real Review changes dialog: Confirm
 await p.evaluate(()=>document.getElementById('pReview').click());await p.waitForTimeout(2500);
 await p.screenshot({path:`${OUT}/pub-${TAG}-review.png`});
 const btn=await p.evaluate(id=>{const b=document.querySelector(`[data-upd="${id}"][data-ok="1"]`);if(b)b.click();return !!b},uid);await p.waitForTimeout(2500);
 const row=(await L.q("select data->>'alt' a from people where id='hp:W317'")).rows[0],ver=(await L.q("select version from trees where link=$1",[SON])).rows[0];
 ok(btn&&row&&row.a==='Test',`${TAG} Hanh: Review changes → Confirm → written into Sơn's tree (Trung's nickname "${row&&row.a}", version ${ver&&ver.version})`);
 // Hạnh's tree ↔ Sơn's tree: an update on Văn in Hạnh's tree shows in Sơn's tree, and the other way round
 await L.q("reset role");await L.q(`insert into updates(sender,summary,ops,status) values ('T','x','[{"t":"hanh-paternal","id":"W315","op":"edit","set":{"middle":"Thị"}}]','ok'),('T','y','[{"t":"${SON}","id":"hp:AF320","op":"edit","set":{"middle":"Văn"}}]','ok')`);await L.q("set role anon");
 p=await open(await who({}),'/?tree='+SON);const v1=await p.evaluate(()=>MINH.DB.people['hp:W315'].middle);
 p=await open(await who({}),'/');const v2=await p.evaluate(()=>MINH.DB.people['AF320'].middle);
 ok(v1==='Thị'&&v2==='Văn',`${TAG}: an update in one tree shows on the shared person in the other (${v1} / ${v2})`);
 // The Multiverse: public 2 database trees; Hanh 3
 const n3=async c=>{const x=await open(await who(c),'/3d/',6000);return x.evaluate(()=>TREES.filter(t=>!['hanh-paternal','hanh-maternal','huong-paternal','huong-maternal'].includes(t.link)).map(t=>t.name))};
 const a1=await n3({}),a2=await n3({'hft-minh-code':'HANHTRANX','hft-minh-admin':'1'});
 ok(a1.length===2&&a2.length===3&&a2.some(n=>/not published/.test(n)),`${TAG} The Multiverse: public ${a1.length} database trees, Hanh ${a2.length} (${a2.join(' · ')})`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
