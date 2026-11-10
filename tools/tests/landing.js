// Entry 242 (S017, Hanh): the landing page.
//  · the plain main link shows welcome/ over the wheel, once per visit: the splash plays, the tree glides beside the
//    heading, "Open the family tree" lifts it away to the wheel underneath; links inside open in the whole window
//  · ?tree= links and the editors' page keep the splash; a second visit in the same tab opens the wheel straight away
//  · the tree never stretches; the season calendar and the winter (fall, buds) match in the splash and the landing page
// No database needed: Supabase calls get empty answers (the built-in trees come from the page itself).
// Usage: node landing.js OUT [desktop|phone]
const {chromium}=require('playwright');const fs=require('fs');
const OUT=process.argv[2]||'.',TAG=process.argv[3]||'desktop',BASE='http://localhost:8765/';
const VP=TAG==='phone'?{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}:{viewport:{width:1440,height:900}};
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+TAG+' '+m);if(!c)fail++};
 const fresh=async()=>{const c=await b.newContext(VP);await c.route('https://*.supabase.co/**',r=>r.fulfill({status:200,contentType:'application/json',body:'[]'}));
  const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));return {c,p}};

 // 1. the main link, first visit
 let {c,p}=await fresh();await p.goto(BASE);await p.waitForTimeout(600);
 ok(await p.$('#landing')!==null&&await p.$('#splash')===null,'main link: landing page over the wheel, no second splash');
 const fr=()=>p.frame({url:/welcome\/\?embed/});
 await p.waitForFunction(()=>{const f=document.getElementById('landing');return f&&f.contentDocument&&f.contentDocument.getElementById('splash')},null,{timeout:8000});
 ok(!!(await fr().$('#splash canvas')),'landing: the splash plays inside it');
 await p.screenshot({path:`${OUT}/landing-splash-${TAG}.png`});
 await fr().waitForSelector('#splash.glide',{timeout:20000});ok(true,'landing: the tree glides after the animations');
 await p.waitForTimeout(2400);
 const L=await fr().evaluate(()=>{const c=document.getElementById('heroTree'),r=c.getBoundingClientRect(),h=document.querySelector('.hero h1').getBoundingClientRect();
  return {w:r.width,h:r.height,cw:c.width,ch:c.height,right:r.left>=h.right-4,mid:Math.abs((r.top+r.bottom)/2-(h.top+h.bottom)/2),splash:!!document.getElementById('splash'),intro:document.body.classList.contains('intro'),
   tops:[...document.querySelectorAll('a[href]')].filter(a=>a.getAttribute('href')[0]!=='#').every(a=>a.target==='_top')}});
 ok(!L.splash&&!L.intro,'landing: splash gone, page shown');
 ok(L.right,`landing: the tree sits to the right of the heading`);
 ok(Math.abs(L.w/L.h-L.cw/L.ch)<0.01,`landing: the tree keeps its shape (${L.w.toFixed(0)}×${L.h.toFixed(0)} shown, ${L.cw}×${L.ch} drawn)`);
 ok(L.tops,'landing: every link opens in the whole window');
 ok(await p.evaluate(()=>[...document.body.children].filter(e=>e.id!=='landing'&&e.tagName!=='SCRIPT').every(e=>e.inert)),'wheel underneath can\'t be reached while the landing page is up');
 await p.screenshot({path:`${OUT}/landing-${TAG}.png`});
 await fr().click('.hero a.btn-primary');await p.waitForTimeout(900);
 ok(await p.$('#landing')===null,'"Open the family tree" lifts the landing page away');
 ok(await p.evaluate(()=>document.querySelectorAll('#sv path').length>50&&![...document.body.children].some(e=>e.inert)),'the wheel is there and usable');
 await p.screenshot({path:`${OUT}/landing-after-${TAG}.png`});
 // 2. same tab, main link again: straight to the wheel
 await p.goto(BASE);await p.waitForTimeout(800);ok(await p.$('#landing')===null&&await p.$('#splash')===null,'second visit in the tab: no landing, no splash');
 ok(!p.errs.length,'main link: no page errors '+p.errs.join('|'));await c.close();

 // 3. a ?tree= link keeps the splash (with the calendar)
 ({c,p}=await fresh());await p.goto(BASE+'?tree=hanh-maternal');await p.waitForTimeout(600);
 ok(await p.$('#landing')===null&&await p.$('#splash')!==null,'?tree= link: the splash, no landing page');
 await p.waitForTimeout(9000);ok(!p.errs.length,'?tree= splash: no page errors '+p.errs.join('|'));await c.close();
 // 4. a winter day on the splash: leaves fall to the ground, buds open
 ({c,p}=await fresh());await p.goto(BASE+'?tree=hanh-paternal&date=2027-01-05');await p.waitForTimeout(10500);
 await p.screenshot({path:`${OUT}/splash-winter-${TAG}.png`});ok(!p.errs.length,'winter splash (Jan 5): no page errors '+p.errs.join('|'));await c.close();
 // 5. the editors' page keeps the splash
 ({c,p}=await fresh());await p.goto(BASE+'editor/');await p.waitForTimeout(600);
 ok(await p.$('#landing')===null&&await p.$('#splash')!==null,'editors\' page: the splash, no landing page');await c.close();
 // 6. /welcome/ on its own
 ({c,p}=await fresh());await p.goto(BASE+'welcome/');await p.waitForSelector('#splash.glide',{timeout:20000});await p.waitForTimeout(2200);
 ok(await p.evaluate(()=>document.querySelector('.hero a.btn-primary').getAttribute('href')==='../'&&!/Hạnh|Hương/.test(document.body.innerText)),'/welcome/ alone: button goes to the main link; no Hạnh or Hương on the page (Entry 243)');
 ok(!p.errs.length,'/welcome/: no page errors '+p.errs.join('|'));await c.close();

 // 7. the calendar: the same answers from the splash and from the landing page (both files), on the key dates
 const plan=(file)=>{const s=fs.readFileSync(file,'utf8');return s.slice(s.indexOf('const CALENDAR'),s.indexOf('function recolor'))};
 const run=(src,d)=>{const location={search:'?date='+d};return eval(src+';seasonPlan()')};
 const A=plan(__dirname+'/../../welcome/src/splash.js'),B=plan(__dirname+'/../../v2/src/index.template.html');
 const want={'2026-11-10':'wine>purple@50','2026-12-07':'purple','2026-12-15':'purple>frost@50','2026-12-26':'frost','2027-01-01':'frost f38','2027-01-05':'frost f77 b18','2027-01-08':'frost f100 b46','2027-01-10':'pink','2027-01-17':'pink','2027-02-15':'pink>mai@50','2027-04-01':'mai>spring@50','2027-05-15':'spring>summer@50','2027-06-30':'summer>gold@50','2027-08-10':'gold>red@50','2027-09-30':'red>wine@50','2028-02-29':'mai'};
 const say=r=>(r.B?`${r.A}>${r.B}@${Math.round(r.share*100)}`:r.A)+(r.fall?' f'+Math.round(r.fall*100):'')+(r.bud?' b'+Math.round(r.bud*100):'');
 let bad=[];for(const d in want){const x=say(run(A,d)),y=say(run(B,d));if(x!==want[d]||y!==want[d])bad.push(`${d}: ${x} / ${y} (want ${want[d]})`)}
 ok(!bad.length,'calendar + winter on '+Object.keys(want).length+' dates, splash and landing page agree '+bad.join('; '));
 await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
