// Entry 206: the editors' page "Same person?" offer — adding Lịch under her parents in a new tree offers Bà Lịch from
// Hạnh's Paternal tree; Yes copies her branch (Lịch & Hai only + their children's families) as shared records.
const {chromium}=require('playwright');const live=require('./livedb.js');const OUT=process.argv[2];
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 // a fresh test tree: Lịch's parents (needs nothing beyond publish_reset.sh)
 await L.q('reset role');await L.q("delete from trees where link='lich-test'");
 await L.q(`select public.create_tree('HANHTRANX','lich-test','Lịch test','{"k":["lt-f","lt-m"],"c":[]}'::jsonb,'{"lt-f":{"first":"Cha","middle":"","last":"","alt":"","g":"M","dead":true},"lt-m":{"first":"Mẹ","middle":"","last":"","alt":"","g":"F","dead":true}}'::jsonb)`);await L.q('set role anon');
 const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(()=>{try{sessionStorage.setItem('hft-splash-seen','1');localStorage.setItem('hft-minh-code','HANHTRANX');localStorage.setItem('hft-minh-admin','1')}catch(e){}});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:8765/editor/?tree=lich-test');await p.waitForTimeout(7000);
 // add a daughter "Lịch" under the centre couple, the way the editor does, then save through the offer
 await p.evaluate(()=>{const id=MINH.newId();MINH.DB.people[id]={first:'Lịch',middle:'',last:'',alt:'',g:'F',dead:true};MINH.DB.root.c.push({k:[id],c:[]});window._new=id});
 ok(await p.evaluate(()=>window.GENCHECK(window._new)),'adding Lịch under her parents → a match is found');
 await p.evaluate(()=>window.GENOFFER(window._new,()=>{window._saved=MINH.save(null)}));await p.waitForTimeout(600);
 const dlg=await p.evaluate(()=>({on:document.getElementById('linkDlg').classList.contains('on'),t:document.getElementById('lkTitle').innerText,sub:document.getElementById('lkSub').innerText,cnt:document.getElementById('lkCount').innerText,list:document.getElementById('lkList').innerText,yes:document.getElementById('lkYes').innerText}));
 ok(dlg.on&&/Lịch/.test(dlg.t)&&/Paternal Grandpa/.test(dlg.t),`offer: "${dlg.t}"`);console.log('   ',dlg.sub,'|',dlg.cnt,'|',dlg.list.replace(/\n/g,' / '),'|',dlg.yes);
 ok(!/Thương \(Tường\)|Văn|Chương|Dương|Hùng|Thanh/.test(dlg.list),'only Lịch & Hai and their children — not Bà Thương\'s side');
 await p.screenshot({path:`${OUT}/same-offer.png`});
 await p.click('#lkYes');await p.waitForTimeout(2500);
 const r=await p.evaluate(async()=>await window._saved);ok(r&&r.ok,`saved (${JSON.stringify(r)})`);
 await L.q('reset role');const t=(await L.q("select doc from trees where link='lich-test'")).rows[0];
 const doc=t?t.doc:null;
 const hasLich=JSON.stringify(doc).match(/"hp:[A-Z0-9]+"/g)||[];
 const kids=doc&&doc.c[0]?doc.c[0].c.length:0;
 ok(doc&&doc.c[0].k.length===2&&doc.c[0].k.every(x=>x.startsWith('hp:'))&&kids===4,`Lịch's box ${doc&&JSON.stringify(doc.c[0].k)} with ${kids} children's families; ${hasLich.length} shared people`);
 const names=(await L.q("select string_agg(data->>'first',', ' order by id) n from people where id = any($1)",[doc.c[0].c.map(c=>c.k[0])])).rows[0].n;await L.q('set role anon');
 ok(/Hiền/.test(names)&&/Hậu/.test(names)&&/Lành/.test(names)&&/Soeur Trung/.test(names),`her children: ${names}`);
 // the main page (admin) shows the tree; The Multiverse links it with Hạnh's Paternal tree
 const m=await ctx.newPage();await m.goto('http://localhost:8765/?tree=lich-test');await m.waitForTimeout(7000);
 ok(await m.evaluate(()=>Object.values(CP).some(x=>x.nm==='Hậu')),'main page: Lịch\'s tree opens with Hậu in it');
 await m.screenshot({path:`${OUT}/same-main.png`});
 const q=await ctx.newPage();await q.addInitScript(()=>{try{localStorage.setItem('hft-3d-pick',JSON.stringify(['hanh-paternal','lich-test']));localStorage.removeItem('hft-3d-order')}catch(e){}});
 await q.goto('http://localhost:8765/3d/');await q.waitForTimeout(7000);await q.click('#go');await q.waitForTimeout(800);if(await q.evaluate(()=>document.getElementById('ordDlg').classList.contains('on')))await q.click('#ordOK');await q.waitForTimeout(3500);
 const th=await q.evaluate(()=>[...new Set(threads.map(t=>t.userData.per[0].w.nm))]);ok(th.length>=30,`The Multiverse links ${th.length} people between the two trees (${th.slice(0,8).join(', ')}…)`);
 await q.screenshot({path:`${OUT}/same-3d.png`});
 ok(errs.length===0,`no errors ${errs.join(' | ')}`);await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
