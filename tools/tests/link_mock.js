const {chromium}=require('playwright');const fs=require('fs');const OUT=process.argv[2];
const DB=fs.readFileSync(__dirname+'/linkdb.json','utf8');
const DIALOG=`<div id="lkOv" style="position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;font-family:'Segoe UI',system-ui,sans-serif;color:#f1ece4">
<div style="width:560px;max-width:100%;max-height:100%;overflow:auto;box-sizing:border-box;background:#1e1e1e;border:1px solid #333;border-top:3px solid #D9A521;border-radius:16px;padding:20px 22px;box-shadow:0 20px 60px rgba(0,0,0,.6)">
 <div style="font-size:12px;font-weight:700;letter-spacing:.12em;color:#D9A521;text-transform:uppercase;margin-bottom:8px">🔗 Already in another tree</div>
 <div style="font-size:19px;font-weight:700;margin-bottom:14px">Is this Bà Thương from <span style="color:#D9A521">Hạnh's Paternal Grandpa</span>?</div>
 <div style="display:flex;align-items:center;gap:12px;background:#262626;border:1.5px solid #D9A521;border-radius:10px;padding:8px 12px 8px 8px">
  <img src="../v2/assets/avatars/set2-black-white-female.webp" style="width:48px;height:48px;border-radius:4px">
  <div style="flex:1"><div style="font-size:16px;font-weight:700">Thương (Tường)</div><div style="font-size:12.5px;color:#9a948a">vợ của Hai · mẹ của Văn, Chương, Dương, Hùng, Thanh, Tường</div></div>
  <img src="../assets/wings_marigold.png" style="width:48px;height:24px">
 </div>
 <div style="font-size:13.5px;margin:14px 0 6px">Linking her adds the family already in that tree — <b>45 people</b>:</div>
 <div style="font-size:13px;line-height:1.55;color:#d8d2c8;background:#191919;border-radius:10px;padding:10px 12px">
  <div><b style="color:#f1ece4">Ông Hai</b> — her husband</div>
  <div style="margin-top:4px;color:#9a948a">Their children's families</div>
  <div>Văn &amp; Trung · 11 &nbsp;·&nbsp; Chương &amp; Kỳ · 4 &nbsp;·&nbsp; Dương · 1 &nbsp;·&nbsp; Hùng &amp; Kim Ánh · 5 &nbsp;·&nbsp; Thanh &amp; Thái · 6</div>
  <div style="margin-top:4px;color:#9a948a">From her first marriage</div>
  <div>Tường &amp; Kỳ's family · 17 &nbsp;<span style="color:#9a948a">(her first husband shows as ?? until you add him)</span></div>
 </div>
 <div style="font-size:12px;color:#9a948a;margin-top:10px">These people are shared: one record in both trees. A change you make shows in Hạnh's tree too, once Hạnh confirms it.</div>
 <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;justify-content:flex-end">
  <button style="all:unset;cursor:pointer;padding:9px 18px;border-radius:999px;border:1px solid #555;font-size:14.5px">No, a different Thương</button>
  <button style="all:unset;cursor:pointer;padding:9px 20px;border-radius:999px;background:#D9A521;color:#161616;font-weight:700;font-size:14.5px">Yes, link her</button>
 </div></div></div>`;
(async()=>{const b=await chromium.launch();
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]]){
 const p=await (await b.newContext(vp)).newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 // before: Test Cha & Test Mẹ with Thương just saved
 await p.goto('http://localhost:8765/minh/index.html');
 await p.evaluate(()=>localStorage.setItem('hft-minh-v1',JSON.stringify({v:1,people:{p1:{first:'Test Cha',g:'M',dead:true},p2:{first:'Test Mẹ',g:'F',dead:true},p3:{first:'Thương',g:'F'}},root:{k:['p1','p2'],c:[{k:['p3'],c:[]}]}})));
 await p.reload();await p.waitForTimeout(5000);await p.mouse.click(200,300);await p.waitForTimeout(800);
 await p.evaluate(()=>document.getElementById('pSimple').click());await p.waitForTimeout(4000);
 await p.evaluate(h=>document.body.insertAdjacentHTML('beforeend',h),DIALOG);await p.waitForTimeout(400);
 await p.screenshot({path:`${OUT}/link-${tag}-1-offer.png`});
 // after "Yes, link her"
 await p.evaluate(db=>localStorage.setItem('hft-minh-v1',db),DB);await p.reload();await p.waitForTimeout(5000);await p.mouse.click(200,300);await p.waitForTimeout(800);
 await p.evaluate(()=>{FOCAL=CP['N264'];paintFocal();document.getElementById('pSimple').click()});await p.waitForTimeout(4500);
 await p.screenshot({path:`${OUT}/link-${tag}-2-simple.png`});
 await p.evaluate(()=>document.getElementById('pWhole').click());await p.waitForTimeout(1500);
 await p.evaluate(()=>{FOCAL=null;paintFocal();labels()});await p.waitForTimeout(500);
 await p.screenshot({path:`${OUT}/link-${tag}-3-wheel.png`});
 console.log(tag,errs);}
await b.close()})();
