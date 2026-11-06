// Entry 230 (Hanh): "Tinh does not have the chip title on his card when I'm focused. Also, when Tinh is focused, my card
// does not show a title chip either" → Đỡ Đầu both ways, across trees. Hạnh (Grandpa tree) picks Tịnh (Minh's tree) as
// godfather; Hạnh focal → Minh's tree: Tịnh "Đỡ Đầu"; Tịnh focal → Grandpa tree: Hạnh "Con Đỡ Đầu". Same tree: Thu as
// Hạnh's Confirmation godparent → Hạnh focal: Thu "…|Đỡ Đầu"; Thu focal: Hạnh "…|Con Đỡ Đầu".
// Local copy: the 'thuong' tree (version 12-equivalent) + Tịnh under Bình (god/setup.sql). Usage: node godparent_both.js OUT [desktop|phone]
const {chromium}=require('playwright');const live=require('./livedb.js');
const OUT=process.argv[2],TAG=process.argv[3]||'desktop';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
const ADMIN={'hft-minh-code':'HANHTRANX','hft-minh-admin':'1','hft-family-code':'FAM123','hft-photo-sender':'Hanh'};
const TINH='u-mw514qw37cuc';
(async()=>{const L=await live('hft29');const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
 const ctx=await b.newContext(VP);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',L.answer);
 await ctx.addInitScript(c=>{try{if(!sessionStorage.getItem('t-init')){sessionStorage.setItem('t-init','1');sessionStorage.setItem('hft-edit-on','1')}sessionStorage.setItem('hft-splash-seen','1');for(const [k,v] of Object.entries(c))localStorage.setItem(k,v)}catch(x){}},ADMIN);
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const go=async u=>{await p.goto('http://localhost:8765'+u);await p.waitForTimeout(7000)};
 const HANH="Object.values(CP).find(x=>/AF241/.test(x.cell))";
 const god=async(kind,name,re)=>{await p.evaluate(k=>{const c=document.querySelector(`#eGod .gpr[data-k=${k}] .gc`);if(!c.checked)c.click()},kind);await p.waitForTimeout(1500);
  await p.fill(`#eGod .gpr[data-k=${kind}] .gn`,'');await p.focus(`#eGod .gpr[data-k=${kind}] .gn`);await p.keyboard.type(name);await p.waitForTimeout(2500);
  return p.evaluate(([k,re])=>{const h=[...document.querySelectorAll(`#eGod .gpr[data-k=${k}] .gpl button`)].find(x=>new RegExp(re).test(x.innerText));if(h)h.click();return h?h.innerText.replace(/\s+/g,' '):null},[kind,re])};
 const simple=async(name)=>{await p.evaluate(()=>{ANCHOR=FOCAL||ANCHOR;document.getElementById('pSimple').click()});await p.waitForTimeout(3500);await p.screenshot({path:`${OUT}/${name}-${TAG}.png`})};
 // Hạnh: Baptism Tịnh (Minh's tree), Confirmation Thu (same tree)
 await go('/');await p.evaluate(new Function('window.EDIT('+HANH+')'));await p.waitForTimeout(900);
 const a=await god('baptism','Tịnh','Tịnh'),c=await god('confirmation','Thu','^Thu\\s*con');
 ok(a&&c,`${TAG}: picked "${a}" and "${c}"`);
 await p.evaluate(()=>document.getElementById('edSave').click());await p.waitForTimeout(9000);
 const g=await p.evaluate(new Function('return MINH.DB.people['+HANH+'.cell].god'));
 ok(g&&g.baptism&&g.baptism.id===TINH&&g.confirmation&&g.confirmation.id,`${TAG}: saved ${JSON.stringify(g)}`);
 // same tree, both ways
 await p.evaluate(new Function('FOCAL='+HANH+';paintFocal()'));await p.waitForTimeout(500);
 const tThu=await p.evaluate(new Function("const h="+HANH+";const id=MINH.DB.people[h.cell].god.confirmation.id;const t=Object.values(CP).find(x=>(window.PID?PID(x.cell):x.cell)===id);return titleOf(h.cell,t.cell)"));
 ok(/\|Đỡ Đầu$/.test(tThu),`${TAG}: Hạnh focal → Thu "${tThu}"`);
 const tH=await p.evaluate(new Function("const h="+HANH+";const id=MINH.DB.people[h.cell].god.confirmation.id;const t=Object.values(CP).find(x=>(window.PID?PID(x.cell):x.cell)===id);return titleOf(t.cell,h.cell)"));
 ok(/Con Đỡ Đầu$/.test(tH),`${TAG}: Thu focal → Hạnh "${tH}"`);
 // Hạnh focal → Minh's tree: Tịnh "Đỡ Đầu"
 await go('/?tree=thuong');
 const tT=await p.evaluate(c=>window.XT?titleOf(null,c):'(no titles here)',TINH);
 ok(/Đỡ Đầu$/.test(tT)&&!/Con/.test(tT),`${TAG}: Hạnh focal, Minh's tree → Tịnh "${tT}" (pill: ${await p.evaluate(()=>(document.getElementById('xtPill')||{}).innerText||'none')})`);
 await p.evaluate(c=>{ANCHOR=CP[c];FOCAL=null;document.getElementById('pSimple').click()},'u-mw3n3xeugena');await p.waitForTimeout(3500);await p.screenshot({path:`${OUT}/god-tinh-${TAG}.png`});
 ok(await p.evaluate(()=>[...document.querySelectorAll('#simple text')].some(t=>t.textContent==='Đỡ Đầu')),`${TAG}: Simple view draws the Đỡ Đầu chip on Tịnh`);
 // Tịnh focal → Grandpa tree: Hạnh "Con Đỡ Đầu"
 await p.evaluate(()=>document.getElementById('pClear').click());await p.waitForTimeout(500);
 await p.evaluate(c=>{FOCAL=CP[c];paintFocal()},TINH);await p.waitForTimeout(800);
 await go('/');
 const tH2=await p.evaluate(new Function('return window.XT?titleOf(null,'+HANH+'.cell):"(no titles here)"'));
 ok(/Con Đỡ Đầu$/.test(tH2),`${TAG}: Tịnh focal, Grandpa tree → Hạnh "${tH2}" (pill: ${await p.evaluate(()=>(document.getElementById('xtPill')||{}).innerText||'none')})`);
 await p.evaluate(new Function("const h="+HANH+";ANCHOR=h.d.parent?CP[h.d.parent.k?h.d.parent.k[0]:'']||h:h;FOCAL=null;document.getElementById('pSimple').click()"));await p.waitForTimeout(3500);await p.screenshot({path:`${OUT}/god-hanh-${TAG}.png`});
 ok(await p.evaluate(()=>[...document.querySelectorAll('#simple text')].some(t=>t.textContent==='Con Đỡ Đầu')),`${TAG}: Simple view draws "Con Đỡ Đầu" on Hạnh`);
 ok(!errs.length,`${TAG}: no page errors ${errs.join('|')}`);
 await b.close();await L.end();console.log(fail?fail+' FAILED':'ALL PASS')})();
