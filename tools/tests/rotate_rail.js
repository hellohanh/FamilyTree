// Entry 197: rotate rail above the zoom buttons (up = counter-clockwise, down = clockwise, no limit, springs back with a
// bounce) and turning by dragging only the outermost COMPLETE ring on screen; elsewhere dragging moves the wheel.
const {chromium}=require('playwright');const OUT=process.argv[2];
(async()=>{const b=await chromium.launch();let fail=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fail++};
for(const [tag,vp] of [['desktop',{viewport:{width:1440,height:900}}],['phone',{viewport:{width:412,height:891},isMobile:true,hasTouch:true,deviceScaleFactor:2}]].filter(([t])=>!process.argv[3]||t===process.argv[3])){
 const ctx=await b.newContext(vp);await ctx.route('https://quqgwvwijvwshdpwvkrk.supabase.co/**',r=>r.abort());
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('http://localhost:8765/');await p.waitForTimeout(6000);await p.evaluate(()=>{const s=document.getElementById('splash');if(s)s.click()});await p.waitForTimeout(3000);
 const cdp=tag==='phone'?await ctx.newCDPSession(p):null;
 const T=async(type,x,y)=>cdp?cdp.send('Input.dispatchTouchEvent',{type:{down:'touchStart',move:'touchMove',up:'touchEnd'}[type],touchPoints:type==='up'?[]:[{x,y}]}):(type==='down'?(await p.mouse.move(x,y),p.mouse.down()):type==='move'?p.mouse.move(x,y):p.mouse.up());
 const drag=async(x0,y0,x1,y1)=>{await T('down',x0,y0);for(let i=1;i<=10;i++)await T('move',x0+(x1-x0)*i/10,y0+(y1-y0)*i/10);await T('up');await p.waitForTimeout(400)};
 const pt=r=>p.evaluate(r=>{const R=document.getElementById('sv').getBoundingClientRect(),upp=VW/R.width;return [R.left+(V.x+r*V.k+VW/2)/upp,R.top+(V.y+VH/2)/upp]},r);
 const st=()=>p.evaluate(()=>({x:+V.x.toFixed(1),y:+V.y.toFixed(1),rot:+V.rot.toFixed(2)}));
 const ring=()=>p.evaluate(()=>turnRing()),H=await p.evaluate(()=>h.height);
 // --- the rail ---
 const rb=await p.evaluate(()=>{const r=document.getElementById('rotRail').getBoundingClientRect(),z=document.getElementById('zoomUI').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,h:r.height,above:r.bottom<=z.top}});
 ok(rb.above,`${tag}: rail sits above + ⟲ −`);
 await p.screenshot({path:`${OUT}/rail-${tag}.png`});
 let a=await st();await T('down',rb.x,rb.y);await T('move',rb.x,rb.y-40);await p.waitForTimeout(1000);let c=await st();
 const knob=()=>p.evaluate(()=>getComputedStyle(document.getElementById('rotKnob')).transform);
 ok(c.rot<a.rot-20,`${tag}: hold the knob up 1 s → turned ${(c.rot-a.rot).toFixed(0)}° (counter-clockwise)`);
 if(tag==='desktop')await p.screenshot({path:`${OUT}/rail-${tag}-pulled.png`});
 await p.waitForTimeout(1500);const c2=await st();ok(c2.rot<c.rot-20,`${tag}: keeps turning while held (no limit): ${(c2.rot-a.rot).toFixed(0)}° after 2.5 s`);
 await T('up');
 // bounce frames
 const frames=[];for(let i=0;i<14;i++){frames.push(await p.evaluate(()=>{const m=new DOMMatrix(getComputedStyle(document.getElementById('rotKnob')).transform);return +m.m42.toFixed(1)}));await p.waitForTimeout(45)}
 ok(frames.some(v=>v>0.5)&&Math.abs(frames[frames.length-1])<.3,`${tag}: let go → knob springs back past the middle and settles (${frames.join(', ')})`);
 const s1=await st();await p.waitForTimeout(600);ok(Math.abs((await st()).rot-s1.rot)<.01,`${tag}: let go → turning stops`);
 a=await st();await T('down',rb.x,rb.y);await T('move',rb.x,rb.y+45);await p.waitForTimeout(800);await T('up');c=await st();ok(c.rot>a.rot+15,`${tag}: knob down → clockwise ${(c.rot-a.rot).toFixed(0)}°`);
 ok(Math.hypot(c.x-a.x,c.y-a.y)<.1,`${tag}: the rail never moves the wheel`);
 // --- turning by the outermost complete ring ---
 ok(await ring()===H,`${tag}: at the default, the turning ring is the outermost (${await ring()} of ${H})`);
 a=await st();let [x,y]=await pt((await p.evaluate(d=>r0[d]+(r0[d+1]-r0[d])/2,H)));await drag(x,y,x,y+70);c=await st();
 ok(Math.abs(c.rot-a.rot)>3&&Math.hypot(c.x-a.x,c.y-a.y)<.5,`${tag}: drag the outer ring → turned ${(c.rot-a.rot).toFixed(1)}°`);
 a=await st();[x,y]=await p.evaluate(H=>{const R=document.getElementById('sv').getBoundingClientRect(),upp=VW/R.width,d=(r0[H+1]+60)*V.k,rx=R.left+(V.x+d+VW/2)/upp,cy=R.top+(V.y+VH/2)/upp;return rx<innerWidth-90?[rx,cy]:[R.left+(V.x+VW/2)/upp,R.top+(V.y+d+VH/2)/upp]},H);   /* whichever side has room */ await drag(x,y,x-40,y+40);c=await st();
 ok(Math.abs(c.rot-a.rot)<.01&&Math.hypot(c.x-a.x,c.y-a.y)>15,`${tag}: drag outside the wheel → moves now (${(c.x-a.x).toFixed(0)},${(c.y-a.y).toFixed(0)})`);
 a=await st();[x,y]=await pt(130);await drag(x,y,x+50,y);c=await st();ok(Math.abs(c.rot-a.rot)<.01&&Math.hypot(c.x-a.x,c.y-a.y)>20,`${tag}: drag an inner ring → moves`);
 // zoom in until the outer ring is cut off: it no longer turns; the next complete ring does
 await p.evaluate(()=>document.getElementById('zReset').click());await p.waitForTimeout(900);
 let n=0;while(await ring()===H&&n<20){await p.evaluate(()=>document.getElementById('zIn').click());await p.waitForTimeout(40);n++}await p.waitForTimeout(500);
 const d=await ring();ok(d>0&&d<H,`${tag}: zoomed in (+ ×${n}): outer ring cut off, turning ring is now ring ${d}`);
 a=await st();[x,y]=await pt(await p.evaluate(()=>{const d=h.height;return r0[d]+(r0[d+1]-r0[d])*.3}));
 const vis=x>0&&y>0&&x<vp.viewport.width-60&&y<vp.viewport.height;
 if(vis){await drag(x,y,x,y+60);c=await st();ok(Math.abs(c.rot-a.rot)<.01&&Math.hypot(c.x-a.x,c.y-a.y)>10,`${tag}: dragging the cut-off outer ring → moves, doesn't turn`)}else console.log('  (outer ring off screen there)');
 await p.evaluate(()=>document.getElementById('zReset').click());await p.waitForTimeout(900);n=0;while(await ring()===H&&n<20){await p.evaluate(()=>document.getElementById('zIn').click());await p.waitForTimeout(40);n++}await p.waitForTimeout(500);
 a=await st();[x,y]=await pt(await p.evaluate(()=>{const d=turnRing();return r0[d]+(r0[d+1]-r0[d])/2}));await drag(x,y,x,y+60);c=await st();
 ok(Math.abs(c.rot-a.rot)>3,`${tag}: dragging the complete ring ${d} → turns ${(c.rot-a.rot).toFixed(1)}°`);
 await p.screenshot({path:`${OUT}/rail-${tag}-zoomed.png`});
 // way in: no complete ring → dragging only moves
 for(let i=0;i<12;i++){await p.evaluate(()=>document.getElementById('zIn').click());await p.waitForTimeout(30)}await p.waitForTimeout(500);
 ok(await ring()===0,`${tag}: zoomed far in → no complete ring (dragging only moves; the rail still turns)`);
 // snapped / side: rail hidden
 await p.evaluate(()=>document.getElementById('zReset').click());await p.waitForTimeout(900);
 [x,y]=await pt(130);if(cdp)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y);await p.waitForTimeout(1500);
 ok(await p.evaluate(()=>!!SNAP&&getComputedStyle(document.getElementById('rotRail')).display!=='none'),`${tag}: rail stays in the snapped view (Entry 199)`);
 const box=id=>p.evaluate(i=>{const r=document.getElementById(i).getBoundingClientRect();return {t:r.top,b:r.bottom,l:r.left,r:r.right,shown:getComputedStyle(document.getElementById(i)).display!=='none'}},id);
 const R1=await box('rotRail'),Z1=await box('zoomUI'),W1=await box('whole');const ovl=(a,b)=>a.l<b.r&&b.l<a.r&&a.t<b.b&&b.t<a.b;
 ok(R1.b<=Z1.t&&!ovl(R1,W1)&&!ovl(Z1,W1),`${tag}: snapped — rail above the zoom buttons, neither covers the whole-wheel button (rail ${Math.round(R1.t)}–${Math.round(R1.b)}, zoom ${Math.round(Z1.t)}–${Math.round(Z1.b)}, whole ${Math.round(W1.t)}–${Math.round(W1.b)})`);
 await p.screenshot({path:`${OUT}/rail-${tag}-snapped.png`});
 const rs=await p.evaluate(()=>{const r=document.getElementById('rotRail').getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}});
 const uc0=await p.evaluate(()=>UC);await T('down',rs.x,rs.y);await T('move',rs.x,rs.y-40);await p.waitForTimeout(700);await T('up');await p.waitForTimeout(700);const uc1=await p.evaluate(()=>UC);
 ok(Math.abs(uc1-uc0)>.2,`${tag}: snapped — the rail scrolls along the ring (${uc0.toFixed(2)} → ${uc1.toFixed(2)})`);
 const uc2=await p.evaluate(()=>UC);await p.waitForTimeout(500);ok(Math.abs((await p.evaluate(()=>UC))-uc2)<1e-9,`${tag}: snapped — stops when let go`);
 await p.evaluate(()=>document.getElementById('next').click());await p.waitForTimeout(1200);
 ok(await p.evaluate(()=>getComputedStyle(document.getElementById('rotRail')).display!=='none'),`${tag}: still there after › (next ring)`);
 await p.evaluate(()=>document.getElementById('whole').click());await p.waitForTimeout(1200);
 ok(await p.evaluate(()=>!SNAP&&getComputedStyle(document.getElementById('rotRail')).display!=='none'),`${tag}: still there back on the whole wheel`);
 ok(errs.length===0,`${tag}: no errors ${errs.join(' | ')}`);await ctx.close()}
await b.close();console.log(fail?fail+' FAILED':'ALL PASS')})();
